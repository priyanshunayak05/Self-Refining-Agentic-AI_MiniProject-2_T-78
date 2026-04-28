import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Filter, CheckCircle, XCircle, AlertTrixangle,
  Eye, Trash2, RefreshCw, X,
  Archive, FileText, Hash, Target, BarChart3, Zap,
} from 'lucide-react';

import { format } from 'date-fns';
import { logsArchiveService } from '../../services/logsArchive.service';
import DownloadButton from '../../components/DownloadButton/DownloadButton';
import toast from 'react-hot-toast';

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  success:  { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', label: 'Success'  },
  refined:  { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30',   label: 'Refined'  },
  failed:   { icon: XCircle,       color: 'text-red-400',     bg: 'bg-red-500/15',     border: 'border-red-500/30',     label: 'Failed'   },
};

const DATE_FILTERS = [
  { id: 'all',    label: 'All Time'    },
  { id: 'today',  label: 'Today'       },
  { id: '7days',  label: 'Last 7 Days' },
  { id: '30days', label: 'Last 30 Days'},
];

const STATUS_FILTERS = [
  { id: 'all',     label: 'All Status' },
  { id: 'success', label: 'Success'    },
  { id: 'refined', label: 'Refined'    },
  { id: 'failed',  label: 'Failed'     },
];

// ── Score badge ───────────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
  const color = score >= 90 ? 'text-emerald-400 bg-emerald-500/15' : score >= 70 ? 'text-amber-400 bg-amber-500/15' : 'text-red-400 bg-red-500/15';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {score}/100
    </span>
  );
};

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.success;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

// ── Full Logs Modal ───────────────────────────────────────────────────────────
const LogsModal = ({ entry, onClose }) => {
  const [activeTab, setActiveTab] = useState('output');
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!entry) return null;

  const tabs = [
    { id: 'output',   label: 'Final Output', icon: FileText },
    { id: 'plan',     label: 'Plan',         icon: Target   },
    { id: 'critique', label: 'Critique',     icon: BarChart3},
    { id: 'agents',   label: 'Agent Logs',   icon: Zap      },
    { id: 'meta',     label: 'Metadata',     icon: Hash     },
  ];

  const AgentLogSection = ({ title, logs, color }) => (
    <div className="mb-4">
      <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 ${color}`}>{title}</h4>
      <div className="bg-dark-900 rounded-lg p-3 space-y-1 border border-dark-700">
        {logs?.length > 0 ? (
          logs.map((log, i) => (
            <p key={i} className="text-xs font-mono text-gray-400 leading-relaxed">{log}</p>
          ))
        ) : (
          <p className="text-xs text-gray-600 italic">No logs captured for this agent.</p>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-dark-800 border border-dark-600 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-dark-700">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <Archive className="w-5 h-5 text-primary-400 flex-shrink-0" />
              <h2 className="text-base font-bold truncate">Execution Log Details</h2>
              <StatusBadge status={entry.status} />
            </div>
            <p className="text-sm text-gray-400 truncate ml-8">{entry.goal}</p>
            <div className="flex items-center gap-4 mt-2 ml-8 text-xs text-gray-500">
              <span className="font-mono">{entry.id}</span>
              <span>·</span>
              <span>{format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
              <span>·</span>
              <ScoreBadge score={entry.qualityScore} />
              <span>·</span>
              <span>{entry.iterationsRan} iter.</span>
              {entry.duration && <><span>·</span><span>{(entry.duration / 1000).toFixed(2)}s</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <DownloadButton entry={entry} size="sm" label="Export" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-700 px-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-primary-400 border-primary-400'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'output' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {entry.refinedResult ? 'Refined Final Output' : 'Final Output'}
              </p>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-dark-900 rounded-xl p-4 border border-dark-700">
                {entry.refinedResult || entry.executionResult || 'No output captured.'}
              </pre>
            </div>
          )}

          {activeTab === 'plan' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {entry.refinedPlan ? 'Refined Plan (Post Self-Refinement)' : 'Execution Plan'}
              </p>
              <pre className="text-sm text-amber-200/80 whitespace-pre-wrap font-mono leading-relaxed bg-dark-900 rounded-xl p-4 border border-dark-700">
                {entry.refinedPlan || entry.plan || 'No plan captured.'}
              </pre>
            </div>
          )}

          {activeTab === 'critique' && (
            <div className="space-y-4">
              {entry.critique ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-900 rounded-xl p-4 border border-red-500/20">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Issues Found</p>
                      {entry.critique.issuesFound?.length > 0
                        ? entry.critique.issuesFound.map((iss, i) => (
                            <p key={i} className="text-xs text-red-300 mb-1.5">• {iss}</p>
                          ))
                        : <p className="text-xs text-gray-600">No issues detected.</p>
                      }
                    </div>
                    <div className="bg-dark-900 rounded-xl p-4 border border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Strengths</p>
                      {entry.critique.strengths?.length > 0
                        ? entry.critique.strengths.map((s, i) => (
                            <p key={i} className="text-xs text-emerald-300 mb-1.5">• {s}</p>
                          ))
                        : <p className="text-xs text-gray-600">None recorded.</p>
                      }
                    </div>
                  </div>
                  {entry.critique.improvementSuggestions?.length > 0 && (
                    <div className="bg-dark-900 rounded-xl p-4 border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Improvement Suggestions</p>
                      {entry.critique.improvementSuggestions.map((s, i) => (
                        <p key={i} className="text-xs text-amber-300 mb-1.5">• {s}</p>
                      ))}
                    </div>
                  )}
                  {entry.critique.refinementFocus && entry.critique.refinementFocus !== 'None' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-400 mb-1">Refinement Focus</p>
                      <p className="text-xs text-amber-200">{entry.critique.refinementFocus}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No critique data available for this execution.</p>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              {entry.agentLogs ? (
                <>
                  <AgentLogSection title="🧠 Planner Agent" logs={entry.agentLogs.planner} color="text-amber-400" />
                  <AgentLogSection title="⚙️ Executor Agent" logs={entry.agentLogs.executor} color="text-emerald-400" />
                  <AgentLogSection title="🔍 Critic Agent"   logs={entry.agentLogs.critic}   color="text-red-400"    />
                  <AgentLogSection title="💾 Memory Agent"   logs={entry.agentLogs.memory}   color="text-purple-400" />
                  {entry.memoryUpdate && entry.memoryUpdate !== 'No memory update.' && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-purple-400">Memory Captured</h4>
                      <pre className="text-xs font-mono text-purple-300 bg-dark-900 rounded-lg p-3 border border-dark-700 whitespace-pre-wrap">
                        {entry.memoryUpdate}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No agent logs were captured for this execution.
                  <br />
                  <span className="text-xs text-gray-600">Agent logging was added in a newer version.</span>
                </p>
              )}
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-3">
              {[
                ['Execution ID',  entry.id,                                      'font-mono text-xs'],
                ['Goal',          entry.goal,                                    ''],
                ['Status',        entry.status?.toUpperCase(),                   ''],
                ['Quality Score', `${entry.qualityScore}/100`,                   ''],
                ['Iterations',    String(entry.iterationsRan),                   ''],
                ['Timestamp',     format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm:ss'), ''],
                ['Duration',      entry.duration ? `${(entry.duration / 1000).toFixed(2)}s` : 'N/A', ''],
              ].map(([label, value, extra]) => (
                <div key={label} className="flex gap-4 p-3 bg-dark-900 rounded-lg border border-dark-700">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-28 flex-shrink-0 mt-0.5">{label}</span>
                  <span className={`text-sm text-gray-200 break-all ${extra}`}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Table row ─────────────────────────────────────────────────────────────────
const TableRow = ({ entry, onView, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this log entry? This cannot be undone.')) return;
    setDeleting(true);
    try {
      logsArchiveService.deleteById(entry.id);
      onDelete(entry.id);
      toast.success('Log deleted');
    } catch {
      toast.error('Failed to delete log');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr
      className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors group cursor-pointer"
      onClick={() => onView(entry)}
    >
      {/* ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-gray-500">{entry.id.substring(0, 13)}…</span>
      </td>

      {/* Goal */}
      <td className="px-4 py-3 max-w-xs">
        <p className="text-sm text-gray-200 truncate" title={entry.goal}>{entry.goal}</p>
      </td>

      {/* Date */}
      <td className="px-4 py-3">
        <div>
          <p className="text-xs text-gray-300">{format(new Date(entry.timestamp), 'MMM d, yyyy')}</p>
          <p className="text-xs text-gray-500">{format(new Date(entry.timestamp), 'HH:mm:ss')}</p>
        </div>
      </td>

      {/* Score */}
      <td className="px-4 py-3">
        <ScoreBadge score={entry.qualityScore} />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={entry.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(entry)}
            title="View full logs"
            className="p-1.5 hover:bg-dark-600 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
          >
            <Eye className="w-4 h-4" />
          </button>
          <DownloadButton
            entry={entry}
            size="sm"
            formats={['txt', 'pdf', 'docx', 'json']}
            className="inline-flex"
          />
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete log"
            className="p-1.5 hover:bg-dark-600 rounded-lg transition-colors text-gray-400 hover:text-red-400 disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ── Stats bar ─────────────────────────────────────────────────────────────────
const StatsBar = ({ stats }) => (
  <div className="grid grid-cols-4 gap-4 mb-6">
    {[
      { label: 'Total Logs',      value: stats.total,      color: 'text-blue-400',    icon: Archive    },
      { label: 'Successful',      value: stats.successful, color: 'text-emerald-400', icon: CheckCircle},
      { label: 'Failed',          value: stats.failed,     color: 'text-red-400',     icon: XCircle    },
      { label: 'Avg Score',       value: `${stats.avgScore}/100`, color: 'text-amber-400', icon: BarChart3 },
    ].map(({ label, value, color, icon: Icon }) => (
      <div key={label} className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
        <div>
          <p className={`text-lg font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const LogsArchive = () => {
  const [entries, setEntries]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [stats, setStats]           = useState({ total: 0, successful: 0, failed: 0, avgScore: 0 });
  const [search, setSearch]         = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading]       = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const { data } = logsArchiveService.getAll();
      setEntries(data);
      setStats(logsArchiveService.getStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Apply filters client-side
  useEffect(() => {
    const { data } = logsArchiveService.getAll({ search, dateRange: dateFilter, status: statusFilter });
    setFiltered(data);
  }, [search, dateFilter, statusFilter, entries]);

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setStats(logsArchiveService.getStats());
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear ALL log entries? This cannot be undone.')) return;
    logsArchiveService.clear();
    setEntries([]);
    setFiltered([]);
    setStats({ total: 0, successful: 0, failed: 0, avgScore: 0 });
    toast.success('All logs cleared');
  };

  const hasActiveFilters = search || dateFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-primary-600 rounded-xl flex items-center justify-center">
            <Archive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Logs Archive</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {stats.total > 0 ? `${stats.total} execution${stats.total > 1 ? 's' : ''} archived` : 'No logs yet — run a workflow to start archiving'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg hover:border-primary-500 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {stats.total > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by goal, execution ID, or status…"
            className="w-full pl-10 pr-10 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-500 hover:text-gray-300" />
            </button>
          )}
        </div>

        {/* Date filter */}
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                dateFilter === f.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Filter className="w-3 h-3" />
          Showing {filtered.length} of {entries.length} logs
          <button
            onClick={() => { setSearch(''); setDateFilter('all'); setStatusFilter('all'); }}
            className="text-primary-400 hover:text-primary-300 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-dark-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Archive className="w-14 h-14 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">
              {entries.length === 0 ? 'No executions archived yet' : 'No results match your filters'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {entries.length === 0
                ? 'Go to the Workspace and run a workflow — results are saved automatically.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700 bg-dark-900/50">
                  {['ID', 'Goal', 'Date', 'Score', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <TableRow
                    key={entry.id}
                    entry={entry}
                    onView={setSelectedEntry}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Logs Modal */}
      {selectedEntry && (
        <LogsModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  );
};

export default LogsArchive;

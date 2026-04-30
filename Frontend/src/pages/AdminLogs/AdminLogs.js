import React, { useEffect, useState, useMemo } from 'react';
import {
  Shield, Clock, Globe, Activity, Trash2, RefreshCw,
  Search, ChevronUp, ChevronDown, Filter, X,
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_MEANINGS = {
  '200': 'OK – Request successful',
  '201': 'Created – Resource created successfully',
  '400': 'Bad Request – Client sent invalid data',
  '401': 'Unauthorized – Authentication required',
  '403': 'Forbidden – Access denied',
  '404': 'Not Found – Route doesn\'t exist',
  '429': 'Too Many Requests – Rate limited',
  '500': 'Server Error – Backend crashed or failed',
  '101': 'Switching Protocols (Streaming)',
};

const METHODS = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];
const STATUS_GROUPS = ['ALL', '2xx Success', '4xx Client Error', '5xx Server Error'];

function statusBadgeClass(status) {
  if (String(status).startsWith('2')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (String(status).startsWith('4')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  return 'bg-red-500/10 text-red-400 border border-red-500/20';
}

function matchesStatusGroup(status, group) {
  if (group === 'ALL') return true;
  if (group === '2xx Success') return String(status).startsWith('2');
  if (group === '4xx Client Error') return String(status).startsWith('4');
  if (group === '5xx Server Error') return String(status).startsWith('5');
  return true;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sort
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('agentic-ai-token');
      const res = await fetch(`${API_BASE}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!window.confirm('Clear all audit logs? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('agentic-ai-token');
      const res = await fetch(`${API_BASE}/admin/logs`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchLogs();
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-amber-400" />
      : <ChevronDown className="w-3 h-3 text-amber-400" />;
  };

  const filtered = useMemo(() => {
    let result = [...logs];

    // Search across IP, route, method
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.ip?.toLowerCase().includes(q) ||
        l.route?.toLowerCase().includes(q) ||
        l.method?.toLowerCase().includes(q) ||
        String(l.status).includes(q)
      );
    }

    // Method filter
    if (methodFilter !== 'ALL') {
      result = result.filter(l => l.method === methodFilter);
    }

    // Status group filter
    if (statusFilter !== 'ALL') {
      result = result.filter(l => matchesStatusGroup(l.status, statusFilter));
    }

    // Sort
    result.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'createdAt') { va = new Date(va); vb = new Date(vb); }
      if (sortField === 'responseTime') { va = Number(va); vb = Number(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [logs, search, methodFilter, statusFilter, sortField, sortDir]);

  const hasFilters = search || methodFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">System Audit Logs</h1>
            <p className="text-xs text-slate-500">Global activity trail · {filtered.length} of {logs.length} entries</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 rounded-lg transition-all text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg transition-all text-xs font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Trail
          </button>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div
        className="rounded-2xl mb-4 p-4 flex flex-col sm:flex-row gap-3"
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by IP, route, method, or status..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder-slate-600 focus:border-amber-400/40 focus:outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Method filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <div className="flex gap-1">
            {METHODS.map(m => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  methodFilter === m
                    ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-300 text-xs focus:border-amber-400/40 focus:outline-none transition-all cursor-pointer"
          style={{ background: '#1c2a3a' }}
        >
          {STATUS_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setMethodFilter('ALL'); setStatusFilter('ALL'); }}
            className="flex items-center gap-1 px-3 py-2 text-xs text-slate-500 hover:text-red-400 border border-white/[0.06] rounded-xl transition-all whitespace-nowrap"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <th className="px-5 py-3.5">
                  <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors">
                    <Clock className="w-3.5 h-3.5" /> Timestamp <SortIcon field="createdAt" />
                  </button>
                </th>
                <th className="px-5 py-3.5">
                  <button onClick={() => toggleSort('ip')} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Origin IP <SortIcon field="ip" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Method & Route
                </th>
                <th className="px-5 py-3.5">
                  <button onClick={() => toggleSort('status')} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors">
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-right">
                  <button onClick={() => toggleSort('responseTime')} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors ml-auto">
                    <Activity className="w-3.5 h-3.5" /> Latency <SortIcon field="responseTime" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((log, i) => (
                <tr
                  key={log._id || i}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono text-amber-400 bg-amber-400/5 px-2 py-1 rounded-lg border border-amber-400/10">
                      {log.ip || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        log.method === 'GET' ? 'bg-blue-500/10 text-blue-400' :
                        log.method === 'POST' ? 'bg-green-500/10 text-green-400' :
                        log.method === 'DELETE' ? 'bg-red-500/10 text-red-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-xs text-slate-300 font-mono truncate max-w-xs">{log.route}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => alert(`${log.status} — ${STATUS_MEANINGS[log.status] || `HTTP ${log.status}`}`)}
                      title={STATUS_MEANINGS[log.status]}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 hover:opacity-80 ${statusBadgeClass(log.status)}`}
                    >
                      {log.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <span className={`text-xs font-mono ${
                      Number(log.responseTime) > 1000 ? 'text-red-400' :
                      Number(log.responseTime) > 500 ? 'text-amber-400' :
                      'text-slate-500'
                    }`}>
                      {log.responseTime}ms
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-600 text-sm">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Loading audit trail...</span>
                      </div>
                    ) : hasFilters ? 'No logs match your filters.' : 'No logs found in the database.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
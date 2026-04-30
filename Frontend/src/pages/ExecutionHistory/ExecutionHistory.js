import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    label: 'Success',
  },
  refined: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    label: 'Refined',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    label: 'Failed',
  },
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;

  return `${Math.floor(diff / 3600)}h ago`;
};

/* ───────────────────────────────────────────── */
/* Execution Card */
/* ───────────────────────────────────────────── */

const ExecutionCard = ({ exec }) => {
  const [expanded, setExpanded] = useState(false);

  const cfg = statusConfig[exec.status] || statusConfig.success;
  const Icon = cfg.icon;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">

      {/* HEADER */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-dark-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}
        >
          <Icon className={`w-6 h-6 ${cfg.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{exec.goal}</p>

          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
            <span className="font-mono text-xs">{exec.id}</span>

            <span
              className={`font-medium text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
            >
              {cfg.label}
            </span>

            <span>
              Score:{' '}
              <span className="text-white font-semibold">
                {exec.qualityScore}/100
              </span>
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {exec.iterationsRan} iteration
              {exec.iterationsRan > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-gray-500 text-sm">
            {timeAgo(exec.timestamp)}
          </span>

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* BODY */}
      {expanded && (
        <div className="border-t border-dark-700 divide-y divide-dark-700/50">

          {/* PLAN */}
          <div className="p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {exec.iterationsRan > 1 ? 'Refined Plan' : 'Plan'}
            </h4>

            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-dark-900 rounded-lg p-3 max-h-40 overflow-y-auto">
              {exec.refinedPlan || exec.plan}
            </pre>
          </div>

          {/* FINAL OUTPUT */}
          <div className="p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Final Output
            </h4>

            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-dark-900 rounded-lg p-3 max-h-48 overflow-y-auto">
              {exec.refinedResult || exec.executionResult}
            </pre>
          </div>

          {/* DOWNLOAD BUTTONS */}
          <div className="p-5 flex flex-wrap gap-3">

            <a
              href={`${API_BASE}/agent/export/pdf/${exec.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-all"
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </a>

            <a
              href={`${API_BASE}/agent/export/docx/${exec.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-all"
            >
              <FileText className="w-4 h-4" />
              Download DOCX
            </a>

          </div>

        </div>
      )}
    </div>
  );
};

/* ───────────────────────────────────────────── */
/* MAIN PAGE */
/* ───────────────────────────────────────────── */

const ExecutionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('agentic-ai-user') || '{}');
      const userId = user?.id;

      if (!userId) {
        throw new Error('User not logged in');
      }

      const res = await fetch(`${API_BASE}/agent/history/${userId}`); // ✅ FIX
      const json = await res.json();

      if (json.success) {
        setHistory(json.data);
      } else {
        throw new Error('Failed to load history');
      }
    } catch (err) {
      setError(
        'Cannot reach backend. Make sure server is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">Execution History</h1>

          <p className="text-gray-400 mt-1">
            {history.length > 0
              ? `${history.length} execution${
                  history.length > 1 ? 's' : ''
                } recorded`
              : 'Past workflow runs'}
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg hover:border-primary-500 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No executions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((exec) => (
            <ExecutionCard key={exec.id} exec={exec} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutionHistory;
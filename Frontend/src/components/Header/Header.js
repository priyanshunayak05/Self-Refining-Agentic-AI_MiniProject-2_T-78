import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Play, Save, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Header = ({ onMenuClick }) => {
  const location        = useLocation();
  const navigate        = useNavigate();
  const executeWorkflow = useWorkflowStore((s) => s.executeWorkflow);
  const isExecuting     = useWorkflowStore((s) => s.isExecuting);
  const saveWorkflow    = useWorkflowStore((s) => s.saveWorkflow);

  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleExecute = async () => {
    try {
      await executeWorkflow();
      toast.success('Workflow executed successfully!');
    } catch (error) {
      toast.error('Execution failed: ' + error.message);
    }
  };

  const handleSave = () => {
    saveWorkflow();
    toast.success('Workflow saved!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const pageTitle = {
    '/workspace':    'Workflow Builder',
    '/dashboard':    'Dashboard',
    '/memory':       'Memory Store',
    '/history':      'Execution History',
    '/settings':     'Settings',
    '/how-it-works': 'How It Works',
    '/admin-logs':   'Admin Logs',
    '/logs':         'Logs Archive',
  }[location.pathname] || 'Agentic AI';

  const pageSubtitle = {
    '/workspace':    'Design and execute your agent pipeline',
    '/dashboard':    'Live overview of your Agentic AI system',
    '/memory':       'Persisted context across agent sessions',
    '/history':      'All past pipeline executions',
    '/settings':     'Configure API keys and preferences',
    '/how-it-works': 'System architecture and agent internals',
    '/admin-logs':   'Audit trail and IP telemetry',
  }[location.pathname] || '';

  const showWorkflowActions = location.pathname === '/workspace';

  return (
    <header
      className="h-16 flex items-center justify-between px-5 flex-shrink-0 relative z-10"
      style={{
        background: '#0d1117',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">{pageTitle}</h2>
          {pageSubtitle && (
            <p className="text-xs text-slate-500 leading-tight">{pageSubtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2.5">
        {showWorkflowActions && (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-medium"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold transition-all text-xs shadow-[0_0_16px_rgba(251,191,36,0.25)]"
            >
              <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-pulse' : ''}`} />
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          </>
        )}

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] transition-all"
            >
              <div className="w-6 h-6 bg-amber-400/20 border border-amber-400/30 rounded-full flex items-center justify-center text-amber-400 text-[10px] font-bold uppercase">
                {user.username?.[0] || 'U'}
              </div>
              <span className="text-xs text-slate-300 hidden sm:block font-medium">{user.username}</span>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-semibold text-white">{user.username}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

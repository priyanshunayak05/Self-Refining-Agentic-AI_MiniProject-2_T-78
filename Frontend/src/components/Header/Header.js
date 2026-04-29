import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Play, Save, LogOut, User, ChevronDown } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Header = ({ onMenuClick }) => {
  const location       = useLocation();
  const navigate       = useNavigate();
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
    '/workspace':  'Workflow Builder',
    '/dashboard':  'Dashboard',
    '/memory':     'Memory Store',
    '/history':    'Execution History',
    '/settings':   'Settings',
    '/how-it-works': 'How It Works',
    '/admin-logs': 'Admin Logs',
    '/logs':       'Logs Archive',
  }[location.pathname] || 'Agentic AI';

  const showWorkflowActions = location.pathname === '/workspace';

  return (
    <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-4 relative z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-3">
        {showWorkflowActions && (
          <>
            <button onClick={handleSave} className="btn-secondary flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isExecuting ? 'animate-pulse' : ''}`} />
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          </>
        )}

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">{user.username}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-dark-700">
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors"
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

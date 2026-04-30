import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,LayoutDashboard, Database,
  History, Settings, Shield, BookOpen, Sparkles, LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const user = JSON.parse(localStorage.getItem('agentic-ai-user') || '{}');
  const isAdmin = user?.role === 'admin';
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/',            icon: Home,           label: 'Home' },
    { path: '/workspace',   icon: LayoutDashboard, label: 'Workspace' },
    { path: '/dashboard',   icon: Database,        label: 'Dashboard' },
    { path: '/memory',      icon: History,         label: 'Memory Store' },
    { path: '/history',     icon: Settings,        label: 'Execution History' },
    { path: '/how-it-works',icon: BookOpen,        label: 'How It Works' },
    ...(isAdmin ? [{ path: '/admin-logs', icon: Shield, label: 'Admin Logs' }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${isOpen ? 'w-60' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden`}
      style={{ background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.05]">
        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-sm text-white tracking-tight truncate">Agentic AI</h1>
          <p className="text-[10px] text-slate-500 truncate">T-78 Project</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium group ${
                isActive
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section at bottom */}
      <div className="px-3 pb-4 border-t border-white/[0.05] pt-3">
        {user?.username && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-1">
            <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold uppercase flex-shrink-0">
              {user.username?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.username}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm mt-1"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

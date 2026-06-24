import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileEdit, 
  Search, 
  ListTodo, 
  Map, 
  BarChart, 
  Trophy, 
  X,
  Compass
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const citizenLinks = [
    { name: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', path: '/citizen/file-complaint', icon: FileEdit },
    { name: 'Track Issues', path: '/citizen/track-complaints', icon: Search },
    { name: 'Civic Leaderboard', path: '/citizen/leaderboard', icon: Trophy },
  ];

  const workerLinks = [
    { name: 'My Task List', path: '/worker/tasks', icon: ListTodo },
  ];

  const adminLinks = [
    { name: 'Admin Control Center', path: '/admin/dashboard', icon: BarChart },
    { name: 'Geospatial Heatmap', path: '/admin/heatmap', icon: Map },
  ];

  const getLinks = () => {
    switch (user.role) {
      case 'admin':
        return adminLinks;
      case 'worker':
        return workerLinks;
      default:
        return citizenLinks;
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile sidebar backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white pt-16 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-4 py-6">
          <div className="space-y-6">
            
            {/* Header for mobile sidebar close button */}
            <div className="flex items-center justify-between px-2 lg:hidden">
              <span className="font-bold text-slate-800 dark:text-white">Menu Navigation</span>
              <button 
                type="button" 
                onClick={onClose} 
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-850"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1.5">
              {links.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={idx}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400'
                          : 'text-slate-600 hover:bg-slate-55 bg-transparent hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Info card in sidebar */}
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-450">
              <Compass className="h-4 w-4" />
              <span>Civic Status: Active</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-normal text-slate-500 dark:text-slate-400">
              You are running in <strong>Demo Mode</strong>. Data is stored locally in your browser.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;

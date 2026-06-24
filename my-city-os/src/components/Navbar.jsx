import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Menu, X, LogOut, Shield, Briefcase, User, Award } from 'lucide-react';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Issue #comp-104 has been Resolved!', read: false },
    { id: 2, text: 'Officer Dave assigned to your Pothole report.', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
            <Shield className="h-3 w-3" /> Admin
          </span>
        );
      case 'worker':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
            <Briefcase className="h-3 w-3" /> Worker
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
            <User className="h-3 w-3" /> Citizen
          </span>
        );
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Toggle menu for mobile */}
          <div className="flex items-center gap-4">
            {user && (
              <button
                type="button"
                onClick={onMenuToggle}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-brand-400">
                My City OS
              </span>
              <span className="hidden rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-slate-800 dark:text-brand-400 sm:inline-block">
                Beta
              </span>
            </Link>
          </div>

          {/* Right menu tools */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user && (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowDropdown(false);
                    }}
                    className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-850">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Alerts</span>
                        <button 
                          onClick={() => setNotifications([])} 
                          className="text-xs text-brand-500 hover:underline"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="mt-1 space-y-1">
                        {notifications.length === 0 ? (
                          <p className="px-3 py-4 text-center text-xs text-slate-400">No new notifications</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className="rounded-lg p-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300">
                              {n.text}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Info & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-xl object-cover ring-2 ring-brand-500/20"
                    />
                    <div className="hidden text-left sm:block">
                      <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">{user.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        {user.role === 'citizen' ? `${user.points || 0} pts` : user.role}
                      </p>
                    </div>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          {user.role === 'citizen' && (
                            <span className="inline-flex items-center gap-1 rounded bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400">
                              <Award className="h-3 w-3" /> Level {Math.floor((user.points || 0) / 200) + 1}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-1 space-y-0.5">
                        <Link
                          to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'worker' ? '/worker/tasks' : '/citizen/dashboard'}
                          onClick={() => setShowDropdown(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900 transition-colors"
                        >
                          Go to Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900 transition-colors"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 hover:shadow-md dark:bg-brand-500 dark:hover:bg-brand-600 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

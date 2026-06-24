import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Briefcase, Mail, Lock, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname;

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = login(email, password);
      // Wait for login micro-animation
      await new Promise(r => setTimeout(r, 600));
      
      // Navigate to correct dashboard based on role or intended route
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        if (loggedUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (loggedUser.role === 'worker') {
          navigate('/worker/tasks');
        } else {
          navigate('/citizen/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    let mockEmail = '';
    let mockPassword = '';

    if (role === 'citizen') {
      mockEmail = 'citizen@city.os';
      mockPassword = 'citizen123';
    } else if (role === 'worker') {
      mockEmail = 'worker@city.os';
      mockPassword = 'worker123';
    } else if (role === 'admin') {
      mockEmail = 'admin@city.os';
      mockPassword = 'admin123';
    }

    setEmail(mockEmail);
    setPassword(mockPassword);
    
    // Auto-login trigger
    setLoading(true);
    setTimeout(() => {
      try {
        const loggedUser = login(mockEmail, mockPassword);
        if (loggedUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (loggedUser.role === 'worker') {
          navigate('/worker/tasks');
        } else {
          navigate('/citizen/dashboard');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 shadow-lg">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-brand-400">
            My City OS
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Access Your Portal
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Enter credentials below or select a quick-login profile to start exploring.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Login Selectors */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Demo Access (Click to Login)</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen')}
              className="flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/50 p-3 hover:bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/15 dark:hover:bg-blue-950/30 transition-all group"
            >
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="mt-1 text-[10px] font-bold text-blue-700 dark:text-blue-400">Citizen Panel</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('worker')}
              className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/50 p-3 hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/15 dark:hover:bg-amber-950/30 transition-all group"
            >
              <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="mt-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">Worker Panel</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-3 hover:bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/15 dark:hover:bg-rose-950/30 transition-all group"
            >
              <ShieldCheck className="h-5 w-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="mt-1 text-[10px] font-bold text-rose-700 dark:text-rose-400">Admin Panel</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-950">Or sign in manually</span>
        </div>

        {/* Manual Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="citizen@city.os"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700 focus:outline-none disabled:opacity-50 transition-colors"
          >
            {loading ? 'Entering Portal...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs">
          <span className="text-slate-500">New citizen user? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Login;

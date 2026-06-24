import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, ShieldAlert } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      register(name, email, password);
      // Wait for registration animation
      await new Promise(r => setTimeout(r, 600));
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
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
            Register Citizen Account
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Join thousands of active citizens making our city a better place.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="jane@example.com"
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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700 focus:outline-none disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs">
          <span className="text-slate-500">Already registered? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Sign In Instead
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Register;

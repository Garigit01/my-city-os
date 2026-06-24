import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Briefcase, Award, Save, Camera, Check } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', // Female 1
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // Male 1
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', // Female 2
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', // Male 2
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', // Female 3
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'  // Male 3
];

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [customAvatar, setCustomAvatar] = useState('');
  const [department, setDepartment] = useState(user?.department || '');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);

    const updateData = { name, avatar };
    if (user.role !== 'citizen') {
      updateData.department = department;
    }

    try {
      updateProfile(updateData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300';
      case 'worker':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300';
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Profile Settings
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Customize your civic profile card, choose community avatars, and manage departmental tags.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Public Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm text-center flex flex-col items-center">
            
            <div className="relative group">
              <img
                src={avatar}
                alt={user.name}
                className="h-28 w-28 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
              <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-white shadow dark:bg-slate-850">
                <Camera className="h-4 w-4" />
              </span>
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white leading-none">
              {user.name}
            </h3>
            <p className="mt-1 text-xs text-slate-450 truncate max-w-full">
              {user.email}
            </p>

            <span className={`mt-3 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-bold capitalize ${getRoleBadge(user.role)}`}>
              {user.role}
            </span>

            {/* Citizen Stats */}
            {user.role === 'citizen' && (
              <div className="mt-6 w-full border-t border-slate-100 pt-5 dark:border-slate-900 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450 font-semibold">Civic Level</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Level {Math.floor((user.points || 0) / 200) + 1}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450 font-semibold">Reputation Points</span>
                  <span className="font-extrabold text-brand-500">{user.points || 0} pts</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450 font-semibold">Total Reports</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{user.reportsCount || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450 font-semibold">Resolved Reports</span>
                  <span className="font-extrabold text-emerald-500">{user.resolvedCount || 0}</span>
                </div>
              </div>
            )}

            {/* Worker Stats */}
            {user.role === 'worker' && (
              <div className="mt-6 w-full border-t border-slate-100 pt-5 dark:border-slate-900 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-450 font-semibold">Tasks Completed</span>
                  <span className="font-extrabold text-brand-500">{user.tasksCompleted || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
            
            {success && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250/20">
                <Check className="h-4 w-4" />
                <span>Profile updated successfully! Changes synced immediately.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Display Name</label>
                <div className="relative">
                  <User className="absolute top-3.5 left-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Department (Workers / Admins only) */}
              {user.role !== 'citizen' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Department Tag</label>
                  <div className="relative">
                    <Briefcase className="absolute top-3.5 left-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roads Repair Division"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Avatar Preset Selectors */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 block">Select Avatar Preset</label>
                <div className="grid grid-cols-6 gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        avatar === preset 
                          ? 'border-brand-500 scale-105 shadow' 
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                      {avatar === preset && (
                        <span className="absolute inset-0 bg-brand-500/20 flex items-center justify-center text-white">
                          <Check className="h-5 w-5 bg-brand-600 rounded-full p-0.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Or Custom Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatar}
                  onChange={(e) => {
                    setCustomAvatar(e.target.value);
                    if (e.target.value) setAvatar(e.target.value);
                  }}
                  className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-700 hover:shadow shadow-sm transition-all focus:outline-none"
              >
                <Save className="h-4.5 w-4.5" /> Save Changes
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
export default Profile;

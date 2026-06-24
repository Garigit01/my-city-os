import React from 'react';

export const StatCard = ({ title, value, changeText, changeType = 'positive', icon: Icon, color = 'blue' }) => {
  const colorMaps = {
    blue: 'from-blue-500/10 to-sky-500/10 border-blue-200/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
    green: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    purple: 'from-purple-500/10 to-indigo-500/10 border-purple-200/50 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20',
    amber: 'from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    rose: 'from-rose-500/10 to-red-500/10 border-rose-200/50 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20'
  };

  const selectedColor = colorMaps[color] || colorMaps.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${selectedColor} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:shadow-slate-950/30`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur-md dark:bg-slate-800/80">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {changeText && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 ${
            changeType === 'positive' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300'
          }`}>
            {changeType === 'positive' ? '↑' : '↓'} {changeText}
          </span>
          <span className="text-slate-500 dark:text-slate-400">since last month</span>
        </div>
      )}
    </div>
  );
};
export default StatCard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Award, Medal, ArrowUp, Star } from 'lucide-react';

export const Leaderboard = () => {
  const { user } = useAuth();
  const [boardUsers, setBoardUsers] = useState([]);

  useEffect(() => {
    // Fetch registered users and sort by points descending
    const allUsers = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    const sorted = allUsers
      .filter(u => u.role === 'citizen')
      .sort((a, b) => (b.points || 0) - (a.points || 0));
    setBoardUsers(sorted);
  }, [user]);

  // Top 3 Podium spots
  const podiumSpots = boardUsers.slice(0, 3);
  const remainingSpots = boardUsers.slice(3);

  const getPodiumColor = (idx) => {
    switch (idx) {
      case 0:
        return 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/10 dark:border-yellow-500/50';
      case 1:
        return 'border-slate-350 bg-slate-50/50 dark:bg-slate-800/10 dark:border-slate-700/50';
      default:
        return 'border-amber-500/60 bg-amber-50/20 dark:bg-amber-950/5 dark:border-amber-800/20';
    }
  };

  const getMedalIcon = (idx) => {
    switch (idx) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-slate-400" />;
      default:
        return <Medal className="h-6 w-6 text-amber-600" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-900 dark:text-brand-400">
          <Trophy className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Civic Leaderboard
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 dark:text-slate-400">
          Compete with fellow citizens to earn points by reporting and verifying city issues. Unlocking ranks helps speed up resolutions!
        </p>
      </div>

      {/* Top 3 Podium Showcases */}
      {podiumSpots.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {podiumSpots.map((pu, idx) => (
            <div
              key={pu.email}
              className={`rounded-3xl border-2 p-6 flex flex-col items-center text-center relative shadow-sm ${getPodiumColor(idx)}`}
            >
              {/* Medal Indicator */}
              <div className="absolute top-4 left-4">
                {getMedalIcon(idx)}
              </div>
              
              <div className="relative">
                <img
                  src={pu.avatar}
                  alt={pu.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow dark:ring-slate-900"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {idx + 1}
                </span>
              </div>

              <h4 className="mt-4 font-extrabold text-slate-900 dark:text-white">{pu.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Level {Math.floor((pu.points || 0) / 200) + 1}</p>
              
              <p className="mt-4 text-2xl font-extrabold text-brand-500">{pu.points || 0} pts</p>
              
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {pu.badges?.slice(0, 2).map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="inline-flex items-center gap-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-550 dark:text-slate-350"
                  >
                    <Award className="h-2.5 w-2.5" /> {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rankings Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm overflow-hidden">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Complete Standings</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4 text-center">Reports Filed</th>
                <th className="py-3 px-4 text-center">Resolved</th>
                <th className="py-3 px-4 text-right">Civic Score</th>
              </tr>
            </thead>
            <tbody>
              {boardUsers.map((pu, idx) => {
                const isCurrentUser = pu.email === user?.email;
                return (
                  <tr
                    key={pu.email}
                    className={`border-b border-slate-100/60 dark:border-slate-900/60 transition-colors ${
                      isCurrentUser 
                        ? 'bg-brand-50/30 font-bold dark:bg-brand-950/10' 
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
                    }`}
                  >
                    <td className="py-4 px-4 text-center font-extrabold text-slate-500 dark:text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pu.avatar}
                          alt={pu.name}
                          className="h-8 w-8 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{pu.name}</span>
                          {isCurrentUser && (
                            <span className="ml-1.5 inline-flex items-center rounded bg-brand-100 px-1 text-[8px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                              YOU
                            </span>
                          )}
                          <div className="flex gap-1 mt-0.5">
                            {pu.badges?.slice(0, 1).map((b, bIdx) => (
                              <span key={bIdx} className="text-[9px] text-slate-400 flex items-center gap-0.5">
                                <Star className="h-2.5 w-2.5 text-yellow-500" /> {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      Rank {Math.floor((pu.points || 0) / 200) + 1}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-450">
                      {pu.reportsCount || 0}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-650 dark:text-slate-450">
                      {pu.resolvedCount || 0}
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-brand-500">
                      {pu.points || 0} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Leaderboard;

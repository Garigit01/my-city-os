import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/firebase';
import { 
  Award, 
  PlusCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileText,
  ChevronRight
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [myComplaints, setMyComplaints] = useState([]);

  useEffect(() => {
    if (user) {
      const all = dbService.getComplaints();
      const filtered = all.filter(c => c.reporterEmail === user.email);
      setMyComplaints(filtered);
    }
  }, [user]);

  // Gamification Level calculations
  const points = user?.points || 0;
  const currentLevel = Math.floor(points / 200) + 1;
  const pointsNextLevel = currentLevel * 200;
  const pointsPrevLevel = (currentLevel - 1) * 200;
  const levelProgress = ((points - pointsPrevLevel) / 200) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
      case 'Assigned':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350';
    }
  };

  const getBadgeIconColor = (badgeName) => {
    const badgesInfo = {
      'Novice Reporter': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      'Eagle Eye': 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
      'Road Warrior': 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
      'Clean Green': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
      'Civic Leader': 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
    };
    return badgesInfo[badgeName] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      
      {/* Welcome Hero */}
      <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-brand-600 to-sky-600 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Jai Hind, {user?.name}!</h2>
          <p className="mt-2 text-sm text-brand-100 max-w-md">
            Your reports are transforming the city. Track progress, check leaderboard achievements, and report new issues.
          </p>
        </div>
        <Link
          to="/citizen/file-complaint"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-brand-600 hover:bg-slate-50 hover:shadow-md transition-all self-start md:self-auto"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Report New Issue</span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Side: Stats & Gamification */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Level Progress */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Civic Reputation</span>
            </h3>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Current Rank</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">Level {currentLevel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Points</p>
                <p className="text-xl font-extrabold text-brand-500">{points} pts</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>{points} / {pointsNextLevel} pts</span>
                <span>Level {currentLevel + 1}</span>
              </div>
            </div>
          </div>

          {/* Badges Display */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white">Unlocked Badges</h3>
            <p className="text-xs text-slate-400 mt-1">Earned for active reports and verifications</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {user?.badges?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No badges unlocked yet. Submit a report to get started!</p>
              ) : (
                user?.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getBadgeIconColor(badge)}`}
                  >
                    <Award className="h-3 w-3" /> {badge}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: My Reports */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                <span>My Active Complaints ({myComplaints.length})</span>
              </h3>
              <Link 
                to="/citizen/track-complaints" 
                className="text-xs font-bold text-brand-600 hover:underline dark:text-brand-400 flex items-center gap-0.5"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {myComplaints.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">You haven't filed any complaints yet.</p>
                  <Link
                    to="/citizen/file-complaint"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Report your first issue now
                  </Link>
                </div>
              ) : (
                myComplaints.map(comp => (
                  <Link
                    key={comp.id}
                    to="/citizen/track-complaints"
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-brand-300 dark:border-slate-900 dark:bg-slate-900/30 transition-all md:flex-row md:items-center group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="hidden rounded-xl bg-white p-2.5 shadow-sm dark:bg-slate-800 sm:block">
                        <MapPin className="h-5 w-5 text-brand-500" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusColor(comp.status)}`}>
                            {comp.status}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(comp.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="mt-2 font-bold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 transition-colors">
                          {comp.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md truncate">
                          {comp.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 md:border-t-0 md:pt-0 gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">AI Priority</p>
                        <p className={`text-xs font-extrabold ${
                          comp.priority === 'Emergency' ? 'text-rose-600' : comp.priority === 'High' ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          {comp.priority}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
export default Dashboard;

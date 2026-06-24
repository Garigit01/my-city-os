import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/firebase';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertOctagon, 
  Users,
  Compass
} from 'lucide-react';

export const TaskList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('assigned'); // assigned, open
  const [sortBy, setSortBy] = useState('priority'); // priority, date

  useEffect(() => {
    // Refresh complaints
    setComplaints(dbService.getComplaints());
  }, []);

  const getPriorityWeight = (priority) => {
    switch (priority) {
      case 'Emergency': return 4;
      case 'High': return 3;
      case 'Medium': return 2;
      default: return 1;
    }
  };

  // Filter tasks based on tabs
  const tabComplaints = complaints.filter(comp => {
    if (activeTab === 'assigned') {
      return comp.workerEmail === user?.email && comp.status !== 'Resolved';
    } else {
      // Open complaints that are not assigned to anyone and not resolved
      return !comp.workerEmail && comp.status !== 'Resolved';
    }
  });

  // Sort complaints
  const sortedComplaints = [...tabComplaints].sort((a, b) => {
    if (sortBy === 'priority') {
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 border border-rose-300/30';
      case 'High':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-300/30';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      default:
        return 'bg-slate-105 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
      case 'Assigned':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-805 dark:text-slate-350';
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Overview stats */}
      <div className="rounded-3xl bg-slate-900 p-6 text-white dark:bg-slate-950 shadow-md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-brand-500" />
              <span>Officer Work Portal</span>
            </h2>
            <p className="mt-1.5 text-xs text-slate-400">
              Department: <strong>{user?.department || 'Municipal Operations'}</strong>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="border-l-2 border-brand-500 pl-3">
              <p className="text-[10px] text-slate-400 uppercase">My Active Tasks</p>
              <p className="text-xl font-extrabold text-white">
                {complaints.filter(c => c.workerEmail === user?.email && c.status !== 'Resolved').length}
              </p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <p className="text-[10px] text-slate-400 uppercase">Completed</p>
              <p className="text-xl font-extrabold text-white">{user?.tasksCompleted || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab select and sort controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Active Tabs */}
        <div className="inline-flex rounded-2xl bg-white p-1 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'assigned'
                ? 'bg-brand-600 text-white dark:bg-brand-500'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'open'
                ? 'bg-brand-600 text-white dark:bg-brand-500'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Open Pools</span>
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-350">
              {complaints.filter(c => !c.workerEmail && c.status !== 'Resolved').length}
            </span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1">
            <Compass className="h-4 w-4" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 font-semibold focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
          >
            <option value="priority">AI Priority (Urgent first)</option>
            <option value="date">Date Created (Newest first)</option>
          </select>
        </div>

      </div>

      {/* Task List container */}
      <div className="space-y-4">
        {sortedComplaints.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-400 dark:border-slate-850 dark:bg-slate-950">
            <AlertOctagon className="mx-auto h-10 w-10 text-slate-400 animate-pulse" />
            <p className="mt-4 text-sm font-semibold">
              {activeTab === 'assigned' 
                ? 'No active tasks currently assigned to you. Enjoy your day!' 
                : 'No open city issues in the pool queue.'}
            </p>
          </div>
        ) : (
          sortedComplaints.map(comp => (
            <div
              key={comp.id}
              onClick={() => navigate(`/worker/task/${comp.id}`)}
              className="group flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-500 dark:border-slate-850 dark:bg-slate-950 transition-all md:flex-row md:items-center cursor-pointer hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="hidden rounded-2xl bg-slate-50 p-3 dark:bg-slate-900 group-hover:bg-brand-50/50 dark:group-hover:bg-slate-900/60 transition-colors sm:block">
                  <MapPin className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-xl px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${getPriorityColor(comp.priority)}`}>
                      {comp.priority}
                    </span>
                    <span className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(comp.status)}`}>
                      {comp.status}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-950 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 transition-colors leading-snug">
                    {comp.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl truncate">
                    {comp.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 md:border-t-0 md:pt-0 gap-6">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reporter</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {comp.reporterName}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default TaskList;

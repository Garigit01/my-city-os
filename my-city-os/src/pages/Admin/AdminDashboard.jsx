import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/firebase';
import { 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Shuffle,
  ShieldAlert,
  ArrowRightCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Stats Counters
  const [totalCount, setTotalCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [wipCount, setWipCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    refreshData();
    // Load workers from seeded DB
    const allUsers = JSON.parse(localStorage.getItem('mycity_users') || '[]');
    const filteredWorkers = allUsers.filter(u => u.role === 'worker');
    setWorkers(filteredWorkers);
  }, []);

  const refreshData = () => {
    const list = dbService.getComplaints();
    setComplaints(list);
    
    setTotalCount(list.length);
    setResolvedCount(list.filter(c => c.status === 'Resolved').length);
    setWipCount(list.filter(c => c.status === 'In Progress').length);
    setSubmittedCount(list.filter(c => c.status === 'Submitted' || c.status === 'Assigned').length);
  };

  const handleAssignWorker = (issueId, workerEmail) => {
    if (!workerEmail) return;
    const worker = workers.find(w => w.email === workerEmail);
    if (!worker) return;

    try {
      dbService.updateComplaintStatus(
        issueId, 
        'Assigned', 
        worker.email, 
        worker.name, 
        null, 
        `Admin assigned ticket to ${worker.name}`
      );
      refreshData();
      alert(`Assigned successfully to ${worker.name}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePriorityOverride = (issueId, newPriority) => {
    try {
      const complaintsData = JSON.parse(localStorage.getItem('mycity_complaints') || '[]');
      const index = complaintsData.findIndex(c => c.id === issueId);
      if (index !== -1) {
        complaintsData[index].priority = newPriority;
        complaintsData[index].notes.push(`Admin manual override: priority set to ${newPriority}`);
        localStorage.setItem('mycity_complaints', JSON.stringify(complaintsData));
        refreshData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 font-extrabold';
      case 'High':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-450';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-450';
      case 'Assigned':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-450';
      default:
        return 'bg-slate-100 text-slate-750 dark:bg-slate-850 dark:text-slate-350';
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="h-7 w-7 text-brand-600" />
          <span>Operational Control Center</span>
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Executive analytics panel to override AI prioritization, delegate work orders, and review resolution rates.
        </p>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-900 dark:text-brand-400">
            <Shuffle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Logged Tickets</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{totalCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-slate-900 dark:text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Resolved Tasks</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {resolvedCount} <span className="text-xs font-semibold text-emerald-500">({totalCount > 0 ? Math.round((resolvedCount/totalCount)*100) : 0}%)</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-slate-900 dark:text-amber-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Open / Assigned Pools</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{submittedCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-slate-900 dark:text-purple-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Active Repair Crews</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{workers.length}</p>
          </div>
        </div>

      </div>

      {/* Main Grid Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm overflow-hidden space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h3 className="font-bold text-slate-900 dark:text-white">Active City Complaints Queue</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Problem Ticket</th>
                <th className="py-3 px-4">Incident Landmark</th>
                <th className="py-3 px-4">AI Rating</th>
                <th className="py-3 px-4">Severity Override</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Crew Member</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(comp => (
                <tr 
                  key={comp.id} 
                  className="border-b border-slate-100/50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                >
                  {/* Title & Reporter */}
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{comp.title}</span>
                      <span className="text-[10px] text-slate-450">Reporter: {comp.reporterName}</span>
                    </div>
                  </td>

                  {/* Landmark address */}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {comp.address}
                  </td>

                  {/* AI rating */}
                  <td className="py-4 px-4">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getPriorityStyle(comp.priority)}`}>
                      {comp.priority}
                    </span>
                  </td>

                  {/* Manual priority override */}
                  <td className="py-4 px-4">
                    {comp.status !== 'Resolved' ? (
                      <select
                        value={comp.priority}
                        onChange={(e) => handlePriorityOverride(comp.id, e.target.value)}
                        className="rounded-lg border border-slate-200 py-1.5 px-2.5 text-[10px] font-semibold dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                      >
                        <option value="Emergency">Emergency</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Locked (Resolved)</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusStyle(comp.status)}`}>
                      {comp.status}
                    </span>
                  </td>

                  {/* Assigned worker select */}
                  <td className="py-4 px-4">
                    {comp.status !== 'Resolved' ? (
                      <select
                        value={comp.workerEmail || ''}
                        onChange={(e) => handleAssignWorker(comp.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-1.5 px-2.5 text-[10px] font-semibold dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                      >
                        <option value="">-- Assign Crew --</option>
                        {workers.map(w => (
                          <option key={w.email} value={w.email}>{w.name} ({w.department})</option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-semibold text-slate-700 dark:text-slate-350">{comp.workerName || 'N/A'}</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default AdminDashboard;

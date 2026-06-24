import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/firebase';
import { 
  Search, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  ArrowUp,
  User,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const TrackComplaints = () => {
  const { user } = useAuth();
  const routeLocation = useLocation();

  // Feed States
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Initial Load & routing triggers
  useEffect(() => {
    const list = dbService.getComplaints();
    setComplaints(list);
    
    // Highlight issue passed from routing state (e.g. duplicate redirect)
    if (routeLocation.state?.highlightId) {
      setSelectedId(routeLocation.state.highlightId);
    } else if (list.length > 0) {
      setSelectedId(list[0].id);
    }
  }, [routeLocation]);

  // Load comments when selected complaint changes
  useEffect(() => {
    if (selectedId) {
      const comms = dbService.getComments(selectedId);
      setComments(comms);
    }
  }, [selectedId]);

  const refreshData = () => {
    setComplaints(dbService.getComplaints());
  };

  const handleUpvote = (id) => {
    try {
      dbService.upvoteComplaint(id, user.email);
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      dbService.addComment(selectedId, user.name, user.role, newComment);
      setNewComment('');
      setComments(dbService.getComments(selectedId));
    } catch (err) {
      alert(err.message);
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
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350';
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          comp.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || comp.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || comp.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const selectedComplaint = complaints.find(c => c.id === selectedId);

  // Timeline Step calculation
  const getTimelineSteps = (status) => {
    const steps = [
      { name: 'Submitted', desc: 'Ticket registered by citizen', done: true },
      { name: 'AI Verified', desc: 'AI auto-validation and duplicate checks complete', done: true },
      { name: 'Assigned', desc: 'Assigned to field engineer', done: ['Assigned', 'In Progress', 'Resolved'].includes(status) },
      { name: 'In Progress', desc: 'Repair crew dispatched to coordinates', done: ['In Progress', 'Resolved'].includes(status) },
      { name: 'Resolved', desc: 'Issue resolved with verification photo', done: status === 'Resolved' }
    ];
    return steps;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      
      {/* Search and filter header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by title, description, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3.5 pr-4 pl-11 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 py-2.5 px-4 text-xs font-semibold focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="All">All Categories</option>
              <option value="Roads & Potholes">Roads & Potholes</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity & Lighting">Electricity & Lighting</option>
              <option value="Sanitation & Waste">Sanitation & Waste</option>
              <option value="Traffic & Signals">Traffic & Signals</option>
              <option value="Others">Others</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 py-2.5 px-4 text-xs font-semibold focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Priority Select */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-xl border border-slate-200 py-2.5 px-4 text-xs font-semibold focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="All">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Ticket list */}
        <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-2">
          {filteredComplaints.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400 dark:border-slate-850 dark:bg-slate-950">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-4 text-sm font-semibold">No complaints match your search filters.</p>
            </div>
          ) : (
            filteredComplaints.map(comp => {
              const isUpvoted = comp.upvotedBy?.includes(user.email);
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedId(comp.id)}
                  className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                    selectedId === comp.id
                      ? 'border-brand-500 bg-brand-50/20 shadow-sm dark:bg-slate-950 dark:border-brand-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-850 dark:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{comp.category}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(comp.status)}`}>
                      {comp.status}
                    </span>
                  </div>
                  
                  <h4 className="mt-3 font-bold text-slate-900 dark:text-white leading-snug">{comp.title}</h4>
                  
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">{comp.address}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-extrabold ${
                        comp.priority === 'Emergency' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-900'
                      }`}>
                        {comp.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(comp.id);
                        }}
                        className={`flex items-center gap-1 hover:text-brand-500 transition-colors ${isUpvoted ? 'text-brand-500 font-extrabold' : ''}`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
                        <span>{comp.upvotes || 0}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{dbService.getComments(comp.id).length}</span>
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Issue details panel */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
              
              {/* Detail Header */}
              <div className="border-b border-slate-100 pb-5 dark:border-slate-850 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold tracking-wider uppercase text-slate-400">{selectedComplaint.category}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {selectedComplaint.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Reported on {new Date(selectedComplaint.createdAt).toLocaleString()} by {selectedComplaint.reporterName}
                  </p>
                </div>

                {/* Direct Upvote */}
                <button
                  type="button"
                  onClick={() => handleUpvote(selectedComplaint.id)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold border transition-all ${
                    selectedComplaint.upvotedBy?.includes(user.email)
                      ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-350'
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${selectedComplaint.upvotedBy?.includes(user.email) ? 'fill-current' : ''}`} />
                  <span>Upvote Urgency ({selectedComplaint.upvotes || 0})</span>
                </button>
              </div>

              {/* Status Timeline Progress */}
              <div className="py-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Resolution Steps Tracker</h4>
                <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {getTimelineSteps(selectedComplaint.status).map((step, idx) => (
                    <div key={idx} className="relative flex gap-4 text-xs">
                      {/* Circle Dot */}
                      <span className={`absolute -left-5.5 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950 ${
                        step.done 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-200 text-slate-400 dark:bg-slate-850 dark:text-slate-600'
                      }`}>
                        {step.done ? '✓' : idx + 1}
                      </span>
                      <div>
                        <p className={`font-bold ${step.done ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400'}`}>
                          {step.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Description</h4>
                <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed bg-slate-55 bg-opacity-40 p-4 rounded-2xl dark:bg-slate-900/35">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Before Incident</h4>
                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <img
                      src={selectedComplaint.imageBefore}
                      alt="Before incident"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Proof</h4>
                  {selectedComplaint.imageAfter ? (
                    <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                      <img
                        src={selectedComplaint.imageAfter}
                        alt="Resolution proof"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-slate-850 dark:bg-slate-900/10">
                      <Clock className="h-6 w-6 text-slate-400 animate-pulse" />
                      <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">Resolution photo will be uploaded once worker marks as fixed.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location details */}
              <div className="rounded-2xl border border-slate-150 p-4 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/20 space-y-1 text-xs">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Incident GPS coordinates</h4>
                <p className="font-bold text-slate-800 dark:text-white">{selectedComplaint.address}</p>
                <div className="pt-1 text-[10px] text-slate-400 flex gap-4">
                  <span>Lat: {selectedComplaint.latitude?.toFixed(6)}</span>
                  <span>Lon: {selectedComplaint.longitude?.toFixed(6)}</span>
                </div>
              </div>

              {/* Discussion Chat Board */}
              <div className="border-t border-slate-100 pt-6 dark:border-slate-850 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Discussion Forum</span>
                </h4>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No comments posted yet. Start the conversation!</p>
                  ) : (
                    comments.map(comm => (
                      <div key={comm.id} className="rounded-2xl bg-slate-55/70 p-3.5 text-xs dark:bg-slate-900/50">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {comm.userName}
                            <span className={`inline-block px-1.5 py-0.2 rounded font-extrabold text-[8px] uppercase ${
                              comm.userRole === 'worker' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/20'
                            }`}>
                              {comm.userRole}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700 dark:text-slate-350 leading-relaxed">{comm.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input Form */}
                <form onSubmit={handleSendComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ask worker for status details, add context..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 px-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center text-slate-400 dark:border-slate-850 dark:bg-slate-950">
              <p>Select a ticket from the sidebar to track its resolution timeline.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default TrackComplaints;

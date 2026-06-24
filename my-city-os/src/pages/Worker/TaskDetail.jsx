import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/firebase';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Image as ImageIcon, 
  CheckCircle2, 
  Send,
  MessageSquare,
  AlertTriangle,
  Play,
  Briefcase,
  User
} from 'lucide-react';

export const TaskDetail = () => {
  const { id } = useParams();
  const { user, incrementResolvedCount } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Resolve Form States
  const [resolutionNote, setResolutionNote] = useState('');
  const [imageAfter, setImageAfter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const data = dbService.getComplaintById(id);
    if (data) {
      setComplaint(data);
      setComments(dbService.getComments(id));
    }
  }, [id]);

  const refreshComplaint = () => {
    const data = dbService.getComplaintById(id);
    if (data) {
      setComplaint(data);
      setComments(dbService.getComments(id));
    }
  };

  const handleAcceptTask = () => {
    try {
      dbService.updateComplaintStatus(id, 'Assigned', user.email, user.name, null, `Officer ${user.name} accepted the work order.`);
      refreshComplaint();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartWork = () => {
    try {
      dbService.updateComplaintStatus(id, 'In Progress', null, null, null, `Crew dispatched. Work started on site.`);
      refreshComplaint();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSimulateAfterPhoto = () => {
    const resolvedMockImages = {
      'Water Supply': 'https://images.unsplash.com/photo-1624632738992-6f10e22d1149?auto=format&fit=crop&q=80&w=400', // Fixed pipe/drain
      'Roads & Potholes': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400', // Fixed smooth asphalt
      'Sanitation & Waste': 'https://images.unsplash.com/photo-1605600611283-c48c6f68d1b3?auto=format&fit=crop&q=80&w=400', // Clean street
      'Electricity & Lighting': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=400' // Working bulb
    };
    
    const selected = resolvedMockImages[complaint.category] || resolvedMockImages['Roads & Potholes'];
    setImageAfter(selected);
  };

  const handleResolveTask = async (e) => {
    e.preventDefault();
    if (!imageAfter) {
      alert('Please upload/simulate a resolution verification photo.');
      return;
    }
    setSubmitting(true);

    try {
      dbService.updateComplaintStatus(
        id, 
        'Resolved', 
        null, 
        null, 
        imageAfter, 
        `Resolved: ${resolutionNote || 'Work completed successfully.'}`
      );
      
      // Increment reporter resolved count & reward points
      incrementResolvedCount(complaint.reporterEmail);

      alert('Work order marked as Resolved! Citizen notified.');
      navigate('/worker/tasks');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      dbService.addComment(id, user.name, user.role, newComment);
      setNewComment('');
      setComments(dbService.getComments(id));
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
        return 'bg-slate-105 text-slate-800 dark:bg-slate-800 dark:text-slate-350';
    }
  };

  if (!complaint) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-slate-400">Loading work order details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Back button */}
      <Link
        to="/worker/tasks"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Work Orders
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left column: Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
            
            {/* Title & category */}
            <div className="border-b border-slate-100 pb-5 dark:border-slate-850">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{complaint.category}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {complaint.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Filed: {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-450">
                  <AlertTriangle className="h-4 w-4" /> AI Tag: {complaint.priority} Priority
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citizen Problem Report</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 p-4 rounded-2xl dark:bg-slate-900/30">
                {complaint.description}
              </p>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Report Photo (Before)</h4>
                <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={complaint.imageBefore}
                    alt="Before repair"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Completion Proof (After)</h4>
                {complaint.imageAfter ? (
                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img
                      src={complaint.imageAfter}
                      alt="Completed fix"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-slate-850 dark:bg-slate-900/10">
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                    <p className="mt-1.5 text-[10px] text-slate-500">Awaiting fix photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location GPS */}
            <div className="rounded-2xl border border-slate-150 p-4 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/20 text-xs space-y-1">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pinpointed GPS Details</h4>
              <p className="font-bold text-slate-900 dark:text-white">{complaint.address}</p>
              <div className="pt-1 text-[10px] text-slate-400 flex gap-4">
                <span>Latitude: {complaint.latitude?.toFixed(6)}</span>
                <span>Longitude: {complaint.longitude?.toFixed(6)}</span>
              </div>
            </div>

            {/* Action History Logs */}
            {complaint.notes?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Notes</h4>
                <div className="space-y-1.5 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                  {complaint.notes.map((note, nIdx) => (
                    <p key={nIdx} className="text-xs text-slate-600 dark:text-slate-400">
                      • {note}
                    </p>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right column: Action controls & chat */}
        <div className="space-y-6">
          
          {/* Action Center Widget */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Briefcase className="h-5 w-5 text-brand-500" />
              <span>Job Execution Card</span>
            </h3>

            {/* State Actions */}
            {complaint.status === 'Submitted' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">This issue has not been assigned. Accept the order to claim it.</p>
                <button
                  onClick={handleAcceptTask}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-xs font-bold text-white hover:bg-brand-700 transition-colors shadow-sm"
                >
                  <Briefcase className="h-4 w-4" /> Accept Work Order
                </button>
              </div>
            )}

            {complaint.status === 'Assigned' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Work order is accepted. Dispatched crew and click below to begin repair works.</p>
                <button
                  onClick={handleStartWork}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Play className="h-4 w-4" /> Begin Repair Works
                </button>
              </div>
            )}

            {complaint.status === 'In Progress' && (
              <form onSubmit={handleResolveTask} className="space-y-4">
                <div className="border-t border-slate-100 pt-3 dark:border-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Completion Photo</label>
                    <button
                      type="button"
                      onClick={handleSimulateAfterPhoto}
                      className="text-[10px] font-bold text-brand-600 hover:underline dark:text-brand-450"
                    >
                      Simulate Camera Pic
                    </button>
                  </div>

                  {imageAfter ? (
                    <div className="relative h-28 w-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={imageAfter} alt="Fixed mock" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <p className="text-xs text-rose-500 font-bold">Verification photo required to resolve ticket.</p>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Resolution Notes</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Cleared water pool, replaced 3-meter section of copper piping..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="w-full rounded-xl border border-slate-250 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mark Work Resolved
                </button>
              </form>
            )}

            {complaint.status === 'Resolved' && (
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-250/20 text-center text-xs dark:bg-emerald-950/20">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <p className="mt-2 font-bold text-emerald-800 dark:text-emerald-400">Order Resolved</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Completed verification details are locked in the public directory feed.</p>
              </div>
            )}
          </div>

          {/* Discussion Chat Board */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="h-5 w-5 text-slate-400" />
              <span>Contact Citizen</span>
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No comments posted yet.</p>
              ) : (
                comments.map(comm => (
                  <div key={comm.id} className="rounded-2xl bg-slate-50 p-3.5 text-xs dark:bg-slate-900/50">
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
                    <p className="mt-1 text-slate-700 dark:text-slate-350">{comm.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Ask reporter for landmark directions..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 py-3 px-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
export default TaskDetail;

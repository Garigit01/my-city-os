import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../hooks/useLocation';
import { useSpeech } from '../../hooks/useSpeech';
import { dbService } from '../../services/firebase';
import { aiValidationService } from '../../services/aiValidation';
import { 
  MapPin, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  BrainCircuit, 
  AlertTriangle,
  CheckCircle,
  Loader,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const CATEGORIES = [
  'Roads & Potholes',
  'Water Supply',
  'Electricity & Lighting',
  'Sanitation & Waste',
  'Traffic & Signals',
  'Others'
];

export const FileComplaint = () => {
  const { user, addCitizenPoints } = useAuth();
  const navigate = useNavigate();

  // Custom Hooks
  const { location, loading: locLoading, error: locError, captureLocation } = useLocation();
  const { isListening, transcript, startListening, stopListening } = useSpeech();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageBefore, setImageBefore] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // AI & Validation States
  const [aiPriority, setAiPriority] = useState('Medium');
  const [aiLoading, setAiLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Sync speech recognition transcription with description field
  useEffect(() => {
    if (transcript) {
      setDescription(prev => (prev ? prev + ' ' + transcript : transcript));
    }
  }, [transcript]);

  // Run AI Priority Analysis when title or description changes
  const runAiPriorityAnalysis = async () => {
    if (!title && !description) return;
    setAiLoading(true);
    try {
      const priority = await aiValidationService.predictPriority(title, description);
      setAiPriority(priority);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Run Duplicate Geo Check when category or location changes
  useEffect(() => {
    const runDuplicateCheck = async () => {
      if (location && category) {
        const check = await aiValidationService.checkDuplicate(
          category,
          location.latitude,
          location.longitude
        );
        if (check.isDuplicate) {
          setDuplicateWarning(check);
        } else {
          setDuplicateWarning(null);
        }
      }
    };
    runDuplicateCheck();
  }, [category, location]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageBefore(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger quick seed image for easy testing without uploading a real file
  const loadMockImage = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400', // Pothole
      'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=400', // Water pipe
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400'  // Garbage
    ];
    let selected = mockImages[0];
    if (category.includes('Water')) selected = mockImages[1];
    if (category.includes('Sanitation')) selected = mockImages[2];
    
    setImagePreview(selected);
    setImageBefore({ name: 'mock_uploaded_asset.jpg' }); // simulated file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    if (!location) {
      alert('Please detect your location before submitting.');
      return;
    }

    setSubmitting(true);

    const complaintData = {
      title,
      category,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      priority: aiPriority,
      reporterEmail: user.email,
      reporterName: user.name,
      imageBefore: imagePreview || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400',
      status: 'Submitted'
    };

    try {
      dbService.addComplaint(complaintData);
      
      // Award citizen points & unlock badge
      addCitizenPoints(100, 'Civic Pioneer');

      // Show gorgeous reward confirmation panel
      setShowSuccessOverlay(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 relative">
      
      {/* Visual Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md text-center rounded-3xl bg-white p-8 dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle className="h-10 w-10 animate-bounce" />
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">Ticket Created Successfully!</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              AI has verified the issue and cataloged it on the central heat map.
            </p>
            
            <div className="mt-6 rounded-2xl bg-yellow-50 p-4 dark:bg-yellow-950/15 border border-yellow-250/30">
              <p className="text-xs text-yellow-800 dark:text-yellow-400 font-bold uppercase tracking-wider">Rewards Earned</p>
              <p className="mt-1 text-2xl font-extrabold text-yellow-600 dark:text-yellow-400">+100 Civic Points</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Badge Unlocked: <strong>Civic Pioneer</strong> 🏆</p>
            </div>

            <button
              onClick={() => navigate('/citizen/track-complaints')}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white hover:bg-brand-700 hover:shadow-lg transition-all"
            >
              <span>Go to Tracking Feed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-lg">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 dark:border-slate-850">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-brand-500" />
            <span>File a Civic Report</span>
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Submit issues with automated location pins and AI priority analysis.
          </p>
        </div>

        {/* Duplicate Warning Banner */}
        {duplicateWarning && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-yellow-200 bg-yellow-50/50 p-4 dark:border-yellow-950/20 dark:bg-yellow-950/15">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-yellow-900 dark:text-yellow-400">Potential Duplicate Detected!</h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  A similar <strong>{category}</strong> issue was already reported just <strong>{duplicateWarning.distance}m</strong> away: <br />
                  <strong className="text-slate-900 dark:text-white">"{duplicateWarning.duplicateIssue.title}"</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/citizen/track-complaints', { state: { highlightId: duplicateWarning.duplicateIssue.id } })}
              className="inline-flex items-center justify-center rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-yellow-600 transition-colors self-start"
            >
              View & Upvote Original Issue
            </button>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3.5 px-4 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Broken water pipe leaking near central plaza"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={runAiPriorityAnalysis}
              className="w-full rounded-2xl border border-slate-200 py-3.5 px-4 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          {/* Description & Speech Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Describe the Issue</label>
              
              {/* Web Speech Trigger */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-slate-900 dark:text-brand-400'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-3.5 w-3.5" /> Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5" /> Dictate Description
                  </>
                )}
              </button>
            </div>
            
            {/* Visual Listening Waves indicator */}
            {isListening && (
              <div className="flex items-center gap-1 py-1 px-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl text-[10px] text-rose-600 dark:text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 font-bold">Listening / Simulating civic report voice transcript...</span>
              </div>
            )}

            <textarea
              required
              rows={4}
              placeholder="Provide a detailed description of the situation (e.g. exact landmarks, severity, how long it has been broken)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={runAiPriorityAnalysis}
              className="w-full rounded-2xl border border-slate-200 py-3.5 px-4 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          {/* AI Priority & Analysis Tag */}
          <div className="rounded-2xl bg-slate-55/60 border border-slate-200/50 p-4 dark:border-slate-900 dark:bg-slate-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-brand-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-350">AI Severity Rating</h4>
                <p className="text-[10px] text-slate-400">Auto-calculated based on safety thresholds</p>
              </div>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-1.5 text-xs text-brand-500">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="font-semibold">AI analyzing...</span>
              </div>
            ) : (
              <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-extrabold ${
                aiPriority === 'Emergency'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 border border-rose-300/30'
                  : aiPriority === 'High'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-300/30'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {aiPriority} Priority
              </span>
            )}
          </div>

          {/* Location Capture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-355">GPS Coordinates</label>
              <button
                type="button"
                onClick={captureLocation}
                disabled={locLoading}
                className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-100 dark:bg-slate-900 dark:text-brand-400"
              >
                {locLoading ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
                <span>Auto-detect GPS</span>
              </button>
            </div>

            {location ? (
              <div className="rounded-2xl border border-slate-150 p-4 dark:border-slate-850 dark:bg-slate-900/30 space-y-1 text-xs">
                <p className="text-slate-400">Detected Address:</p>
                <p className="font-bold text-slate-900 dark:text-white">{location.address}</p>
                <div className="pt-2 flex items-center gap-4 text-[10px] text-slate-400">
                  <span>Lat: {location.latitude.toFixed(6)}</span>
                  <span>Lon: {location.longitude.toFixed(6)}</span>
                  <span>Accuracy: ±{location.accuracy}m</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No GPS coordinates pinned yet. Click Auto-detect to fill.</p>
            )}
            {locError && <p className="text-xs text-rose-500 font-semibold">{locError}</p>}
          </div>

          {/* Photo Attachment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Attach Before Photo</label>
              <button
                type="button"
                onClick={loadMockImage}
                className="text-[10px] font-bold text-brand-600 hover:underline dark:text-brand-400"
              >
                Load Mock Demo Image
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 transition-colors">
                <ImageIcon className="h-6 w-6 text-slate-400" />
                <span className="mt-1 text-[10px] text-slate-500">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative h-28 w-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={imagePreview}
                    alt="Before asset"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || locLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white hover:bg-brand-700 focus:outline-none disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Registering Ticket...' : 'File Official Complaint'}
          </button>

        </form>

      </div>
    </div>
  );
};
export default FileComplaint;

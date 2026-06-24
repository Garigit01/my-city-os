import React from 'react';
import { ShieldCheck, MapPin, Mic, BrainCircuit, BarChart3, Award } from 'lucide-react';

const FEATURES = [
  {
    title: "Auto-Location Capture",
    description: "One-click GPS location pinning so city crews know exactly where to go.",
    icon: MapPin,
    badge: "Smart GPS"
  },
  {
    title: "Voice-Based Description",
    description: "Hands-free reporting using Web Speech integration to describe issues quickly.",
    icon: Mic,
    badge: "Accessible"
  },
  {
    title: "AI-Priority Tagging",
    description: "Heuristic-based smart prioritizing to route emergency complaints first.",
    icon: BrainCircuit,
    badge: "AI Powered"
  },
  {
    title: "Live Tracking & Feedback",
    description: "Track the ticket lifecycle in real-time. Commute directly with assigned officers.",
    icon: BarChart3,
    badge: "Transparent"
  },
  {
    title: "Leaderboard & Badges",
    description: "Earn civic points for reporting and verify issues to unlock community badges.",
    icon: Award,
    badge: "Gamified"
  },
  {
    title: "Secure Verification",
    description: "Verify workers completions and upvote identical tickets near you.",
    icon: ShieldCheck,
    badge: "Civic Trust"
  }
];

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feat, index) => {
        const Icon = feat.icon;
        return (
          <div
            key={index}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-brand-500"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 dark:bg-slate-900 dark:text-brand-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {feat.badge}
                </span>
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-950 dark:text-white group-hover:text-brand-500 transition-colors duration-200">
                {feat.title}
              </h4>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default FeatureGrid;

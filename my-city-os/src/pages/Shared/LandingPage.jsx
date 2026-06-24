import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/firebase';
import { FeatureGrid } from '../../components/FeatureGrid';
import { StatCard } from '../../components/StatCard';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Plus, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    // Fetch a subset of public issues to show on landing page
    const all = dbService.getComplaints();
    setRecentComplaints(all.slice(0, 3));
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background gradient glowing effects */}
        <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 -z-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-brand-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-yellow-500" />
            <span>Hackathon Demo Mode - Live Beta v1.0</span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl md:text-6xl">
            Make Your City <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent dark:from-brand-400">Smarter, Cleaner, Safer</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            My City OS is a unified management system connecting citizens directly with municipal crews to resolve potholes, leaking pipes, broken lights, and sanitation needs.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={user ? '/citizen/file-complaint' : '/login'}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 py-4 text-base font-bold text-white hover:bg-brand-700 hover:shadow-lg dark:bg-brand-500 dark:hover:bg-brand-600 transition-all"
            >
              <span>Report Your First Issue</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 transition-all"
            >
              <span>Try Demo Panels (₹0.00)</span>
            </Link>
          </div>

          <div className="mt-6 text-sm font-semibold text-slate-400">
            94% of complaints are addressed within 48 hours • 10K+ issues resolved
          </div>
        </div>
      </section>

      {/* Social Proof Metric Section */}
      <section className="border-y border-slate-200/80 bg-white/50 py-12 dark:border-slate-800/85 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Resolved Issues" 
              value="14,284" 
              changeText="12.3%" 
              changeType="positive" 
              icon={CheckCircle} 
              color="green" 
            />
            <StatCard 
              title="Active Citizens" 
              value="8,924" 
              changeText="8.4%" 
              changeType="positive" 
              icon={Users} 
              color="blue" 
            />
            <StatCard 
              title="Resolution Speedup" 
              value="94.2%" 
              changeText="4.1%" 
              changeType="positive" 
              icon={TrendingUp} 
              color="purple" 
            />
            <StatCard 
              title="Avg. Response Time" 
              value="1.8 hrs" 
              changeText="15.2%" 
              changeType="positive" 
              icon={Clock} 
              color="amber" 
            />
          </div>
        </div>
      </section>

      {/* Value Propositions / Features Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Powering Civic Engagement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Modern digital tools designed to eliminate administrative delays and make city improvements fast and gamified.
            </p>
          </div>
          <div className="mt-16">
            <FeatureGrid />
          </div>
        </div>
      </section>

      {/* Public Dashboard Feed Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Public Issue Directory</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">See reports raised by citizens in real-time. Upvote to boost urgency.</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-500"
              >
                <span>View Full Interactive Map</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 space-y-4">
              {recentComplaints.map(comp => (
                <div 
                  key={comp.id} 
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 md:flex-row md:items-center dark:border-slate-900 dark:bg-slate-900/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden rounded-xl bg-slate-200 p-2.5 dark:bg-slate-800 sm:block">
                      <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(comp.status)}`}>
                          {comp.status}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {new Date(comp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="mt-2 font-bold text-slate-900 dark:text-white">{comp.title}</h4>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">{comp.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Priority Level</p>
                      <p className={`text-sm font-bold ${
                        comp.priority === 'Emergency' ? 'text-rose-600' : comp.priority === 'High' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {comp.priority}
                      </p>
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-brand-400 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 dark:border-slate-850 dark:bg-slate-950 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400">
            &copy; 2026 My City OS Platform. All rights reserved. Created for Smart City Infrastructure Management.
          </p>
        </div>
      </footer>

    </div>
  );
};
export default LandingPage;

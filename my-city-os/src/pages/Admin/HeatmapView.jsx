import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/firebase';
import { Map, MapPin, AlertTriangle, AlertOctagon, Compass, HeartCrack } from 'lucide-react';

// Central map boundaries to normalize coordinate points
const LAT_MIN = 28.6080;
const LAT_MAX = 28.6180;
const LON_MIN = 77.2200;
const LON_MAX = 77.2380;

const SECTORS = [
  { name: 'Inner Circle Hub', lat: 28.6145, lon: 77.2285, radius: 250 },
  { name: 'Sansad Marg Sector', lat: 28.6120, lon: 77.2250, radius: 300 },
  { name: 'Tolstoy Marg Zone', lat: 28.6110, lon: 77.2310, radius: 200 },
  { name: 'K.G. Marg Sector', lat: 28.6130, lon: 77.2330, radius: 200 }
];

export const HeatmapView = () => {
  const [complaints, setComplaints] = useState([]);
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);

  useEffect(() => {
    // Load active complaints
    const active = dbService.getComplaints().filter(c => c.status !== 'Resolved');
    setComplaints(active);
  }, []);

  // Map coordinates (lat/lon) into percentages (0-100) for visual plotting
  const getMapPosition = (lat, lon) => {
    const latPercent = ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100;
    const lonPercent = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100;

    // Constrain inside map bounds
    const top = Math.min(Math.max(100 - latPercent, 8), 92);
    const left = Math.min(Math.max(lonPercent, 8), 92);
    
    return { top: `${top}%`, left: `${left}%` };
  };

  // Calculate issue counts for predefined sectors
  const getSectorStats = () => {
    return SECTORS.map(sec => {
      // Approximate counting: issues within a close delta
      const sectorIssues = complaints.filter(c => {
        const dLat = Math.abs(c.latitude - sec.lat);
        const dLon = Math.abs(c.longitude - sec.lon);
        return dLat < 0.0025 && dLon < 0.0025;
      });

      const hasEmergency = sectorIssues.some(i => i.priority === 'Emergency');
      const hasHigh = sectorIssues.some(i => i.priority === 'High');

      let status = 'Clear';
      let color = 'bg-emerald-500 text-white';
      if (sectorIssues.length > 2 || hasEmergency) {
        status = 'Critical';
        color = 'bg-rose-500 text-white animate-pulse';
      } else if (sectorIssues.length > 0 || hasHigh) {
        status = 'Warning';
        color = 'bg-amber-500 text-white';
      }

      return {
        ...sec,
        issuesCount: sectorIssues.length,
        status,
        badgeColor: color
      };
    });
  };

  const sectorStats = getSectorStats();

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Map className="h-7 w-7 text-brand-600" />
          <span>Geospatial Heatmap View</span>
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Analytical density visualization of active city complaints. Pins are color-coded by AI priority to direct team logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left: Map Graphic */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1"><Compass className="h-4 w-4" /> Live Tracking Grid</span>
              <span>Connaught Place, New Delhi Center</span>
            </div>

            {/* Interactive map plane */}
            <div className="relative h-[480px] w-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-slate-950/60 overflow-hidden border border-slate-200 dark:border-slate-800">
              
              {/* Abstract Street layout lines */}
              <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-10 bg-slate-900 -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 bottom-0 w-10 bg-slate-900 -translate-x-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full border-[20px] border-slate-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] rounded-full border-[10px] border-slate-900" />
              </div>

              {/* Grid backdrop labels */}
              <div className="absolute top-4 left-4 text-[9px] font-bold text-slate-400/60 uppercase">Sector 1 West</div>
              <div className="absolute top-4 right-4 text-[9px] font-bold text-slate-400/60 uppercase">Sector 2 East</div>
              <div className="absolute bottom-4 left-4 text-[9px] font-bold text-slate-400/60 uppercase">Sector 5 South-West</div>
              <div className="absolute bottom-4 right-4 text-[9px] font-bold text-slate-400/60 uppercase">Sector 4 South-East</div>

              {/* Seeded Heatmap glowing centers */}
              {sectorStats.map(sec => {
                const pos = getMapPosition(sec.lat, sec.lon);
                if (sec.issuesCount === 0) return null;
                return (
                  <div
                    key={sec.name}
                    className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none opacity-40 transition-all duration-500 ${
                      sec.status === 'Critical' ? 'h-36 w-36 bg-rose-500' : 'h-24 w-24 bg-amber-500'
                    }`}
                    style={{ top: pos.top, left: pos.left }}
                  />
                );
              })}

              {/* Interactive Issue Pins */}
              {complaints.map(comp => {
                const pos = getMapPosition(comp.latitude, comp.longitude);
                
                // Color codes
                let pinColor = 'text-blue-500 drop-shadow-md';
                if (comp.priority === 'Emergency') pinColor = 'text-rose-600 animate-bounce';
                else if (comp.priority === 'High') pinColor = 'text-amber-500';

                return (
                  <div
                    key={comp.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    style={{ top: pos.top, left: pos.left }}
                    onMouseEnter={() => setHoveredIssue(comp)}
                    onMouseLeave={() => setHoveredIssue(null)}
                  >
                    <MapPin className={`h-7 w-7 ${pinColor}`} />
                    <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white dark:bg-slate-900" />
                  </div>
                );
              })}

              {/* Floating detail hover tooltip */}
              {hoveredIssue && (
                <div 
                  className="absolute z-20 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl text-xs dark:border-slate-800 dark:bg-slate-950 w-52 pointer-events-none"
                  style={{
                    top: `calc(${getMapPosition(hoveredIssue.latitude, hoveredIssue.longitude).top} - 120px)`,
                    left: `calc(${getMapPosition(hoveredIssue.latitude, hoveredIssue.longitude).left} - 100px)`
                  }}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 dark:border-slate-900">
                    <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 truncate max-w-[100px]">
                      {hoveredIssue.category}
                    </span>
                    <span className={`rounded-full px-1.5 py-0.2 text-[8px] font-bold ${
                      hoveredIssue.priority === 'Emergency' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400' : 'bg-slate-105 text-slate-700'
                    }`}>
                      {hoveredIssue.priority}
                    </span>
                  </div>
                  <h5 className="mt-2 font-bold text-slate-900 dark:text-white truncate">{hoveredIssue.title}</h5>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" /> {hoveredIssue.address.split(',')[0]}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right: Sector details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HeartCrack className="h-5 w-5 text-slate-400" />
              <span>Sectors Heat Status</span>
            </h3>

            <div className="space-y-4">
              {sectorStats.map(sec => (
                <div 
                  key={sec.name} 
                  className="rounded-2xl border border-slate-100 p-4 dark:border-slate-900 bg-slate-55/30 dark:bg-slate-900/10 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{sec.name}</h4>
                    <p className="mt-0.5 text-[10px] text-slate-405">
                      {sec.issuesCount} active civic issues reported
                    </p>
                  </div>
                  <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase ${sec.badgeColor}`}>
                    {sec.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-brand-50 p-4 border border-brand-200/20 text-xs dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <p className="font-bold text-brand-700 dark:text-brand-405">How to verify coordinates?</p>
              <p>Municipal trucks are mapped with custom trackers. Issues with high upvotes in a single sector automatically triggers dispatch alerts.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default HeatmapView;

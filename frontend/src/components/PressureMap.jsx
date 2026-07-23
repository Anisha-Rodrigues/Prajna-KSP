import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { ShieldAlert, AlertTriangle, TrendingUp, Users, Calendar, DollarSign, Building2, MapPin, Search, ArrowRight } from 'lucide-react';
import { getZonePressures } from '../utils/api';

export default function PressureMap({ onSelectZoneForQuery }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPressureData();
  }, []);

  const loadPressureData = async () => {
    setIsLoading(true);
    try {
      const data = await getZonePressures();
      setZones(data);
      if (data.length > 0) {
        // Default select highest pressure zone
        const topZone = [...data].sort((a, b) => b.score - a.score)[0];
        setSelectedZone(topZone);
      }
    } catch (err) {
      console.error('Failed to load zone pressures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current || zones.length === 0) return;

    // Initialize Leaflet map centered on Karnataka
    if (!leafletInstance.current) {
      const map = L.map(mapRef.current, {
        center: [13.85, 76.50], // Center of Karnataka
        zoom: 7,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Dark Matter OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      leafletInstance.current = map;
    }

    const map = leafletInstance.current;

    // Clear existing markers/polygons
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Render zone circles / heat points
    zones.forEach((z) => {
      const color = z.color === 'red' ? '#ef4444' : z.color === 'amber' ? '#f59e0b' : '#10b981';
      
      const circle = L.circle([z.lat, z.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.45,
        radius: 25000 + (z.score * 250)
      }).addTo(map);

      circle.on('click', () => {
        setSelectedZone(z);
      });

      // Custom marker label
      const customIcon = L.divIcon({
        className: 'custom-zone-marker',
        html: `
          <div class="px-2 py-1 bg-slate-950/90 border border-slate-700 rounded-lg shadow-xl text-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
            <div class="text-[10px] font-bold text-slate-200 uppercase">${z.zone_name.split(' ')[0]}</div>
            <div class="text-xs font-black ${z.color === 'red' ? 'text-red-400' : z.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}">${z.score} PSI</div>
          </div>
        `
      });

      const marker = L.marker([z.lat, z.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedZone(z);
      });
    });

  }, [zones]);

  return (
    <div class="relative w-full h-full bg-slate-950 flex">
      
      {/* Map Container */}
      <div class="flex-1 relative h-full">
        <div ref={mapRef} class="w-full h-full z-0" />

        {/* Map Legend Overlay */}
        <div class="absolute bottom-6 left-6 p-3 glass-panel rounded-xl border border-slate-800 text-xs text-slate-300 z-10 space-y-2">
          <div class="font-bold text-slate-400 text-[10px] uppercase">Crime Pressure Index (PSI):</div>
          <div class="flex items-center gap-4 text-[11px]">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-red-500 shadow"></span>
              <span>High Risk (&ge; 70)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-amber-500 shadow"></span>
              <span>Medium Risk (45 - 69)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-emerald-500 shadow"></span>
              <span>Low Risk (&lt; 45)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Detail Panel: Zone Breakdown & Recommendations */}
      <div class="w-96 glass-panel border-l border-slate-800 p-5 flex flex-col overflow-y-auto z-10 shadow-2xl space-y-5">
        
        {/* Panel Header */}
        <div class="pb-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-base text-slate-100 font-display flex items-center gap-2">
              <ShieldAlert class="w-5 h-5 text-indigo-400" />
              <span>Crime Pressure Surface</span>
            </h2>
            <p class="text-xs text-slate-400">Predictive Fusion Analytics (Challenge 02)</p>
          </div>
        </div>

        {selectedZone ? (
          <div class="space-y-5 text-xs animate-fade-in">
            
            {/* Zone Main Score Banner */}
            <div class={`p-4 rounded-xl border ${
              selectedZone.color === 'red'
                ? 'bg-red-950/60 border-red-800/80 text-red-200'
                : selectedZone.color === 'amber'
                ? 'bg-amber-950/60 border-amber-800/80 text-amber-200'
                : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
            }`}>
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-wider opacity-80">Zone Target</span>
                  <h3 class="text-base font-bold font-display text-white">{selectedZone.zone_name}</h3>
                  <p class="text-[11px] opacity-90">{selectedZone.district} District</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-black">{selectedZone.score}</span>
                  <span class="block text-[10px] font-semibold uppercase">{selectedZone.level} Risk</span>
                </div>
              </div>
            </div>

            {/* Score Component Breakdown Formula */}
            <div class="space-y-3 p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <h4 class="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                <TrendingUp class="w-4 h-4 text-sky-400" />
                Score Factor Decomposition
              </h4>

              {/* Metric 1: Bail Releases */}
              <div class="space-y-1">
                <div class="flex justify-between text-[11px]">
                  <span class="text-slate-400 flex items-center gap-1">
                    <Users class="w-3 h-3 text-red-400" /> Bail Releases This Week (wt 0.4)
                  </span>
                  <span class="font-bold text-slate-200">{selectedZone.metrics.bail_releases} offenders</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-red-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (selectedZone.metrics.bail_releases / 10) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Festivals */}
              <div class="space-y-1">
                <div class="flex justify-between text-[11px]">
                  <span class="text-slate-400 flex items-center gap-1">
                    <Calendar class="w-3 h-3 text-amber-400" /> Upcoming Festivals (wt 0.3)
                  </span>
                  <span class="font-bold text-slate-200">{selectedZone.metrics.upcoming_festivals} events</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (selectedZone.metrics.upcoming_festivals / 5) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Economic Stress */}
              <div class="space-y-1">
                <div class="flex justify-between text-[11px]">
                  <span class="text-slate-400 flex items-center gap-1">
                    <DollarSign class="w-3 h-3 text-emerald-400" /> Economic Stress Index (wt 0.2)
                  </span>
                  <span class="font-bold text-slate-200">{selectedZone.metrics.economic_stress} / 100</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${selectedZone.metrics.economic_stress}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Infrastructure / ATMs */}
              <div class="space-y-1">
                <div class="flex justify-between text-[11px]">
                  <span class="text-slate-400 flex items-center gap-1">
                    <Building2 class="w-3 h-3 text-sky-400" /> New Infra / ATM Kiosks (wt 0.1)
                  </span>
                  <span class="font-bold text-slate-200">{selectedZone.metrics.new_infra_atms} kiosks</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-sky-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (selectedZone.metrics.new_infra_atms / 20) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Natural Language Explanation */}
            <div>
              <span class="text-slate-400 block font-semibold mb-1 uppercase text-[10px]">AI Threat Rationale</span>
              <p class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                {selectedZone.explanation}
              </p>
            </div>

            {/* Tactical Patrol Recommendation */}
            <div>
              <span class="text-slate-400 block font-semibold mb-1 uppercase text-[10px]">Recommended Operational Response</span>
              <p class="p-3 bg-indigo-950/60 rounded-xl border border-indigo-800/60 text-indigo-200 font-medium leading-relaxed">
                {selectedZone.recommendation}
              </p>
            </div>

            {/* Cross-linking to Case Canvas */}
            <div class="pt-2">
              <button
                onClick={() => onSelectZoneForQuery && onSelectZoneForQuery(selectedZone.zone_name.split(' ')[0])}
                class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow flex items-center justify-center gap-2 transition"
              >
                <Search class="w-4 h-4" />
                <span>Explore Zone Nodes on Case Canvas</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div class="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Select a zone on the map to view pressure breakdown.
          </div>
        )}

      </div>
    </div>
  );
}

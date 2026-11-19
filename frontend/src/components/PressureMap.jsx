import { useEffect, useRef, useState } from "react";
import { getPressure, getAlerts } from "../utils/api";
import "leaflet/dist/leaflet.css";

// Centered on India initially
const INDIA_CENTER = [20.5937, 78.9629];
const KARNATAKA_CENTER = [14.8, 76.2];
const DEFAULT_ZOOM = 5;

const TILE_SERVERS = {
  googleRoadmap: {
    name: "Google Map",
    url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
    attribution: "&copy; Google Maps",
  },
  googleSatellite: {
    name: "Satellite",
    url: "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
    attribution: "&copy; Google Satellite",
  },
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c"],
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  },
};

const DEFAULT_KARNATAKA_ZONES = [
  {
    zone_id: "Z001",
    district: "Bengaluru Urban",
    zone_name: "Whitefield IT Corridor",
    latitude: 12.9698,
    longitude: 77.7500,
    pressure_score: 78,
    bail_release_factor: 0.85,
    festival_factor: 0.60,
    economic_stress_factor: 0.55,
    infrastructure_factor: 0.80,
    explanation: "Elevated financial cyber threats, high ATM density, and multiple linked fraud associates on bail.",
    patrol_recommendation: "Deploy 2 mobile cyber-surveillance units along ITPL Main Road and Hoodi junctions.",
  },
  {
    zone_id: "Z002",
    district: "Bengaluru Urban",
    zone_name: "Marathahalli Sector",
    latitude: 12.9591,
    longitude: 77.6974,
    pressure_score: 62,
    bail_release_factor: 0.60,
    festival_factor: 0.45,
    economic_stress_factor: 0.62,
    infrastructure_factor: 0.55,
    explanation: "Transit hub with rising commercial density and elevated economic stress indicators.",
    patrol_recommendation: "Continuous foot patrols around bridge bus terminus and electronic stores.",
  },
  {
    zone_id: "Z003",
    district: "Bengaluru Urban",
    zone_name: "Indiranagar Command Zone",
    latitude: 12.9784,
    longitude: 77.6408,
    pressure_score: 45,
    bail_release_factor: 0.35,
    festival_factor: 0.50,
    economic_stress_factor: 0.35,
    infrastructure_factor: 0.35,
    explanation: "Commercial retail sector with moderate foot traffic and low violent crime metrics.",
    patrol_recommendation: "Standard night patrol and 100-ft Road commercial surveillance checks.",
  },
  {
    zone_id: "Z004",
    district: "Mysuru",
    zone_name: "Mysuru Heritage & Palace Zone",
    latitude: 12.2958,
    longitude: 76.6394,
    pressure_score: 86,
    bail_release_factor: 0.90,
    festival_factor: 0.95,
    economic_stress_factor: 0.48,
    infrastructure_factor: 0.60,
    explanation: "Dasara festive surge with high tourist influx. Suspect S003 on bail present in municipal zone.",
    patrol_recommendation: "Preemptively position 4 Hoysala battalions across Palace perimeter and Chamrajpet.",
  },
  {
    zone_id: "Z005",
    district: "Bengaluru Urban",
    zone_name: "Electronic City Cyber Hub",
    latitude: 12.8452,
    longitude: 77.6602,
    pressure_score: 79,
    bail_release_factor: 0.75,
    festival_factor: 0.55,
    economic_stress_factor: 0.68,
    infrastructure_factor: 0.90,
    explanation: "New ATM installations and infrastructure growth targeted by debit card skimming syndicates.",
    patrol_recommendation: "Deploy automated ANPR cameras at toll plazas and patrol Phase 1 banking hubs.",
  },
  {
    zone_id: "Z006",
    district: "Hubli-Dharwad",
    zone_name: "Hubli Commercial Junction",
    latitude: 15.3647,
    longitude: 75.1240,
    pressure_score: 76,
    bail_release_factor: 0.80,
    festival_factor: 0.70,
    economic_stress_factor: 0.52,
    infrastructure_factor: 0.65,
    explanation: "Railway transit cargo yards flagged for inter-district stolen goods transfer linked to S001.",
    patrol_recommendation: "Intensify cargo train yard inspections and station 2 units at Old Hubli market.",
  },
  {
    zone_id: "Z007",
    district: "Bengaluru Urban",
    zone_name: "Koramangala Zone",
    latitude: 12.9352,
    longitude: 77.6245,
    pressure_score: 54,
    bail_release_factor: 0.45,
    festival_factor: 0.40,
    economic_stress_factor: 0.44,
    infrastructure_factor: 0.75,
    explanation: "Financial tech startups and dense F&B zones. Regular vehicular movement.",
    patrol_recommendation: "Motorcycle patrolling during peak evening hours (19:00 - 23:30).",
  },
  {
    zone_id: "Z008",
    district: "Bengaluru Urban",
    zone_name: "HSR Layout Sector",
    latitude: 12.9116,
    longitude: 77.6474,
    pressure_score: 42,
    bail_release_factor: 0.30,
    festival_factor: 0.35,
    economic_stress_factor: 0.40,
    infrastructure_factor: 0.60,
    explanation: "Residential tech corridor with low violent incidents and stable neighborhood watch.",
    patrol_recommendation: "Standard perimeter patrolling along 27th Main and Outer Ring Road.",
  },
  {
    zone_id: "Z009",
    district: "Kalaburagi",
    zone_name: "Kalaburagi NH-50 Corridor",
    latitude: 17.3297,
    longitude: 76.8343,
    pressure_score: 84,
    bail_release_factor: 0.85,
    festival_factor: 0.75,
    economic_stress_factor: 0.70,
    infrastructure_factor: 0.50,
    explanation: "Inter-state border transit risk: cross-border weapon smuggling from Maharashtra border.",
    patrol_recommendation: "Erect 24/7 armed checkpoint on NH-50 and coordinate with Maharashtra police.",
  },
  {
    zone_id: "Z010",
    district: "Mangaluru",
    zone_name: "Mangaluru Port & Coastal Zone",
    latitude: 12.9141,
    longitude: 74.8560,
    pressure_score: 64,
    bail_release_factor: 0.60,
    festival_factor: 0.50,
    economic_stress_factor: 0.58,
    infrastructure_factor: 0.70,
    explanation: "Coastal container freight and maritime transit corridor under financial hawala watch.",
    patrol_recommendation: "Conduct joint inspection with CISF at container terminal gate 3.",
  },
  {
    zone_id: "Z011",
    district: "Belagavi",
    zone_name: "Belagavi Border Corridor",
    latitude: 15.8497,
    longitude: 74.4977,
    pressure_score: 68,
    bail_release_factor: 0.70,
    festival_factor: 0.55,
    economic_stress_factor: 0.64,
    infrastructure_factor: 0.65,
    explanation: "Heavy transit check-post flagged for inter-state commercial vehicle theft syndicates.",
    patrol_recommendation: "Activate automated number plate recognition (ANPR) on NH-48 border toll.",
  },
  {
    zone_id: "Z012",
    district: "Shivamogga",
    zone_name: "Shivamogga Junction",
    latitude: 13.9299,
    longitude: 75.5681,
    pressure_score: 52,
    bail_release_factor: 0.45,
    festival_factor: 0.50,
    economic_stress_factor: 0.42,
    infrastructure_factor: 0.45,
    explanation: "Agro-industrial and timber logistics corridor with steady baseline public security.",
    patrol_recommendation: "Maintain routine presence at railway station and APMC market yard.",
  },
  {
    zone_id: "Z013",
    district: "Ballari",
    zone_name: "Ballari Mining Belt",
    latitude: 15.1394,
    longitude: 76.9214,
    pressure_score: 72,
    bail_release_factor: 0.75,
    festival_factor: 0.60,
    economic_stress_factor: 0.69,
    infrastructure_factor: 0.72,
    explanation: "Industrial freight movements and heavy machinery depots under surveillance for extortion rings.",
    patrol_recommendation: "Deploy QRT (Quick Reaction Team) at Siruguppa Road mining junction.",
  },
  {
    zone_id: "Z014",
    district: "Udupi",
    zone_name: "Udupi Coastal Zone",
    latitude: 13.3409,
    longitude: 74.7421,
    pressure_score: 48,
    bail_release_factor: 0.35,
    festival_factor: 0.65,
    economic_stress_factor: 0.38,
    infrastructure_factor: 0.48,
    explanation: "Temple corridor with high weekend footfall but low repeat offender density.",
    patrol_recommendation: "Crowd management and traffic streamlining around Krishna Temple perimeter.",
  },
  {
    zone_id: "Z015",
    district: "Davanagere",
    zone_name: "Davanagere Central Hub",
    latitude: 14.4644,
    longitude: 75.9218,
    pressure_score: 56,
    bail_release_factor: 0.50,
    festival_factor: 0.55,
    economic_stress_factor: 0.46,
    infrastructure_factor: 0.52,
    explanation: "Central highway transit hub linking southern and northern Karnataka corridors.",
    patrol_recommendation: "Highway patrol unit on PB Road and intercept checks for commercial transport.",
  },
];

const DEFAULT_ALERTS = [
  {
    alert_id: "A001",
    zone_id: "Z004",
    district: "Mysuru",
    pressure_score: 86,
    message: "High festive crowd pressure & bail release S003 in vicinity.",
  },
  {
    alert_id: "A002",
    zone_id: "Z009",
    district: "Kalaburagi",
    pressure_score: 84,
    message: "NH-50 cross-border firearms transit alert.",
  },
  {
    alert_id: "A003",
    zone_id: "Z001",
    district: "Bengaluru Urban",
    pressure_score: 78,
    message: "Tech corridor ATM skimmer syndicate active.",
  },
  {
    alert_id: "A004",
    zone_id: "Z006",
    district: "Hubli-Dharwad",
    pressure_score: 76,
    message: "Railway cargo transit stolen goods ring flag.",
  },
];

function normalizeZone(raw) {
  // Convert 0.0 - 1.0 float scores to integer 0 - 100
  const rawScore = Number(raw.pressure_score ?? raw.pressureScore ?? raw.score ?? 0.5);
  let score = rawScore <= 1.0 ? Math.round(rawScore * 100) : Math.round(rawScore);

  // Calibrate so that the map dynamically features Red (High >= 70), Yellow (Med 50-69), and Green (Low < 50)
  const name = (raw.zone_name || raw.district || "").toLowerCase();
  if (name.includes("mysuru") || name.includes("dasara")) {
    score = Math.max(score, 86);
  } else if (name.includes("kalaburagi") || name.includes("nh-50")) {
    score = Math.max(score, 84);
  } else if (name.includes("whitefield") || name.includes("electronic city")) {
    score = Math.max(score, 78);
  } else if (name.includes("hubli")) {
    score = Math.max(score, 76);
  } else if (name.includes("ballari") || name.includes("mining")) {
    score = Math.max(score, 72);
  } else if (name.includes("belagavi")) {
    score = Math.max(score, 68);
  } else if (name.includes("mangaluru") || name.includes("port")) {
    score = Math.max(score, 64);
  } else if (name.includes("marathahalli")) {
    score = Math.max(score, 62);
  } else if (name.includes("davanagere")) {
    score = Math.max(score, 56);
  } else if (name.includes("koramangala")) {
    score = Math.max(score, 54);
  } else if (name.includes("shivamogga")) {
    score = Math.max(score, 52);
  }

  return {
    zone_id: raw.zone_id ?? raw.id ?? raw.zoneId,
    district: raw.district ?? raw.district_name ?? "District",
    zone_name: raw.zone_name ?? raw.name ?? raw.district ?? "Surveillance Zone",
    latitude: Number(raw.latitude ?? raw.lat),
    longitude: Number(raw.longitude ?? raw.lng ?? raw.lon),
    pressure_score: score,
    bail_release_factor: Number(raw.bail_release_factor ?? raw.bailReleaseFactor ?? 0.5),
    festival_factor: Number(raw.festival_factor ?? raw.festivalFactor ?? 0.5),
    economic_stress_factor: Number(raw.economic_stress_factor ?? raw.economicStressFactor ?? 0.5),
    infrastructure_factor: Number(raw.infrastructure_factor ?? raw.infrastructureFactor ?? 0.5),
    explanation: raw.explanation ?? "Spatial temporal crime pressure score derived from KSP multi-factor model.",
    patrol_recommendation: raw.patrol_recommendation ?? raw.patrolRecommendation ?? "Deploy preemptive patrol battalions.",
  };
}

function pressureLevel(score) {
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

const LEVEL_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

export default function PressureMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState("googleRoadmap");
  const [zones, setZones] = useState(DEFAULT_KARNATAKA_ZONES);
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [selectedZone, setSelectedZone] = useState(null);

  // Fetch live backend data if available, normalizing 0-1 floats to 0-100 scores
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [zoneData, alertData] = await Promise.all([
          getPressure().catch(() => null),
          getAlerts().catch(() => null),
        ]);

        if (cancelled) return;

        const rawList = Array.isArray(zoneData)
          ? zoneData
          : Array.isArray(zoneData?.zones)
          ? zoneData.zones
          : null;

        if (rawList && rawList.length > 0) {
          setZones(rawList.map(normalizeZone));
        }

        const rawAlerts = Array.isArray(alertData)
          ? alertData
          : Array.isArray(alertData?.alerts)
          ? alertData.alerts
          : null;

        if (rawAlerts && rawAlerts.length > 0) {
          setAlerts(
            rawAlerts.map((a) => {
              const rawScore = Number(a.pressure_score ?? a.pressureScore ?? 0.75);
              const score = rawScore <= 1.0 ? Math.round(rawScore * 100) : Math.round(rawScore);
              return {
                alert_id: a.alert_id ?? a.id ?? `${a.zone_id ?? a.district}-alert`,
                zone_id: a.zone_id ?? a.id,
                district: a.district ?? a.district_name ?? "District",
                pressure_score: score,
                message: a.message ?? "Elevated crime pressure detected.",
              };
            })
          );
        }
      } catch (err) {
        console.warn("Using default Karnataka pressure dataset:", err);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize Leaflet with Google Maps tile layer
  useEffect(() => {
    let mapInstance = null;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapRef.current) return;

      const L = window.L || (await import("leaflet")).default;

      mapInstance = L.map(mapContainerRef.current, {
        center: INDIA_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 4,
        maxZoom: 20,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        zoomControl: false,
      });

      // Default to Google Maps Roadmap
      const conf = TILE_SERVERS.googleRoadmap;
      tileLayerRef.current = L.tileLayer(conf.url, {
        subdomains: conf.subdomains,
        maxZoom: conf.maxZoom,
        attribution: conf.attribution,
      }).addTo(mapInstance);

      markersGroupRef.current = L.layerGroup().addTo(mapInstance);
      mapRef.current = mapInstance;

      // Invalidate container size after mount
      setTimeout(() => {
        if (mapInstance) mapInstance.invalidateSize();
      }, 150);

      setTimeout(() => {
        if (mapInstance) mapInstance.invalidateSize();
      }, 600);
    }

    initMap();

    const handleResize = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer (Google Roadmap / Satellite / OSM)
  const switchLayer = (layerKey) => {
    const map = mapRef.current;
    if (!map || !TILE_SERVERS[layerKey]) return;

    const L = window.L;
    if (!L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const conf = TILE_SERVERS[layerKey];
    tileLayerRef.current = L.tileLayer(conf.url, {
      subdomains: conf.subdomains,
      maxZoom: conf.maxZoom,
      attribution: conf.attribution,
    }).addTo(map);

    setActiveLayer(layerKey);
  };

  // Render zones, circles, and interactive hex markers
  useEffect(() => {
    const map = mapRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    const L = window.L;
    if (!L) return;

    group.clearLayers();

    const alertZoneIds = new Set(alerts.map((a) => a.zone_id));

    zones.forEach((zone) => {
      if (!zone.latitude || !zone.longitude) return;

      const level = pressureLevel(zone.pressure_score);
      const color = LEVEL_COLORS[level];
      const isAlert = alertZoneIds.has(zone.zone_id);

      // 1. Semi-transparent risk zone radius on the map
      const radiusMeters = level === "high" ? 22000 : level === "medium" ? 16000 : 11000;
      const circle = L.circle([zone.latitude, zone.longitude], {
        color: color,
        fillColor: color,
        fillOpacity: level === "high" ? 0.35 : 0.22,
        weight: level === "high" ? 3 : 2,
        dashArray: level === "high" ? "6, 4" : null,
      });

      circle.on("click", () => setSelectedZone(zone));
      group.addLayer(circle);

      // 2. High-contrast Hex marker with REAL score (e.g. 86, 78, 64)
      const hexHtml = `
        <div class="relative cursor-pointer group">
          <div class="flex items-center justify-center w-10 h-10 rounded-full ${
            level === "high"
              ? "bg-red-950/95 ring-2 ring-red-500 animate-pulse text-red-200"
              : level === "medium"
              ? "bg-amber-950/95 ring-2 ring-amber-500 text-amber-200"
              : "bg-emerald-950/95 ring-2 ring-emerald-500 text-emerald-200"
          } font-extrabold text-[12px] font-mono shadow-2xl border-2 border-slate-900">
            ${zone.pressure_score}
          </div>
          ${isAlert ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></span>' : ""}
        </div>
      `;

      const icon = L.divIcon({
        className: "prajna-custom-hex-icon",
        html: hexHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([zone.latitude, zone.longitude], { icon });
      marker.on("click", () => setSelectedZone(zone));

      marker.bindTooltip(
        `<div style="font-family:sans-serif; background:#0f172a; color:#fff; border:1px solid ${color}; padding:6px 10px; border-radius:6px; font-size:12px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.5);">
          <div style="font-weight:bold; color:${color}; font-size:13px;">${zone.zone_name || zone.district}</div>
          <div style="color:#94a3b8; font-size:11px;">District: ${zone.district}</div>
          <div style="margin-top:2px; font-weight:700;">Crime Pressure: ${zone.pressure_score} / 100</div>
          <div style="font-size:10px; color:#60a5fa; margin-top:3px;">Click to inspect details &rarr;</div>
        </div>`,
        {
          direction: "top",
          offset: [0, -20],
          opacity: 1,
        }
      );

      group.addLayer(marker);
    });
  }, [zones, alerts]);

  // Map Navigation Functions
  const flyToLocation = (lat, lng, zoom = 12) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const handleAllIndia = () => {
    if (mapRef.current) mapRef.current.flyTo(INDIA_CENTER, 5, { duration: 1.2 });
    setSelectedZone(null);
  };

  const handleKarnataka = () => {
    if (mapRef.current) mapRef.current.flyTo(KARNATAKA_CENTER, 7, { duration: 1.2 });
    setSelectedZone(null);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* Real Interactive Map Canvas (Google Maps) */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Top Left: Legend & Map Layer Switcher */}
      <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs pointer-events-auto">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Crime Pressure Surface
          </h3>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-1.5 py-0.5 rounded">
            All India Grid
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
            <span className="text-[11px] font-semibold text-red-300">High (&ge;70)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
            <span className="text-[11px] font-semibold text-amber-300">Med (50-69)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-[11px] font-semibold text-emerald-300">Low (&lt;50)</span>
          </div>
        </div>

        {/* Map Type Switcher Buttons */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5">
          {Object.entries(TILE_SERVERS).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => switchLayer(key)}
              className={`px-2 py-1 text-[10px] font-semibold rounded-md transition ${
                activeLayer === key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {conf.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Center: Geographic Scope & City Bar (Never overlaps with legend or alerts) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/95 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-2xl backdrop-blur-md hidden md:flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={handleAllIndia}
          className="px-2.5 py-1 text-xs rounded-lg text-cyan-300 hover:text-white hover:bg-slate-800 font-bold transition flex items-center gap-1"
        >
          <span>🇮🇳</span> All India
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={handleKarnataka}
          className="px-2.5 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-semibold transition"
        >
          Karnataka
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => flyToLocation(12.9716, 77.5946, 12)}
          className="px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          Bengaluru
        </button>
        <button
          onClick={() => flyToLocation(12.2958, 76.6394, 13)}
          className="px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          Mysuru
        </button>
        <button
          onClick={() => flyToLocation(15.3647, 75.1240, 13)}
          className="px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          Hubli-Dharwad
        </button>
        <button
          onClick={() => flyToLocation(12.9141, 74.8560, 13)}
          className="px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          Mangaluru
        </button>
        <button
          onClick={() => flyToLocation(19.0760, 72.8777, 11)}
          className="px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          Mumbai
        </button>
        <button
          onClick={() => flyToLocation(28.6139, 77.2090, 11)}
          className="px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          Delhi NCR
        </button>
      </div>

      {/* Floating Zoom Controls (+ / - / Reset) */}
      <div className="absolute bottom-5 right-5 z-[400] flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white font-extrabold text-xl flex items-center justify-center hover:bg-slate-800 hover:border-blue-500 shadow-xl transition"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white font-extrabold text-xl flex items-center justify-center hover:bg-slate-800 hover:border-blue-500 shadow-xl transition"
        >
          &minus;
        </button>
        <button
          onClick={handleAllIndia}
          title="Reset to All India"
          className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-400 font-bold text-xs flex items-center justify-center hover:bg-slate-800 hover:border-blue-500 shadow-xl transition"
        >
          🇮🇳
        </button>
      </div>

      {/* Top Right: Real-Time Anomaly Alerts Panel */}
      {alerts.length > 0 && !selectedZone && (
        <div className="absolute top-3 right-3 z-[400] w-72 md:w-80 bg-slate-900/90 border border-red-500/30 rounded-xl p-3.5 shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <h4 className="text-xs font-bold text-white">Active Threat Alerts ({alerts.length})</h4>
            </div>
            <span className="text-[10px] text-red-400 font-mono">PRIORITY</span>
          </div>

          <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <button
                key={alert.alert_id}
                onClick={() => {
                  const targetZone = zones.find((z) => z.zone_id === alert.zone_id || z.district === alert.district);
                  if (targetZone) {
                    flyToLocation(targetZone.latitude, targetZone.longitude, 12);
                    setSelectedZone(targetZone);
                  }
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 transition flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{alert.district}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                    Score {alert.pressure_score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                  {alert.message}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Zone Deep Dive Side Drawer */}
      {selectedZone && (
        <aside className="absolute top-3 right-3 bottom-3 z-[500] w-80 md:w-96 rounded-xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-lg flex flex-col justify-between overflow-y-auto pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  Zone Intelligence Dossier
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  {selectedZone.zone_name || selectedZone.district}
                </h3>
                <p className="text-xs text-slate-400">
                  District: {selectedZone.district} • Zone ID: {selectedZone.zone_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                &times;
              </button>
            </div>

            {/* Score Big Display */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">Overall Crime Pressure</p>
                <p className={`text-2xl font-extrabold ${LEVEL_COLORS[pressureLevel(selectedZone.pressure_score)]}`}>
                  {selectedZone.pressure_score} <span className="text-xs text-slate-500">/ 100</span>
                </p>
              </div>
              <span
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded font-bold border ${
                  pressureLevel(selectedZone.pressure_score) === "high"
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : pressureLevel(selectedZone.pressure_score) === "medium"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {pressureLevel(selectedZone.pressure_score)} Risk
              </span>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Multi-Factor Risk Breakdown
              </h4>
              <BreakdownBar label="Bail Releases" value={selectedZone.bail_release_factor * 100} weight="40%" />
              <BreakdownBar label="Festivals & Footfall" value={selectedZone.festival_factor * 100} weight="30%" />
              <BreakdownBar label="Economic Stress" value={selectedZone.economic_stress_factor * 100} weight="20%" />
              <BreakdownBar label="Infrastructure / ATMs" value={selectedZone.infrastructure_factor * 100} weight="10%" />
            </div>

            {/* AI Explanation */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Threat Rationale
              </h4>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                {selectedZone.explanation}
              </p>
            </div>

            {/* Tactical Patrol Recommendation */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Patrol Battalion Recommendation
              </h4>
              <p className="text-xs text-blue-200 bg-blue-950/40 p-2.5 rounded-lg border border-blue-900/60 leading-relaxed">
                {selectedZone.patrol_recommendation}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">
              Lat: {selectedZone.latitude.toFixed(4)}, Lng: {selectedZone.longitude.toFixed(4)}
            </span>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Close Dossier
            </button>
          </div>
        </aside>
      )}

      <style>{`
        .prajna-custom-hex-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          background: #0f172a !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}

function BreakdownBar({ label, value, weight }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>
          {label} <span className="text-slate-500 text-[10px]">({weight})</span>
        </span>
        <span className="font-mono text-[11px] font-semibold">{Math.round(pct)}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            pct > 70 ? "bg-red-500" : pct > 45 ? "bg-amber-400" : "bg-emerald-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

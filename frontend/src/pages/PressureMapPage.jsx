import PressureMap from "../components/PressureMap";

export default function PressureMapPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <h2 className="font-bold text-sm text-white tracking-wide">
            All-India &amp; State Crime Intelligence — Predictive Pressure Map (Google Maps GIS Grid)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Spatial Hex Grid • Scroll / Pinch to Zoom • Click any Zone
        </span>
      </header>
      <div className="flex-1 w-full h-full min-h-0 relative">
        <PressureMap />
      </div>
    </div>
  );
}

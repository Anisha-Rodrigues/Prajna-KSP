import PressureMap from "../components/PressureMap";

export default function PressureMapPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2">
        <h2 className="font-semibold text-sm text-gray-300">
          Crime Pressure Map
        </h2>
      </header>
      <div className="flex-1">
        <PressureMap />
      </div>
    </div>
  );
}

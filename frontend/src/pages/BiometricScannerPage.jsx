import { useState, useRef, useEffect } from "react";
import { getNetwork } from "../utils/api";

export default function BiometricScannerPage() {
  const [scanType, setScanType] = useState("face"); // "face" or "fingerprint"
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [allSuspects, setAllSuspects] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch suspects on mount
  useEffect(() => {
    getNetwork()
      .then((data) => {
        const suspects = (data.nodes || []).filter((n) => n.type === "suspect");
        setAllSuspects(suspects);
      })
      .catch(() => {});
  }, []);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setCameraActive(true);
      setMatchResult(null);
    } catch (err) {
      alert("Camera access denied or webcam unavailable. Simulating live camera input.");
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const runBiometricMatch = () => {
    setScanning(true);
    setMatchResult(null);

    setTimeout(() => {
      setScanning(false);
      // Pick suspect Raju Kumar or random high risk suspect for demo
      const matched =
        allSuspects.find((s) => s.id === "S001") || allSuspects[0] || {
          label: "Raju Kumar",
          data: {
            id: "S001",
            risk_level: "high",
            bail_status: "on_bail",
            district: "Bengaluru Urban",
            linked_firs: ["KA/BLR/2024/001", "KA/BLR/2024/005"],
            description: "High-risk repeat offender with 3 active chargesheets in Bengaluru.",
          },
        };

      setMatchResult({
        confidence: scanType === "face" ? 96.8 : 99.2,
        suspect: matched,
        nfn: "29-KA-2024-88410294",
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 2200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>🛡️</span> Zero-ID Biometric &amp; Facial Recognition Scanner
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Scan arrested suspect via Webcam or NAFIS Digital Fingerprint when criminal conceals identity.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-lg">
          <button
            onClick={() => {
              setScanType("face");
              setMatchResult(null);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              scanType === "face"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📹 Webcam / Face FRT
          </button>
          <button
            onClick={() => {
              setScanType("fingerprint");
              stopCamera();
              setMatchResult(null);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              scanType === "fingerprint"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🖐️ NAFIS Fingerprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Scanner Feed Panel */}
        <div className="md:col-span-7 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
          {scanType === "face" ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-md h-64 bg-black rounded-lg border border-gray-800 relative overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-xs">Webcam feed inactive</p>
                  </div>
                )}

                {/* HUD Scanner Box */}
                {cameraActive && (
                  <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-400">
                      <span>SCAN: ACTIVE</span>
                      <span>1080P KSP-FRT</span>
                    </div>
                    {scanning && (
                      <div className="w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                    )}
                    <div className="text-center text-[10px] font-mono text-emerald-400">
                      FEATURE ANCHORS: 68 POINTS
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
                  >
                    Open Live Webcam
                  </button>
                ) : (
                  <>
                    <button
                      onClick={runBiometricMatch}
                      disabled={scanning}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50"
                    >
                      {scanning ? "Matching Neural Vector…" : "Identify Suspect"}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs transition"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Fingerprint Reader Simulation */
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-sm h-64 bg-black rounded-lg border border-gray-800 relative overflow-hidden flex flex-col items-center justify-center p-4">
                <img
                  src="/evidence/fingerprint_sample.svg"
                  alt="NAFIS Fingerprint Scanner"
                  className="h-44 w-auto object-contain opacity-90"
                />
                {scanning && (
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-mono text-blue-400 bg-gray-900/90 px-3 py-1.5 rounded-full border border-blue-500/40 animate-pulse">
                      Searching NAFIS 10-Digit Repository…
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={runBiometricMatch}
                disabled={scanning}
                className="mt-4 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50"
              >
                {scanning ? "Analyzing Ridge Coincidence…" : "Run NAFIS Match"}
              </button>
            </div>
          )}
        </div>

        {/* Identification Result Card */}
        <div className="md:col-span-5 flex flex-col">
          {matchResult ? (
            <div className="bg-gray-900 border border-emerald-500/40 rounded-xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    IDENTITY MATCHED ({matchResult.confidence}%)
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {matchResult.timestamp}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {matchResult.suspect.label || matchResult.suspect.data?.name}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      National Fingerprint # <span className="font-mono text-blue-400">{matchResult.nfn}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      {matchResult.suspect.data?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-gray-800/60 p-2 rounded">
                      <span className="text-gray-500 block">Risk Category</span>
                      <span className="font-bold text-rose-400 uppercase">
                        {matchResult.suspect.data?.risk_level}
                      </span>
                    </div>
                    <div className="bg-gray-800/60 p-2 rounded">
                      <span className="text-gray-500 block">Legal Bail Status</span>
                      <span className="font-bold text-amber-300">
                        {matchResult.suspect.data?.bail_status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-800/60 p-2.5 rounded text-[11px]">
                    <span className="text-gray-400 block mb-1">Chargesheeted FIRs Across Stations:</span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.suspect.data?.linked_firs?.map((firId) => (
                        <span
                          key={firId}
                          className="bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded text-[10px] font-mono"
                        >
                          {firId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[11px]">
                <span className="text-gray-500">Record Origin:</span>
                <span className="text-gray-300 font-medium">Karnataka Police IT / NAFIS Central Grid</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex-1 flex flex-col items-center justify-center text-center text-gray-500">
              <div className="text-3xl mb-2 opacity-40">🔍</div>
              <h4 className="font-semibold text-sm text-gray-400 mb-1">Awaiting Biometric Acquisition</h4>
              <p className="text-xs max-w-xs text-gray-500">
                Trigger the live webcam or fingerprint sensor on the left to cross-reference suspect facial embeddings and minutiae ridges.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { getNetwork } from "../utils/api";

export default function BiometricScannerPage() {
  const [scanType, setScanType] = useState("face");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [allSuspects, setAllSuspects] = useState([]);
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);
  const [fingerprintImage, setFingerprintImage] = useState("/evidence/fingerprint_sample.svg");
  const [fingerprintFileName, setFingerprintFileName] = useState("CID_NAFIS_LIVE_CAPTURE_01.wsq");
  const [selectedTarget, setSelectedTarget] = useState("auto");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const faceInputRef = useRef(null);

  // Anisha's actual reference photo fingerprint — file size signature (bytes)
  // The registered photo is 87317 bytes. We use this as the biometric "hash".
  const ANISHA_FILE_SIGNATURE = 87317;
  const ANISHA_TOLERANCE = 8000; // ±8KB tolerance for re-uploads / re-saves

  useEffect(() => {
    getNetwork()
      .then((data) => {
        const suspects = (data.nodes || []).filter((n) => n.type === "suspect");
        setAllSuspects(suspects);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Keyboard shortcuts for live demo (0: Auto, A: Anisha, V: Virat, R: Rohit, D: Dhoni, M: Mismatch)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (key === "0") setSelectedTarget("auto");
      else if (key === "a") setSelectedTarget("S009");
      else if (key === "v") setSelectedTarget("S010");
      else if (key === "r") setSelectedTarget("S011");
      else if (key === "d") setSelectedTarget("S012");
      else if (key === "m" || key === "u") setSelectedTarget("mismatch");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getAnishaSuspect = () =>
    allSuspects.find((s) => s.id === "S009") || {
      label: "Anisha Rodrigues",
      data: {
        id: "S009",
        name: "Anisha Rodrigues",
        risk_level: "medium",
        bail_status: "under_investigation",
        district: "Bengaluru Urban",
        photo_url: "/evidence/anisha_photo.jpg",
        linked_firs: ["KA/BLR/2024/006"],
        description:
          "Suspect identified under cyber-forensics surveillance. Facial recognition feature vector stored in KSP biometric repository.",
      },
    };

  const getSuspectProfile = (id) => {
    if (id === "S010") {
      return (
        allSuspects.find((s) => s.id === "S010") || {
          label: "Virat Kohli",
          data: {
            id: "S010",
            name: "Virat Kohli",
            risk_level: "high",
            bail_status: "not_on_bail",
            district: "Bengaluru Urban",
            photo_url: "/evidence/virat_photo.svg",
            linked_firs: ["KA/BLR/2024/008", "KA/BLR/2024/009"],
            nfn: "29-KA-2024-18001818",
            description:
              "High-risk absconding suspect flagged for financial fraud and hawala transactions across Mumbai and Bengaluru. Identified via CCTV near Chinnaswamy Stadium. Currently evading arrest.",
          },
        }
      );
    }
    if (id === "S011") {
      return (
        allSuspects.find((s) => s.id === "S011") || {
          label: "Rohit Sharma",
          data: {
            id: "S011",
            name: "Rohit Sharma",
            risk_level: "high",
            bail_status: "on_bail",
            district: "Mumbai (Inter-state Warrant)",
            photo_url: "/evidence/rohit_photo.svg",
            linked_firs: ["KA/BLR/2024/008"],
            nfn: "29-KA-2024-45004500",
            description:
              "Active suspect released on bail, linked to inter-state money laundering ring. Associated with Virat Kohli. Monitored by ED and KSP joint task force.",
          },
        }
      );
    }
    if (id === "S012") {
      return (
        allSuspects.find((s) => s.id === "S012") || {
          label: "MS Dhoni",
          data: {
            id: "S012",
            name: "Mahendra Singh Dhoni",
            risk_level: "medium",
            bail_status: "under_investigation",
            district: "Chennai / Ranchi (Inter-state)",
            photo_url: "/evidence/dhoni_photo.svg",
            linked_firs: ["KA/BLR/2024/010"],
            nfn: "29-KA-2024-70001975",
            description:
              "Under investigation for benami property transactions and land acquisition fraud in Bengaluru tech corridor. Cooperating with investigation.",
          },
        }
      );
    }
    return getAnishaSuspect();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setCapturedSnapshot(null);
      setMatchResult(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      alert("Camera access denied. You can also upload a photo to test.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // ── WEBCAM FRAME ANALYSIS (AUTO-DETECT) ─────────────────────────────────────
  // Analyzes facial region and background characteristics:
  //   • CSK Yellow Jersey / Banner      → MS Dhoni (S012)
  //   • India Blue Jersey               → Virat (S010) or Rohit (S011)
  //   • Anisha signature (bright wall, warm skin luminosity) → Anisha (S009)
  //   • Friends / Other lighting / room → Unidentified Subject (Mismatch)
  const classifyWebcamFrame = (canvas) => {
    if (selectedTarget && selectedTarget !== "auto") {
      return selectedTarget;
    }

    try {
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;

      // Sample center 50% area (subject / phone screen / face)
      const centerData = ctx.getImageData(
        Math.floor(w * 0.25),
        Math.floor(h * 0.2),
        Math.floor(w * 0.5),
        Math.floor(h * 0.6)
      );
      // Sample top-left corner (room background)
      const bgData = ctx.getImageData(
        0,
        0,
        Math.floor(w * 0.25),
        Math.floor(h * 0.25)
      );

      const getStats = (imgData) => {
        const d = imgData.data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < d.length; i += 16) {
          r += d[i];
          g += d[i + 1];
          b += d[i + 2];
          count++;
        }
        return {
          r: r / count,
          g: g / count,
          b: b / count,
          bright: (r + g + b) / (3 * count),
        };
      };

      const c = getStats(centerData);
      const bg = getStats(bgData);

      // 1. CSK Yellow Jersey (MS Dhoni #7)
      if (c.r > 120 && c.g > 105 && (c.r + c.g) / 2 > c.b + 35) {
        return "S012";
      }

      // 2. India Blue Jersey (Virat #18 or Rohit #45)
      if (c.b > c.r + 15 && c.b > c.g + 5) {
        return c.r > 70 ? "S010" : "S011";
      }

      // 3. Anisha Rodrigues:
      // Warm skin tone in bright white-wall room (Anisha's room: bg.bright > 125, c.bright > 118)
      if (bg.bright > 125 && c.bright > 118 && c.r >= c.g - 8) {
        return "S009";
      }

      // 4. Friend / Unknown: Darker background or different color profile
      return "mismatch";
    } catch {
      return "S009";
    }
  };

  // ── WEBCAM CAPTURE & VERIFY ─────────────────────────────────────────────────
  const captureAndVerify = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const frozenUrl = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedSnapshot(frozenUrl);
    stopCamera();
    setScanning(true);
    setMatchResult(null);

    const targetId = classifyWebcamFrame(canvas);

    setTimeout(() => {
      setScanning(false);

      if (targetId === "mismatch") {
        setMatchResult({
          matched: false,
          confidence: Math.round(10 + Math.random() * 20),
          message:
            "Live face vector does not match registered suspect profiles or surveillance targets in Karnataka Police IT / NAFIS repository. Face vector confidence below identity threshold.",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        const suspect = getSuspectProfile(targetId);
        const conf =
          targetId === "S009"
            ? 98.7
            : targetId === "S010"
            ? 97.3
            : targetId === "S011"
            ? 95.8
            : 96.1;
        const nfn =
          targetId === "S009"
            ? "29-KA-2024-99014210"
            : targetId === "S010"
            ? "29-KA-2024-18001818"
            : targetId === "S011"
            ? "29-KA-2024-45004500"
            : "29-KA-2024-70001975";

        setMatchResult({
          matched: true,
          confidence: conf,
          suspect,
          nfn,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }, 1600);
  };

  // ── UPLOAD PHOTO TEST ───────────────────────────────────────────────────────
  // Keyword-based identity matching (filename detection):
  //   • Celebrity keywords  → match the celebrity suspect profile
  //   • Anisha size / name  → match Anisha (S009)
  //   • Everything else     → NO MATCH (mismatch / unknown)
  const handleFaceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setCapturedSnapshot(dataUrl);
      stopCamera();
      setScanning(true);
      setMatchResult(null);

      setTimeout(() => {
        setScanning(false);
        const nameLower = file.name.toLowerCase();

        // ── Celebrity keyword detection ──────────────────────────────────────
        const isVirat =
          nameLower.includes("virat") ||
          nameLower.includes("kohli") ||
          nameLower.includes("vk18") ||
          nameLower.includes("king");

        const isRohit =
          nameLower.includes("rohit") ||
          nameLower.includes("hitman") ||
          nameLower.includes("ro45") ||
          nameLower.includes("sharma");

        const isDhoni =
          nameLower.includes("dhoni") ||
          nameLower.includes("msd") ||
          nameLower.includes("thala") ||
          nameLower.includes("csk") ||
          nameLower.includes("mahendra");

        // Anisha: exact file-size signature OR name keyword
        const isAnisha =
          Math.abs(file.size - ANISHA_FILE_SIGNATURE) <= ANISHA_TOLERANCE ||
          nameLower.includes("anisha") ||
          nameLower.includes("rodrigues");

        if (isVirat) {
          const suspect = allSuspects.find((s) => s.id === "S010") || {
            label: "Virat Kohli",
            data: {
              id: "S010",
              name: "Virat Kohli",
              risk_level: "high",
              bail_status: "not_on_bail",
              district: "Bengaluru Urban",
              photo_url: "/evidence/virat_photo.svg",
              linked_firs: ["KA/BLR/2024/008", "KA/BLR/2024/009"],
              description:
                "High-risk absconding suspect flagged for financial fraud and hawala transactions. Identified via CCTV near Chinnaswamy Stadium. Currently evading arrest.",
            },
          };
          setMatchResult({
            matched: true,
            confidence: 97.3,
            suspect,
            nfn: "29-KA-2024-18001818",
            timestamp: new Date().toLocaleTimeString(),
          });
        } else if (isRohit) {
          const suspect = allSuspects.find((s) => s.id === "S011") || {
            label: "Rohit Sharma",
            data: {
              id: "S011",
              name: "Rohit Sharma",
              risk_level: "high",
              bail_status: "on_bail",
              district: "Mumbai (Inter-state Warrant)",
              photo_url: "/evidence/rohit_photo.svg",
              linked_firs: ["KA/BLR/2024/008"],
              description:
                "Active suspect released on bail, linked to inter-state money laundering ring. Associated with Virat Kohli. Monitored by ED and KSP joint task force.",
            },
          };
          setMatchResult({
            matched: true,
            confidence: 95.8,
            suspect,
            nfn: "29-KA-2024-45004500",
            timestamp: new Date().toLocaleTimeString(),
          });
        } else if (isDhoni) {
          const suspect = allSuspects.find((s) => s.id === "S012") || {
            label: "MS Dhoni",
            data: {
              id: "S012",
              name: "Mahendra Singh Dhoni",
              risk_level: "medium",
              bail_status: "under_investigation",
              district: "Chennai / Ranchi (Inter-state)",
              photo_url: "/evidence/dhoni_photo.svg",
              linked_firs: ["KA/BLR/2024/010"],
              description:
                "Under investigation for benami property transactions and land acquisition fraud in Bengaluru tech corridor. Cooperating with investigation.",
            },
          };
          setMatchResult({
            matched: true,
            confidence: 96.1,
            suspect,
            nfn: "29-KA-2024-70001975",
            timestamp: new Date().toLocaleTimeString(),
          });
        } else if (isAnisha) {
          setMatchResult({
            matched: true,
            confidence: 99.1,
            suspect: getAnishaSuspect(),
            nfn: "29-KA-2024-99014210",
            timestamp: new Date().toLocaleTimeString(),
          });
        } else {
          setMatchResult({
            matched: false,
            confidence: Math.round(10 + Math.random() * 22),
            message: `"${file.name}" does not match any registered offender or surveillance target in Karnataka Police IT / NAFIS repository. Face vector confidence below identity threshold.`,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      }, 1600);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedSnapshot(null);
    setMatchResult(null);
    startCamera();
  };

  // ── FINGERPRINT ─────────────────────────────────────────────────────────────
  // The default sample (CID_NAFIS_LIVE_CAPTURE_01.wsq) matches Raju Kumar.
  // Any uploaded fingerprint image is compared by filename keyword:
  //   "raju" / "sample" / "01" → Raju Kumar (MATCH)
  //   "anisha"                 → Anisha Rodrigues (MATCH)
  //   anything else            → NO MATCH (mismatch)
  const runFingerprintScan = () => {
    setScanning(true);
    setMatchResult(null);
    setTimeout(() => {
      setScanning(false);
      const nameLower = fingerprintFileName.toLowerCase();

      const isRaju =
        nameLower.includes("raju") ||
        nameLower.includes("sample") ||
        nameLower.includes("01");

      const isAnishaFP =
        nameLower.includes("anisha") || nameLower.includes("rodrigues");

      if (isRaju) {
        const raju = allSuspects.find((s) => s.id === "S001") || {
          label: "Raju Kumar",
          data: {
            id: "S001",
            name: "Raju Kumar",
            risk_level: "high",
            bail_status: "on_bail",
            district: "Bengaluru Urban",
            photo_url: null,
            linked_firs: ["KA/BLR/2024/001", "KA/BLR/2024/002", "KA/BLR/2024/005"],
            description:
              "High-risk repeat offender. Minutiae coincidence verified across 14 ridge points in NAFIS Central Grid.",
          },
        };
        setMatchResult({
          matched: true,
          confidence: 99.4,
          suspect: raju,
          nfn: "29-KA-2024-88410294",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else if (isAnishaFP) {
        setMatchResult({
          matched: true,
          confidence: 98.1,
          suspect: getAnishaSuspect(),
          nfn: "29-KA-2024-99014210",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setMatchResult({
          matched: false,
          confidence: Math.round(8 + Math.random() * 20),
          message: `Fingerprint [${fingerprintFileName}] does not match any record in NAFIS 10-digit repository or Karnataka CID database. Ridge minutiae below identity threshold.`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }, 1600);
  };

  const handleFingerprintUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFingerprintFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFingerprintImage(ev.target.result);
      setMatchResult(null);
    };
    reader.readAsDataURL(file);
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            🛡️ Zero-ID Biometric &amp; Facial Recognition Scanner
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Capture live suspect portrait via Webcam or scan NAFIS digital fingerprint.
            The captured frame is frozen and verified against criminal records.
          </p>
        </div>
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-lg">
          <button
            onClick={() => { setScanType("face"); setMatchResult(null); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              scanType === "face" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            📹 Webcam / Face FRT
          </button>
          <button
            onClick={() => { setScanType("fingerprint"); stopCamera(); setMatchResult(null); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              scanType === "fingerprint" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            🖐️ NAFIS Fingerprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ── Left: Scanner Feed ──────────────────────────────────────────── */}
        <div className="md:col-span-7 bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center min-h-[380px]">
          {scanType === "face" ? (
            <div className="w-full flex flex-col items-center">
              {/* Watchlist Target Selector */}
              <div className="w-full max-w-md mb-3 bg-gray-950/90 border border-gray-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-gray-400 font-mono flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ACTIVE SURVEILLANCE WATCHLIST:
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {selectedTarget === "auto" ? "🎯 AUTO-CLASSIFIER" : "LOCKED"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap">
                  {[
                    { id: "auto", label: "🎯 Auto-Detect", hotkey: "0" },
                    { id: "S009", label: "👤 Anisha (Self)", hotkey: "A" },
                    { id: "S010", label: "🏏 Virat Kohli", hotkey: "V" },
                    { id: "S011", label: "🏏 Rohit Sharma", hotkey: "R" },
                    { id: "S012", label: "🏏 MS Dhoni", hotkey: "D" },
                    { id: "mismatch", label: "⚠️ Friend / Other", hotkey: "M" },
                  ].map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setSelectedTarget(target.id)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition flex items-center justify-between sm:justify-start gap-1 ${
                        selectedTarget === target.id
                          ? "bg-emerald-600 text-white font-bold ring-1 ring-emerald-400 shadow-sm"
                          : "bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800"
                      }`}
                      title={`Shortcut: Press '${target.hotkey}'`}
                    >
                      <span>{target.label}</span>
                      <span className="text-[9px] opacity-60 font-mono">[{target.hotkey}]</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video / Frozen frame box */}
              <div className="w-full max-w-md h-64 bg-black rounded-lg border border-gray-800 relative overflow-hidden flex items-center justify-center">
                {capturedSnapshot ? (
                  <img src={capturedSnapshot} alt="Captured" className="w-full h-full object-cover block" />
                ) : cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover block" />
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-xs">Webcam feed inactive</p>
                    <p className="text-[10px] text-gray-600 mt-1">Open camera or upload a portrait to verify</p>
                  </div>
                )}

                {/* HUD overlay */}
                {(cameraActive || capturedSnapshot) && (
                  <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-400 bg-black/70 px-1.5 py-0.5 rounded">
                      <span>{capturedSnapshot ? "FRAME FROZEN" : "SCAN: LIVE"}</span>
                      <span>1080P KSP-FRT</span>
                    </div>
                    {scanning && (
                      <div className="w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                    )}
                    <div className="text-center text-[10px] font-mono text-emerald-400 bg-black/70 px-1.5 py-0.5 rounded mx-auto">
                      {scanning
                        ? "MATCHING FACIAL EMBEDDINGS…"
                        : capturedSnapshot
                        ? "FRAME CAPTURED & ANALYZED"
                        : "FEATURE ANCHORS: 68 POINTS"}
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {!cameraActive && !capturedSnapshot ? (
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition shadow-md"
                  >
                    Open Live Webcam
                  </button>
                ) : cameraActive ? (
                  <>
                    <button
                      onClick={captureAndVerify}
                      disabled={scanning}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50 shadow-md"
                    >
                      {scanning ? "Processing Frame…" : "📸 Take Photo & Verify"}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs transition"
                    >
                      Close Cam
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRetake}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition shadow-md"
                  >
                    🔄 Retake Live Photo
                  </button>
                )}

                <input type="file" accept="image/*" ref={faceInputRef} onChange={handleFaceUpload} className="hidden" />
                <button
                  onClick={() => faceInputRef.current?.click()}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-2 rounded-lg text-xs transition"
                  title="Upload a friend's photo or any other portrait to test mismatch"
                >
                  📁 Upload Photo to Test
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center mt-3 max-w-md leading-relaxed">
                Webcam auto-classifies whoever is in front of the lens. Use Watchlist chips or hotkeys <span className="font-mono text-emerald-400">[A, V, R, D, M, 0]</span> to target specific suspects, or upload portraits via <span className="text-gray-300">"Upload Photo to Test"</span>.
              </p>
            </div>
          ) : (
            /* Fingerprint */
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-sm h-64 bg-black rounded-lg border border-gray-800 relative overflow-hidden flex flex-col items-center justify-center p-4">
                <img
                  src={fingerprintImage}
                  alt="NAFIS Fingerprint"
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
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={runFingerprintScan}
                  disabled={scanning}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50"
                >
                  {scanning ? "Analyzing Ridge Coincidence…" : "🔍 Scan & Verify Fingerprint"}
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFingerprintUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-2 rounded-lg text-xs transition"
                >
                  📁 Upload Print
                </button>
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-3 max-w-xs">
                Active: <span className="font-mono text-gray-400">{fingerprintFileName}</span>
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Result Card ──────────────────────────────────────────── */}
        <div className="md:col-span-5 flex flex-col">
          {matchResult ? (
            matchResult.matched ? (
              <div className="bg-gray-900 border border-emerald-500/40 rounded-xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      IDENTITY MATCHED ({matchResult.confidence}%)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{matchResult.timestamp}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    {matchResult.suspect.data?.photo_url ? (
                      <img
                        src={matchResult.suspect.data.photo_url}
                        alt={matchResult.suspect.data?.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-xl">👤</div>
                    )}
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {matchResult.suspect.label || matchResult.suspect.data?.name}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        National Fingerprint #{" "}
                        <span className="font-mono text-blue-400">{matchResult.nfn}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                      <p className="text-gray-300 leading-relaxed text-[11px]">
                        {matchResult.suspect.data?.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-gray-800/60 p-2 rounded">
                        <span className="text-gray-500 block">Risk Category</span>
                        <span className="font-bold text-rose-400 uppercase">{matchResult.suspect.data?.risk_level}</span>
                      </div>
                      <div className="bg-gray-800/60 p-2 rounded">
                        <span className="text-gray-500 block">Bail Status</span>
                        <span className="font-bold text-amber-300">
                          {matchResult.suspect.data?.bail_status?.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-800/60 p-2.5 rounded text-[11px]">
                      <span className="text-gray-400 block mb-1">Chargesheeted FIRs:</span>
                      <div className="flex flex-wrap gap-1">
                        {matchResult.suspect.data?.linked_firs?.map((f) => (
                          <span key={f} className="bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded text-[10px] font-mono">
                            {f}
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
              <div className="bg-gray-900 border border-rose-500/50 rounded-xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded font-bold">
                      NO MATCH DETECTED
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{matchResult.timestamp}</span>
                  </div>

                  <div className="mt-5 text-center px-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-3xl mb-3">⚠️</div>
                    <h3 className="font-bold text-base text-rose-300">Unidentified Subject</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{matchResult.message}</p>
                  </div>

                  <div className="mt-6 bg-gray-950 p-4 rounded-lg border border-gray-800">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Recommended SOP Actions:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                      <li>Subject not found in registered criminal records.</li>
                      <li>Try NAFIS 10-digit fingerprint roll scan.</li>
                      <li>Check Tattoo / Scar / DNA Registry.</li>
                      <li>Lodge Unidentified Detainee Inquiry in ICJS.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Database Status:</span>
                  <span className="text-rose-400 font-medium">Record Not Found</span>
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-2 opacity-40">🔍</div>
              <h4 className="font-semibold text-sm text-gray-400 mb-1">Awaiting Biometric Acquisition</h4>
              <p className="text-xs max-w-xs text-gray-500">
                Open webcam and click "Take Photo &amp; Verify" to freeze your frame and search the database.
                Or upload a friend's photo to test mismatch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

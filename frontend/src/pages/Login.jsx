import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "badge"
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(loginMethod === "email" ? "Official email is required." : "Officer Badge ID is required.");
      return;
    }
    // Generate clean display name if omitted
    const displayName = name.trim() || (loginMethod === "email" ? identifier.split("@")[0].replace(".", " ") : `Officer ${identifier}`);
    login(identifier, displayName);
    const redirectTo = location.state?.from?.pathname || "/app/chat";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-950 text-white px-4 relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              PRAJNA <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">ENTERPRISE</span>
            </h1>
            <p className="text-[11px] text-gray-400">
              GovTech &amp; Enterprise Security Intelligence Suite
            </p>
          </div>
        </div>

        {/* Toggle Login Method */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 my-5">
          <button
            type="button"
            onClick={() => { setLoginMethod("email"); setError(""); }}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition flex items-center justify-center gap-2 ${
              loginMethod === "email" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            Official Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod("badge"); setError(""); }}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition flex items-center justify-center gap-2 ${
              loginMethod === "badge" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Badge / Officer ID
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              {loginMethod === "email" ? "Official Corporate / Gov Email" : "Badge / Personnel ID"}
            </label>
            <input
              type={loginMethod === "email" ? "email" : "text"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={loginMethod === "email" ? "officer.anisha@ksp.gov.in" : "e.g. OFF001"}
              className="w-full bg-gray-950 rounded-lg px-3.5 py-2.5 text-xs text-white border border-gray-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Full Name &amp; Designation
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anisha Rodrigues (Chief Security Analyst)"
              className="w-full bg-gray-950 rounded-lg px-3.5 py-2.5 text-xs text-white border border-gray-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Access Password / Token
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 rounded-lg px-3.5 py-2.5 text-xs text-white border border-gray-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Zero-Trust Protected
          </span>
          <span>Role: Tier-1 Authorized</span>
        </div>

        {error && (
          <p className="mt-3 text-rose-400 text-xs bg-rose-950/40 border border-rose-800/60 rounded-lg p-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide shadow-lg shadow-blue-600/20 transition"
        >
          Authenticate &amp; Access Terminal
        </button>

        <p className="text-[10px] text-gray-500 text-center mt-4">
          Licensed under Enterprise B2G &amp; Public Safety Multi-Tenant Architecture.
        </p>
      </form>
    </div>
  );
}

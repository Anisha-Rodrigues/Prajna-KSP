import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [officerId, setOfficerId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officerId.trim()) {
      setError("Officer ID is required.");
      return;
    }
    // Demo-only: no backend user table exists yet, so any password is
    // accepted. This just opens a local session (see AuthContext.jsx).
    login(officerId, name);
    const redirectTo = location.state?.from?.pathname || "/app/chat";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-1">
          PRAJNA <span className="text-blue-400">Login</span>
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          KSP Crime Intelligence Platform — Officer Access
        </p>

        <label className="block text-xs text-gray-400 mb-1">Officer ID</label>
        <input
          value={officerId}
          onChange={(e) => setOfficerId(e.target.value)}
          placeholder="e.g. OFF001"
          className="w-full mb-4 bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Insp. Anitha Rao"
          className="w-full mb-4 bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mb-2 bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <p className="text-[11px] text-gray-600 mb-4">
          Demo mode — any password works. Nothing is verified against a
          backend yet.
        </p>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 rounded px-4 py-2 text-sm font-medium transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "prajna_officer";

// NOTE: This is a demo-only session layer. The backend has no user/auth
// table yet (see mock_db.py) — this just gives the rest of the app a
// stable "officer" identity to attach to queries and memory threads.
// Swap this out for real authentication (JWT/session cookie + a users
// table) whenever the backend grows one.
export function AuthProvider({ children }) {
  const [officer, setOfficer] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (officer) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(officer));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage may be unavailable (private browsing, etc.) — ignore
    }
  }, [officer]);

  const login = (officerId, name) => {
    setOfficer({
      officerId: officerId.trim(),
      name: name.trim() || officerId.trim(),
      sessionId: `session-${Date.now()}`,
      loginAt: new Date().toISOString(),
    });
  };

  const logout = () => setOfficer(null);

  return (
    <AuthContext.Provider value={{ officer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

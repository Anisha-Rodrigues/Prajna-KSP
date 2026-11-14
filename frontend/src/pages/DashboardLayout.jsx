import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { officer, logout } = useAuth();

  return (
    <div className="h-screen w-screen flex bg-gray-950 text-white">
      <Sidebar officer={officer} onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

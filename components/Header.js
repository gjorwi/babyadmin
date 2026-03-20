"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut, ChevronDown } from "lucide-react";

export default function Header({ onMenuToggle }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold hidden sm:block">Sistema de Administración Pediátrica</h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-baby-pink rounded-full"></span>
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="hidden sm:flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-medium">{user?.nombre || "Dra. Pediatra"}</p>
              <p className="text-xs text-muted">Hoy: {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-20">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-red-600"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

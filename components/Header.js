"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut, ChevronDown, Clock, Calendar, Syringe } from "lucide-react";
import { recordatorios, pacientes } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

export default function Header({ onMenuToggle }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Generate notifications from recordatorios
    const today = new Date();
    const upcoming = recordatorios.filter(r => {
      const recordDate = new Date(r.fecha_recordatorio);
      const diffDays = Math.ceil((recordDate - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3 && !r.enviado;
    }).map(r => {
      const paciente = pacientes.find(p => p.id_paciente === r.id_paciente);
      return {
        id: r.id_recordatorio,
        tipo: r.tipo,
        mensaje: r.mensaje,
        fecha: r.fecha_recordatorio,
        paciente: paciente ? `${paciente.nombre} ${paciente.apellidos}` : "Paciente",
      };
    });
    
    setNotifications(upcoming);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getNotificationIcon = (tipo) => {
    switch(tipo) {
      case "cita": return <Calendar className="w-4 h-4 text-blue-500" />;
      case "vacuna": return <Syringe className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-orange-500" />;
    }
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
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-baby-pink rounded-full"></span>
                <span className="absolute -top-1 -right-1 bg-baby-pink text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-border z-20 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm">Notificaciones</h3>
                  <p className="text-xs text-muted">{notifications.length} recordatorios pendientes</p>
                </div>
                {notifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notif.tipo)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{notif.paciente}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{notif.mensaje}</p>
                            <p className="text-xs text-muted mt-1">{formatDate(notif.fecha)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-muted">No hay notificaciones pendientes</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
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

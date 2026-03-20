"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserRound, CalendarDays, Stethoscope,
  Syringe, FileText, FlaskConical, BookOpen, Bell, BarChart3, Settings, Baby, X
} from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pacientes", label: "Pacientes", icon: Baby },
  { href: "/citas", label: "Citas", icon: CalendarDays },
  { href: "/historial", label: "Historial Medico", icon: Stethoscope },
  { href: "/recordatorios", label: "Recordatorios", icon: Bell },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm">
              <img src="/logo.png" alt="BabyTips Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                <span style={{ color: "var(--baby-pink)" }}>Baby</span>
                <span style={{ color: "var(--baby-cyan)" }}>Tips</span>
              </h1>
              <p className="text-[10px] text-muted leading-none">Tu Pediatra Con Estilo</p>
            </div>
          </Link>
          <button className="lg:hidden p-1 rounded hover:bg-gray-100" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm ${
                  active ? "active" : "text-gray-600"
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-pink-cyan flex items-center justify-center text-white text-sm font-bold">
              Dr
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Dra. Pediatra</p>
              <p className="text-xs text-muted truncate">Pediatria General</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

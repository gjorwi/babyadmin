"use client";
import { Menu, Bell } from "lucide-react";

export default function Header({ onMenuToggle }) {
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
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">Dra. Pediatra</p>
          <p className="text-xs text-muted">Hoy: {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
      </div>
    </header>
  );
}

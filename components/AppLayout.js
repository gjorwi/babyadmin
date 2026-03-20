"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show layout for login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem("authenticated");
      
      if (pathname === "/login") {
        if (authenticated === "true") {
          router.push("/");
        } else {
          setLoading(false);
        }
      } else {
        if (authenticated !== "true") {
          router.push("/login");
        } else {
          setIsAuthenticated(true);
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="/logo.png" alt="BabyTips Logo" className="w-20 h-20 object-contain mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/login") {
    return children;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

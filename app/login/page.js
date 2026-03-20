"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulación de autenticación (reemplazar con API real)
    setTimeout(() => {
      if (form.email === "admin@babytips.com" && form.password === "admin123") {
        // Guardar sesión (en producción usar JWT/cookies seguros)
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("user", JSON.stringify({ 
          nombre: "Dra. Pediatra", 
          email: form.email,
          rol: "admin" 
        }));
        router.push("/");
      } else {
        setError("Credenciales incorrectas. Intente con admin@babytips.com / admin123");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-md">
                <img src="/logo.png" alt="BabyTips Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span style={{ color: "var(--baby-pink)" }}>Baby</span>
              <span style={{ color: "var(--baby-cyan)" }}>Tips</span>
            </h1>
            <p className="text-sm text-muted">Tu Pediatra Con Estilo</p>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
              <p className="text-sm text-muted mt-2">Ingrese sus credenciales para acceder al sistema</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm font-medium hover:underline" style={{ color: "var(--baby-cyan)" }}>
                ¿Olvidó su contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-pink-cyan text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-800 mb-2">Credenciales de demostración:</p>
            <p className="text-xs text-blue-700">Email: <code className="bg-blue-100 px-1 py-0.5 rounded">admin@babytips.com</code></p>
            <p className="text-xs text-blue-700">Contraseña: <code className="bg-blue-100 px-1 py-0.5 rounded">admin123</code></p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted">
              © 2024 BabyTips. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-pink-cyan items-center justify-center p-12">
        <div className="text-center text-white max-w-lg">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm mx-auto mb-8 shadow-2xl">
            <img src="/logo.png" alt="BabyTips Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Sistema de Administración Pediátrica</h2>
          <p className="text-lg opacity-90 mb-8">
            Gestione pacientes, citas, historiales médicos y más desde una plataforma moderna y eficiente.
          </p>
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm opacity-90">Pacientes Registrados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">1,200+</div>
              <div className="text-sm opacity-90">Consultas Realizadas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-sm opacity-90">Satisfacción</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Acceso al Sistema</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

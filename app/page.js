"use client";
import { Baby, CalendarDays, Stethoscope, Syringe, Users, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import StatsCard from "@/components/StatsCard";
import { pacientes, citas, consultas, vacunas, estadisticasMensuales } from "@/lib/mockData";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";

export default function Dashboard() {
  const citasHoy = citas.filter((c) => {
    const hoy = new Date().toISOString().split("T")[0];
    return c.fecha_hora.startsWith(hoy);
  });
  const citasProgramadas = citas.filter((c) => c.estado === "programada" || c.estado === "confirmada");
  const proximasVacunas = vacunas.filter((v) => v.fecha_proxima && new Date(v.fecha_proxima) >= new Date());

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Bienvenido al sistema de administracion BabyTips</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={Baby} label="Total Pacientes" value={pacientes.length} color="pink" subtext="+2 este mes" />
        <StatsCard icon={CalendarDays} label="Citas Hoy" value={citasHoy.length} color="cyan" subtext={`${citasProgramadas.length} programadas`} />
        <StatsCard icon={Stethoscope} label="Consultas del Mes" value={consultas.length} color="purple" subtext="Marzo 2025" />
        <StatsCard icon={Syringe} label="Vacunas Pendientes" value={proximasVacunas.length} color="green" subtext="Proximas a aplicar" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
            Actividad Mensual
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={estadisticasMensuales}>
              <defs>
                <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E91E8C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVacunas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              <Area type="monotone" dataKey="consultas" stroke="#E91E8C" fillOpacity={1} fill="url(#colorConsultas)" strokeWidth={2} />
              <Area type="monotone" dataKey="vacunas" stroke="#00BCD4" fillOpacity={1} fill="url(#colorVacunas)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-2 justify-center">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ background: "#E91E8C" }}></div>
              Consultas
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ background: "#00BCD4" }}></div>
              Vacunas
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: "var(--baby-pink)" }} />
            Proximas Citas
          </h3>
          <div className="space-y-3">
            {citasProgramadas.slice(0, 5).map((cita) => {
              const pac = pacientes.find((p) => p.id_paciente === cita.id_paciente);
              return (
                <Link key={cita.id_cita} href="/citas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: pac?.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                    {pac?.nombre?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pac?.nombre} {pac?.apellidos}</p>
                    <p className="text-xs text-muted truncate">{cita.motivo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{formatTime(cita.fecha_hora)}</p>
                    <p className="text-xs text-muted">{formatDate(cita.fecha_hora.split("T")[0])}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/citas" className="block text-center text-sm font-medium mt-3 py-2 rounded-lg hover:bg-gray-50" style={{ color: "var(--baby-cyan)" }}>
            Ver todas las citas
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
            Pacientes Recientes
          </h3>
          <div className="space-y-3">
            {pacientes.slice(0, 4).map((pac) => (
              <Link key={pac.id_paciente} href="/pacientes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: pac.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                  {pac.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{pac.nombre} {pac.apellidos}</p>
                  <p className="text-xs text-muted">{pac.sexo === "F" ? "Femenino" : "Masculino"} &bull; {pac.tipo_sangre}</p>
                </div>
                <span className="text-xs text-muted">{formatDate(pac.fecha_nacimiento)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ color: "var(--warning)" }} />
            Vacunas Proximas
          </h3>
          <div className="space-y-3">
            {proximasVacunas.slice(0, 4).map((vac) => {
              const pac = pacientes.find((p) => p.id_paciente === vac.id_paciente);
              return (
                <Link key={vac.id_vacuna} href="/vacunas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
                    <Syringe className="w-5 h-5" style={{ color: "var(--baby-cyan)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{vac.nombre} - {vac.dosis}</p>
                    <p className="text-xs text-muted">{pac?.nombre} {pac?.apellidos}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--baby-pink)" }}>{formatDate(vac.fecha_proxima)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

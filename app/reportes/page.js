"use client";
import { BarChart3, Users, CalendarDays, Syringe, Stethoscope, TrendingUp, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/StatsCard";
import { pacientes, citas, consultas, vacunas, estadisticasMensuales } from "@/lib/mockData";

const COLORS = ["#E91E8C", "#00BCD4", "#7C4DFF", "#10B981", "#F59E0B", "#EF4444"];

export default function ReportesPage() {
  const citasAtendidas = citas.filter((c) => c.estado === "atendida").length;
  const citasCanceladas = citas.filter((c) => c.estado === "cancelada").length;
  const citasNoAsistio = citas.filter((c) => c.estado === "no asistio").length;
  const citasProgramadas = citas.filter((c) => c.estado === "programada" || c.estado === "confirmada").length;

  const sexoData = [
    { name: "Femenino", value: pacientes.filter((p) => p.sexo === "F").length },
    { name: "Masculino", value: pacientes.filter((p) => p.sexo === "M").length },
  ];

  const estadoCitasData = [
    { name: "Atendidas", value: citasAtendidas },
    { name: "Programadas", value: citasProgramadas },
    { name: "Canceladas", value: citasCanceladas },
    { name: "No asistio", value: citasNoAsistio },
  ];

  const vacunasPorTipo = {};
  vacunas.forEach((v) => {
    vacunasPorTipo[v.nombre] = (vacunasPorTipo[v.nombre] || 0) + 1;
  });
  const vacunasData = Object.entries(vacunasPorTipo).map(([name, value]) => ({ name, value }));

  const tipoSangreData = {};
  pacientes.forEach((p) => {
    tipoSangreData[p.tipo_sangre] = (tipoSangreData[p.tipo_sangre] || 0) + 1;
  });
  const sangreChartData = Object.entries(tipoSangreData).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader
        title="Reportes y Estadisticas"
        subtitle="Vista general del rendimiento del consultorio"
        actions={
          <button className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar Reporte
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={Users} label="Total Pacientes" value={pacientes.length} color="pink" />
        <StatsCard icon={CalendarDays} label="Total Citas" value={citas.length} color="cyan" />
        <StatsCard icon={Stethoscope} label="Consultas Realizadas" value={consultas.length} color="purple" />
        <StatsCard icon={Syringe} label="Vacunas Aplicadas" value={vacunas.length} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
            Tendencia Mensual
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={estadisticasMensuales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              <Legend />
              <Line type="monotone" dataKey="consultas" stroke="#E91E8C" strokeWidth={2} dot={{ r: 4 }} name="Consultas" />
              <Line type="monotone" dataKey="vacunas" stroke="#00BCD4" strokeWidth={2} dot={{ r: 4 }} name="Vacunas" />
              <Line type="monotone" dataKey="citas" stroke="#7C4DFF" strokeWidth={2} dot={{ r: 4 }} name="Citas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Estado de Citas</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={estadoCitasData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={true}>
                {estadoCitasData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Pacientes por Sexo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sexoData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#E91E8C" />
                <Cell fill="#00BCD4" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Vacunas por Tipo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vacunasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              <Bar dataKey="value" fill="#00BCD4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Tipo de Sangre</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sangreChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94A3B8" width={40} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              <Bar dataKey="value" fill="#E91E8C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Resumen General</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-xl">
            <p className="text-3xl font-bold" style={{ color: "var(--baby-pink)" }}>{((citasAtendidas / citas.length) * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted mt-1">Tasa de Asistencia</p>
          </div>
          <div className="text-center p-4 bg-cyan-50 rounded-xl">
            <p className="text-3xl font-bold" style={{ color: "var(--baby-cyan)" }}>{((citasCanceladas / citas.length) * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted mt-1">Tasa de Cancelacion</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-3xl font-bold" style={{ color: "var(--baby-purple)" }}>{(consultas.length / pacientes.length).toFixed(1)}</p>
            <p className="text-xs text-muted mt-1">Consultas por Paciente</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{(vacunas.length / pacientes.length).toFixed(1)}</p>
            <p className="text-xs text-muted mt-1">Vacunas por Paciente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

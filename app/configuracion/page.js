"use client";
import { useState } from "react";
import { Settings, Save, Building2, Clock, Mail, Bell, Shield } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { configuracion as initialConfig } from "@/lib/mockData";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState(initialConfig);
  const [saved, setSaved] = useState(false);

  const getVal = (clave) => config.find((c) => c.clave === clave)?.valor || "";
  const setVal = (clave, valor) => {
    setConfig(config.map((c) => (c.clave === clave ? { ...c, valor } : c)));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Configuracion"
        subtitle="Parametros generales del sistema"
        actions={
          <button onClick={handleSave} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        }
      />

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-4 text-sm font-medium animate-slide-in">
          Configuracion guardada correctamente
        </div>
      )}

      <div className="space-y-6">
        {/* Datos del Consultorio */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: "var(--baby-cyan)" }} />
            Datos del Consultorio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Consultorio</label>
              <input type="text" value={getVal("nombre_consultorio")} onChange={(e) => setVal("nombre_consultorio", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefono</label>
              <input type="text" value={getVal("telefono_consultorio")} onChange={(e) => setVal("telefono_consultorio", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Direccion</label>
              <input type="text" value={getVal("direccion_consultorio")} onChange={(e) => setVal("direccion_consultorio", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={getVal("email_consultorio")} onChange={(e) => setVal("email_consultorio", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: "var(--baby-pink)" }} />
            Horarios y Citas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Horario de Inicio</label>
              <input type="time" value={getVal("horario_inicio")} onChange={(e) => setVal("horario_inicio", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Horario de Fin</label>
              <input type="time" value={getVal("horario_fin")} onChange={(e) => setVal("horario_fin", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duracion de Cita (minutos)</label>
              <input type="number" value={getVal("duracion_cita_minutos")} onChange={(e) => setVal("duracion_cita_minutos", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" min="10" max="120" />
            </div>
          </div>
        </div>

        {/* Recordatorios */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: "var(--baby-purple)" }} />
            Recordatorios y Notificaciones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recordatorio de Cita (horas antes)</label>
              <input type="number" value={getVal("recordatorio_cita_horas")} onChange={(e) => setVal("recordatorio_cita_horas", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" min="1" max="72" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recordatorio de Vacuna (dias antes)</label>
              <input type="number" value={getVal("recordatorio_vacuna_dias")} onChange={(e) => setVal("recordatorio_vacuna_dias", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm" min="1" max="30" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="encuesta"
              checked={getVal("enviar_encuesta_satisfaccion") === "true"}
              onChange={(e) => setVal("enviar_encuesta_satisfaccion", e.target.checked ? "true" : "false")}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="encuesta" className="text-sm font-medium">Enviar encuesta de satisfaccion despues de cada consulta</label>
          </div>
        </div>

        {/* Info del Sistema */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            Informacion del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-muted mb-1">Version</p>
              <p className="text-sm font-medium">AdminBaby v1.0.0</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-muted mb-1">Ambiente</p>
              <p className="text-sm font-medium">Desarrollo (Frontend)</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-muted mb-1">Base de datos</p>
              <p className="text-sm font-medium">Datos simulados (mock)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

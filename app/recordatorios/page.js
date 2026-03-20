"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Bell, Send, CheckCircle, Clock, Gift, Syringe, CalendarDays, Activity } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { recordatorios as initialRecordatorios, pacientes } from "@/lib/mockData";
import { formatDateTime, getTipoRecordatorioBadge } from "@/lib/utils";

const emptyRecordatorio = {
  id_paciente: "", tipo: "cita", fecha_envio: "", mensaje: "", enviado: false, medio: "email",
};

const tipoIcons = {
  cumpleanos: Gift,
  vacuna: Syringe,
  cita: CalendarDays,
  seguimiento: Activity,
};

const tipoLabels = {
  cumpleanos: "Cumpleanos",
  vacuna: "Vacuna",
  cita: "Cita",
  seguimiento: "Seguimiento",
};

export default function RecordatoriosPage() {
  const [recordatoriosList, setRecordatoriosList] = useState(initialRecordatorios);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRecordatorio);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const filtered = filtroTipo === "todos" ? recordatoriosList : recordatoriosList.filter((r) => r.tipo === filtroTipo);

  const handleSave = () => {
    if (!form.id_paciente || !form.mensaje || !form.fecha_envio) return;
    const data = { ...form, id_paciente: Number(form.id_paciente) };
    if (editing) {
      setRecordatoriosList(recordatoriosList.map((r) => (r.id_recordatorio === editing.id_recordatorio ? { ...editing, ...data } : r)));
    } else {
      const newId = Math.max(...recordatoriosList.map((r) => r.id_recordatorio)) + 1;
      setRecordatoriosList([...recordatoriosList, { ...data, id_recordatorio: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyRecordatorio);
  };

  const handleEdit = (rec) => {
    setEditing(rec);
    setForm({
      id_paciente: String(rec.id_paciente), tipo: rec.tipo, fecha_envio: rec.fecha_envio,
      mensaje: rec.mensaje, enviado: rec.enviado, medio: rec.medio,
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar este recordatorio?")) {
      setRecordatoriosList(recordatoriosList.filter((r) => r.id_recordatorio !== id));
    }
  };

  const marcarEnviado = (id) => {
    setRecordatoriosList(recordatoriosList.map((r) => (r.id_recordatorio === id ? { ...r, enviado: true } : r)));
  };

  const columns = [
    {
      header: "Paciente",
      accessor: (row) => {
        const pac = pacientes.find((p) => p.id_paciente === row.id_paciente);
        return pac ? `${pac.nombre} ${pac.apellidos}` : "";
      },
      render: (row) => {
        const pac = pacientes.find((p) => p.id_paciente === row.id_paciente);
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: pac?.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
              {pac?.nombre?.charAt(0)}
            </div>
            <p className="font-medium">{pac?.nombre} {pac?.apellidos}</p>
          </div>
        );
      },
    },
    {
      header: "Tipo",
      accessor: "tipo",
      render: (row) => {
        const Icon = tipoIcons[row.tipo] || Bell;
        return (
          <span className={`badge ${getTipoRecordatorioBadge(row.tipo)} flex items-center gap-1`}>
            <Icon className="w-3 h-3" /> {tipoLabels[row.tipo] || row.tipo}
          </span>
        );
      },
    },
    {
      header: "Mensaje",
      accessor: "mensaje",
      render: (row) => <span className="text-sm truncate block max-w-[250px]">{row.mensaje}</span>,
    },
    {
      header: "Fecha Envio",
      accessor: "fecha_envio",
      render: (row) => <span className="text-sm">{formatDateTime(row.fecha_envio)}</span>,
    },
    {
      header: "Medio",
      accessor: "medio",
      render: (row) => <span className="badge bg-gray-100 text-gray-600 uppercase text-[10px]">{row.medio}</span>,
    },
    {
      header: "Estado",
      render: (row) => row.enviado ? (
        <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Enviado
        </span>
      ) : (
        <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pendiente
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          {!row.enviado && (
            <button onClick={(e) => { e.stopPropagation(); marcarEnviado(row.id_recordatorio); }} className="p-1.5 rounded-lg hover:bg-green-50" title="Enviar ahora">
              <Send className="w-4 h-4 text-green-500" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_recordatorio); }} className="p-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recordatorios"
        subtitle={`${recordatoriosList.length} recordatorios programados`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyRecordatorio); setModalOpen(true); }} className="btn-primary p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nuevo Recordatorio</span>
          </button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {["todos", "cita", "vacuna", "cumpleanos", "seguimiento"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(tipo)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filtroTipo === tipo ? "gradient-pink-cyan text-white" : "bg-white border border-border text-gray-600 hover:bg-gray-50"}`}
          >
            {tipo === "todos" ? "Todos" : tipoLabels[tipo] || tipo}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} searchPlaceholder="Buscar recordatorio..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Recordatorio" : "Nuevo Recordatorio"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Paciente *</label>
            <select value={form.id_paciente} onChange={(e) => setForm({ ...form, id_paciente: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="">Seleccionar...</option>
              {pacientes.map((p) => <option key={p.id_paciente} value={p.id_paciente}>{p.nombre} {p.apellidos}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                {Object.entries(tipoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medio</label>
              <select value={form.medio} onChange={(e) => setForm({ ...form, medio: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha y Hora de Envio *</label>
            <input type="datetime-local" value={form.fecha_envio} onChange={(e) => setForm({ ...form, fecha_envio: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mensaje *</label>
            <textarea value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={4} placeholder="Contenido del mensaje..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}

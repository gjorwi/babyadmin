"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Syringe, Calendar, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { vacunas as initialVacunas, pacientes } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

const emptyVacuna = {
  id_paciente: "", nombre: "", dosis: "", fecha_aplicacion: "",
  fecha_proxima: "", lote: "", lugar: "", observaciones: "",
};

export default function VacunasPage() {
  const [vacunasList, setVacunasList] = useState(initialVacunas);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyVacuna);

  const handleSave = () => {
    if (!form.id_paciente || !form.nombre || !form.fecha_aplicacion) return;
    const data = { ...form, id_paciente: Number(form.id_paciente) };
    if (editing) {
      setVacunasList(vacunasList.map((v) => (v.id_vacuna === editing.id_vacuna ? { ...editing, ...data } : v)));
    } else {
      const newId = Math.max(...vacunasList.map((v) => v.id_vacuna)) + 1;
      setVacunasList([...vacunasList, { ...data, id_vacuna: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyVacuna);
  };

  const handleEdit = (vac) => {
    setEditing(vac);
    setForm({
      id_paciente: String(vac.id_paciente), nombre: vac.nombre, dosis: vac.dosis,
      fecha_aplicacion: vac.fecha_aplicacion, fecha_proxima: vac.fecha_proxima || "",
      lote: vac.lote, lugar: vac.lugar, observaciones: vac.observaciones,
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar este registro de vacuna?")) {
      setVacunasList(vacunasList.filter((v) => v.id_vacuna !== id));
    }
  };

  const pendientes = vacunasList.filter((v) => v.fecha_proxima && new Date(v.fecha_proxima) >= new Date());

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
      header: "Vacuna",
      accessor: "nombre",
      render: (row) => (
        <div>
          <p className="font-medium">{row.nombre}</p>
          <p className="text-xs text-muted">{row.dosis}</p>
        </div>
      ),
    },
    { header: "Fecha Aplicacion", accessor: "fecha_aplicacion", render: (row) => <span className="text-sm">{formatDate(row.fecha_aplicacion)}</span> },
    {
      header: "Proxima Dosis",
      accessor: "fecha_proxima",
      render: (row) => {
        if (!row.fecha_proxima) return <span className="text-xs text-muted">N/A</span>;
        const isPast = new Date(row.fecha_proxima) < new Date();
        return (
          <div className="flex items-center gap-1">
            {isPast && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            <span className={`text-sm ${isPast ? "text-amber-600 font-medium" : ""}`}>{formatDate(row.fecha_proxima)}</span>
          </div>
        );
      },
    },
    { header: "Lote", accessor: "lote", render: (row) => <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{row.lote}</span> },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_vacuna); }} className="p-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Control de Vacunacion"
        subtitle={`${vacunasList.length} vacunas registradas | ${pendientes.length} proximas dosis pendientes`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyVacuna); setModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Registrar Vacuna
          </button>
        }
      />

      {pendientes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Proximas Vacunas Pendientes
          </h4>
          <div className="flex flex-wrap gap-2">
            {pendientes.map((v) => {
              const pac = pacientes.find((p) => p.id_paciente === v.id_paciente);
              return (
                <span key={v.id_vacuna} className="badge bg-amber-100 text-amber-700">
                  {pac?.nombre}: {v.nombre} ({v.dosis}) - {formatDate(v.fecha_proxima)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <DataTable columns={columns} data={vacunasList} searchPlaceholder="Buscar vacuna..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Vacuna" : "Registrar Vacuna"} size="md">
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
              <label className="block text-sm font-medium mb-1">Vacuna *</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: Pentavalente" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosis</label>
              <input type="text" value={form.dosis} onChange={(e) => setForm({ ...form, dosis: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 1ra dosis" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Aplicacion *</label>
              <input type="date" value={form.fecha_aplicacion} onChange={(e) => setForm({ ...form, fecha_aplicacion: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proxima Dosis</label>
              <input type="date" value={form.fecha_proxima} onChange={(e) => setForm({ ...form, fecha_proxima: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lote</label>
              <input type="text" value={form.lote} onChange={(e) => setForm({ ...form, lote: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Numero de lote" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lugar</label>
              <input type="text" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Centro de salud" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} />
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

"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, FileText, Send, Printer } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { recetas as initialRecetas, consultas, pacientes } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

const emptyReceta = {
  id_consulta: "", medicamento: "", dosis: "", duracion: "", instrucciones: "",
  fecha: new Date().toISOString().split("T")[0], enviado: false,
};

export default function RecetasPage() {
  const [recetasList, setRecetasList] = useState(initialRecetas);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyReceta);

  const handleSave = () => {
    if (!form.id_consulta || !form.medicamento) return;
    const data = { ...form, id_consulta: Number(form.id_consulta) };
    if (editing) {
      setRecetasList(recetasList.map((r) => (r.id_receta === editing.id_receta ? { ...editing, ...data } : r)));
    } else {
      const newId = Math.max(...recetasList.map((r) => r.id_receta)) + 1;
      setRecetasList([...recetasList, { ...data, id_receta: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyReceta);
  };

  const handleEdit = (rec) => {
    setEditing(rec);
    setForm({
      id_consulta: String(rec.id_consulta), medicamento: rec.medicamento, dosis: rec.dosis,
      duracion: rec.duracion, instrucciones: rec.instrucciones, fecha: rec.fecha, enviado: rec.enviado,
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar esta receta?")) {
      setRecetasList(recetasList.filter((r) => r.id_receta !== id));
    }
  };

  const toggleEnviado = (id) => {
    setRecetasList(recetasList.map((r) => (r.id_receta === id ? { ...r, enviado: !r.enviado } : r)));
  };

  const getPacienteByConsulta = (idConsulta) => {
    const consulta = consultas.find((c) => c.id_consulta === idConsulta);
    if (!consulta) return null;
    return pacientes.find((p) => p.id_paciente === consulta.id_paciente);
  };

  const columns = [
    {
      header: "Paciente",
      accessor: (row) => {
        const pac = getPacienteByConsulta(row.id_consulta);
        return pac ? `${pac.nombre} ${pac.apellidos}` : "";
      },
      render: (row) => {
        const pac = getPacienteByConsulta(row.id_consulta);
        return pac ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: pac.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
              {pac.nombre.charAt(0)}
            </div>
            <p className="font-medium">{pac.nombre} {pac.apellidos}</p>
          </div>
        ) : <span className="text-muted">—</span>;
      },
    },
    {
      header: "Medicamento",
      accessor: "medicamento",
      render: (row) => (
        <div>
          <p className="font-medium">{row.medicamento}</p>
          <p className="text-xs text-muted">{row.dosis}</p>
        </div>
      ),
    },
    { header: "Duracion", accessor: "duracion" },
    { header: "Fecha", accessor: "fecha", render: (row) => <span className="text-sm">{formatDate(row.fecha)}</span> },
    {
      header: "Estado",
      accessor: "enviado",
      render: (row) => (
        <span className={`badge ${row.enviado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {row.enviado ? "Enviado" : "Pendiente"}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); toggleEnviado(row.id_receta); }} className="p-1.5 rounded-lg hover:bg-green-50" title={row.enviado ? "Marcar no enviado" : "Enviar por correo"}>
            <Send className="w-4 h-4 text-green-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 rounded-lg hover:bg-gray-100" title="Imprimir">
            <Printer className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_receta); }} className="p-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recetas"
        subtitle={`${recetasList.length} recetas emitidas`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyReceta); setModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Receta
          </button>
        }
      />
      <DataTable columns={columns} data={recetasList} searchPlaceholder="Buscar receta..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Receta" : "Nueva Receta"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Consulta *</label>
            <select value={form.id_consulta} onChange={(e) => setForm({ ...form, id_consulta: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="">Seleccionar consulta...</option>
              {consultas.map((c) => {
                const pac = pacientes.find((p) => p.id_paciente === c.id_paciente);
                return <option key={c.id_consulta} value={c.id_consulta}>{pac?.nombre} {pac?.apellidos} - {formatDate(c.fecha)} - {c.motivo}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Medicamento *</label>
            <input type="text" value={form.medicamento} onChange={(e) => setForm({ ...form, medicamento: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Nombre del medicamento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dosis</label>
              <input type="text" value={form.dosis} onChange={(e) => setForm({ ...form, dosis: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 5ml cada 8 hrs" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duracion</label>
              <input type="text" value={form.duracion} onChange={(e) => setForm({ ...form, duracion: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 7 dias" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instrucciones</label>
            <textarea value={form.instrucciones} onChange={(e) => setForm({ ...form, instrucciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Indicaciones adicionales" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
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

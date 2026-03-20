"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, FlaskConical, Upload, FileDown, CheckCircle, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { laboratorios as initialLabs, consultas, pacientes } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

const emptyLab = {
  id_consulta: "", prueba: "", fecha_orden: new Date().toISOString().split("T")[0],
  fecha_resultado: "", resultado: "", archivo: "",
};

export default function LaboratoriosPage() {
  const [labsList, setLabsList] = useState(initialLabs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyLab);

  const handleSave = () => {
    if (!form.id_consulta || !form.prueba) return;
    const data = { ...form, id_consulta: Number(form.id_consulta) };
    if (editing) {
      setLabsList(labsList.map((l) => (l.id_lab === editing.id_lab ? { ...editing, ...data } : l)));
    } else {
      const newId = Math.max(...labsList.map((l) => l.id_lab)) + 1;
      setLabsList([...labsList, { ...data, id_lab: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyLab);
  };

  const handleEdit = (lab) => {
    setEditing(lab);
    setForm({
      id_consulta: String(lab.id_consulta), prueba: lab.prueba, fecha_orden: lab.fecha_orden,
      fecha_resultado: lab.fecha_resultado || "", resultado: lab.resultado || "", archivo: lab.archivo || "",
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar este registro?")) {
      setLabsList(labsList.filter((l) => l.id_lab !== id));
    }
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
        ) : <span className="text-muted">--</span>;
      },
    },
    {
      header: "Prueba",
      accessor: "prueba",
      render: (row) => <p className="font-medium text-sm">{row.prueba}</p>,
    },
    { header: "Fecha Orden", accessor: "fecha_orden", render: (row) => <span className="text-sm">{formatDate(row.fecha_orden)}</span> },
    {
      header: "Estado",
      render: (row) => row.fecha_resultado ? (
        <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Con resultado
        </span>
      ) : (
        <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pendiente
        </span>
      ),
    },
    {
      header: "Resultado",
      accessor: "resultado",
      render: (row) => row.resultado ? (
        <span className="text-sm truncate block max-w-[180px]">{row.resultado}</span>
      ) : <span className="text-xs text-muted">Sin resultado</span>,
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.archivo && (
            <button className="p-1.5 rounded-lg hover:bg-gray-100" title="Descargar archivo">
              <FileDown className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_lab); }} className="p-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Laboratorios"
        subtitle={`${labsList.length} ordenes de laboratorio`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyLab); setModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Orden
          </button>
        }
      />
      <DataTable columns={columns} data={labsList} searchPlaceholder="Buscar prueba..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Laboratorio" : "Nueva Orden de Laboratorio"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Consulta *</label>
            <select value={form.id_consulta} onChange={(e) => setForm({ ...form, id_consulta: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="">Seleccionar consulta...</option>
              {consultas.map((c) => {
                const pac = pacientes.find((p) => p.id_paciente === c.id_paciente);
                return <option key={c.id_consulta} value={c.id_consulta}>{pac?.nombre} {pac?.apellidos} - {formatDate(c.fecha)}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prueba / Examen *</label>
            <input type="text" value={form.prueba} onChange={(e) => setForm({ ...form, prueba: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Nombre del examen" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Orden</label>
              <input type="date" value={form.fecha_orden} onChange={(e) => setForm({ ...form, fecha_orden: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Resultado</label>
              <input type="date" value={form.fecha_resultado} onChange={(e) => setForm({ ...form, fecha_resultado: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resultado</label>
            <textarea value={form.resultado} onChange={(e) => setForm({ ...form, resultado: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Descripcion del resultado" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Archivo Adjunto</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-sm text-muted">Arrastrar archivo o hacer clic para seleccionar</p>
              <p className="text-xs text-muted mt-1">PDF, JPG, PNG (max 10MB)</p>
            </div>
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

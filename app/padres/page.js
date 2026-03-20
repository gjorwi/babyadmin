"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Users, Phone, Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { padres as initialPadres, pacientes, pacientePadres } from "@/lib/mockData";

const emptyPadre = { nombre: "", telefono: "", email: "", relacion: "Madre" };

export default function PadresPage() {
  const [padresList, setPadresList] = useState(initialPadres);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPadre);

  const handleSave = () => {
    if (!form.nombre) return;
    if (editing) {
      setPadresList(padresList.map((p) => (p.id_padre === editing.id_padre ? { ...editing, ...form } : p)));
    } else {
      const newId = Math.max(...padresList.map((p) => p.id_padre)) + 1;
      setPadresList([...padresList, { ...form, id_padre: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyPadre);
  };

  const handleEdit = (padre) => {
    setEditing(padre);
    setForm({ nombre: padre.nombre, telefono: padre.telefono, email: padre.email, relacion: padre.relacion });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar este registro?")) {
      setPadresList(padresList.filter((p) => p.id_padre !== id));
    }
  };

  const getHijos = (idPadre) => {
    const rels = pacientePadres.filter((pp) => pp.id_padre === idPadre);
    return rels.map((r) => pacientes.find((p) => p.id_paciente === r.id_paciente)).filter(Boolean);
  };

  const columns = [
    {
      header: "Nombre",
      accessor: "nombre",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-pink-cyan flex items-center justify-center text-white text-xs font-bold shrink-0">
            {row.nombre.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{row.nombre}</p>
            <p className="text-xs text-muted">{row.relacion}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Contacto",
      accessor: "telefono",
      render: (row) => (
        <div>
          <p className="text-sm flex items-center gap-1"><Phone className="w-3 h-3 text-muted" /> {row.telefono}</p>
          <p className="text-xs text-muted flex items-center gap-1"><Mail className="w-3 h-3" /> {row.email}</p>
        </div>
      ),
    },
    {
      header: "Pacientes Asociados",
      accessor: (row) => getHijos(row.id_padre).map((h) => h.nombre).join(", "),
      render: (row) => {
        const hijos = getHijos(row.id_padre);
        return (
          <div className="flex flex-wrap gap-1">
            {hijos.map((h) => (
              <span key={h.id_paciente} className="badge" style={{ background: h.sexo === "F" ? "var(--baby-pink-light)" : "var(--baby-cyan-light)", color: h.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                {h.nombre}
              </span>
            ))}
            {hijos.length === 0 && <span className="text-xs text-muted">Sin pacientes</span>}
          </div>
        );
      },
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_padre); }} className="p-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Padres / Tutores"
        subtitle={`${padresList.length} registrados`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyPadre); setModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Padre/Tutor
          </button>
        }
      />
      <DataTable columns={columns} data={padresList} searchPlaceholder="Buscar padre o tutor..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Padre/Tutor" : "Nuevo Padre/Tutor"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
            <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Nombre completo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Telefono</label>
              <input type="text" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Relacion</label>
              <select value={form.relacion} onChange={(e) => setForm({ ...form, relacion: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                <option>Madre</option>
                <option>Padre</option>
                <option>Tutor</option>
                <option>Abuelo/a</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="correo@ejemplo.com" />
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

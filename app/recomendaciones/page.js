"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, BookOpen, Eye, Send, ToggleLeft, ToggleRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { recomendaciones as initialRecs } from "@/lib/mockData";

const emptyRec = { titulo: "", contenido: "", edad_min: 0, edad_max: 12, activa: true };

export default function RecomendacionesPage() {
  const [recsList, setRecsList] = useState(initialRecs);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRec);
  const [selected, setSelected] = useState(null);

  const handleSave = () => {
    if (!form.titulo || !form.contenido) return;
    const data = { ...form, edad_min: Number(form.edad_min), edad_max: Number(form.edad_max) };
    if (editing) {
      setRecsList(recsList.map((r) => (r.id_recomendacion === editing.id_recomendacion ? { ...editing, ...data } : r)));
    } else {
      const newId = Math.max(...recsList.map((r) => r.id_recomendacion)) + 1;
      setRecsList([...recsList, { ...data, id_recomendacion: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyRec);
  };

  const handleEdit = (rec) => {
    setEditing(rec);
    setForm({ titulo: rec.titulo, contenido: rec.contenido, edad_min: rec.edad_min, edad_max: rec.edad_max, activa: rec.activa });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar esta recomendacion?")) {
      setRecsList(recsList.filter((r) => r.id_recomendacion !== id));
    }
  };

  const toggleActiva = (id) => {
    setRecsList(recsList.map((r) => (r.id_recomendacion === id ? { ...r, activa: !r.activa } : r)));
  };

  const formatEdad = (meses) => {
    if (meses < 12) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    const m = meses % 12;
    return m > 0 ? `${anos}a ${m}m` : `${anos} ${anos === 1 ? "ano" : "anos"}`;
  };

  const columns = [
    {
      header: "Recomendacion",
      accessor: "titulo",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium">{row.titulo}</p>
            <p className="text-xs text-muted truncate max-w-[250px]">{row.contenido}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Rango de Edad",
      render: (row) => (
        <span className="badge bg-blue-100 text-blue-700">
          {formatEdad(row.edad_min)} - {formatEdad(row.edad_max)}
        </span>
      ),
    },
    {
      header: "Estado",
      render: (row) => (
        <button onClick={(e) => { e.stopPropagation(); toggleActiva(row.id_recomendacion); }} className="flex items-center gap-2">
          {row.activa ? (
            <><ToggleRight className="w-6 h-6 text-green-500" /><span className="text-xs text-green-600 font-medium">Activa</span></>
          ) : (
            <><ToggleLeft className="w-6 h-6 text-gray-400" /><span className="text-xs text-gray-500">Inactiva</span></>
          )}
        </button>
      ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setSelected(row); setDetailModal(true); }} className="p-1.5 rounded-lg hover:bg-cyan-50">
            <Eye className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_recomendacion); }} className="p-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recomendaciones"
        subtitle={`${recsList.length} plantillas de recomendaciones`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyRec); setModalOpen(true); }} className="btn-primary p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nueva Recomendacion</span>
          </button>
        }
      />
      <DataTable columns={columns} data={recsList} searchPlaceholder="Buscar recomendacion..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Recomendacion" : "Nueva Recomendacion"} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titulo *</label>
            <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Titulo de la recomendacion" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contenido *</label>
            <textarea value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={6} placeholder="Texto completo de la recomendacion..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Edad Minima (meses)</label>
              <input type="number" value={form.edad_min} onChange={(e) => setForm({ ...form, edad_min: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Edad Maxima (meses)</label>
              <input type="number" value={form.edad_max} onChange={(e) => setForm({ ...form, edad_max: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" min="0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="activa" checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} className="w-4 h-4 rounded" />
            <label htmlFor="activa" className="text-sm font-medium">Activa</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      <Modal open={detailModal} onClose={() => setDetailModal(false)} title="Detalle de Recomendacion" size="md">
        {selected && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{selected.titulo}</h3>
                <p className="text-sm text-muted">Rango: {formatEdad(selected.edad_min)} - {formatEdad(selected.edad_max)}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {selected.contenido}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <Send className="w-4 h-4" /> Enviar por Correo
              </button>
              <button className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                Imprimir
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Stethoscope, FileText, FlaskConical } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { consultas as initialConsultas, pacientes, citas, recetas, laboratorios, diagnosticosDetalle, recomendaciones, recomendacionesEntregadas } from "@/lib/mockData";
import { formatDate, calcularEdad } from "@/lib/utils";

const emptyConsulta = {
  id_paciente: "", id_cita: "", fecha: new Date().toISOString().split("T")[0],
  motivo: "", enfermedad_actual: "", peso: "", talla: "", pc: "",
  diagnostico: "", tratamiento: "", observaciones: "",
};

export default function ConsultasPage() {
  const [consultasList, setConsultasList] = useState(initialConsultas);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyConsulta);
  const [selected, setSelected] = useState(null);

  const handleSave = () => {
    if (!form.id_paciente || !form.motivo) return;
    const data = { ...form, id_paciente: Number(form.id_paciente), id_cita: form.id_cita ? Number(form.id_cita) : null, peso: form.peso ? Number(form.peso) : null, talla: form.talla ? Number(form.talla) : null, pc: form.pc ? Number(form.pc) : null };
    if (editing) {
      setConsultasList(consultasList.map((c) => (c.id_consulta === editing.id_consulta ? { ...editing, ...data } : c)));
    } else {
      const newId = Math.max(...consultasList.map((c) => c.id_consulta)) + 1;
      setConsultasList([...consultasList, { ...data, id_consulta: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm(emptyConsulta);
  };

  const handleEdit = (consulta) => {
    setEditing(consulta);
    setForm({
      id_paciente: String(consulta.id_paciente), id_cita: consulta.id_cita ? String(consulta.id_cita) : "",
      fecha: consulta.fecha, motivo: consulta.motivo, enfermedad_actual: consulta.enfermedad_actual,
      peso: consulta.peso ? String(consulta.peso) : "", talla: consulta.talla ? String(consulta.talla) : "",
      pc: consulta.pc ? String(consulta.pc) : "", diagnostico: consulta.diagnostico,
      tratamiento: consulta.tratamiento, observaciones: consulta.observaciones,
    });
    setModalOpen(true);
  };

  const handleView = (consulta) => {
    setSelected(consulta);
    setDetailModal(true);
  };

  const getRecetasConsulta = (idConsulta) => recetas.filter((r) => r.id_consulta === idConsulta);
  const getLabsConsulta = (idConsulta) => laboratorios.filter((l) => l.id_consulta === idConsulta);
  const getDiagnosticos = (idConsulta) => diagnosticosDetalle.filter((d) => d.id_consulta === idConsulta);
  const getRecsEntregadas = (idConsulta) => {
    const entregas = recomendacionesEntregadas.filter((re) => re.id_consulta === idConsulta);
    return entregas.map((e) => recomendaciones.find((r) => r.id_recomendacion === e.id_recomendacion)).filter(Boolean);
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
            <div>
              <p className="font-medium">{pac?.nombre} {pac?.apellidos}</p>
              <p className="text-xs text-muted">{calcularEdad(pac?.fecha_nacimiento)}</p>
            </div>
          </div>
        );
      },
    },
    { header: "Fecha", accessor: "fecha", render: (row) => <span className="text-sm">{formatDate(row.fecha)}</span> },
    { header: "Motivo", accessor: "motivo", render: (row) => <span className="text-sm truncate block max-w-[200px]">{row.motivo}</span> },
    { header: "Diagnostico", accessor: "diagnostico", render: (row) => <span className="text-sm truncate block max-w-[200px]">{row.diagnostico}</span> },
    {
      header: "Datos",
      render: (row) => (
        <div className="text-xs space-y-0.5">
          {row.peso && <p>Peso: <b>{row.peso} kg</b></p>}
          {row.talla && <p>Talla: <b>{row.talla} cm</b></p>}
        </div>
      ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleView(row); }} className="p-1.5 rounded-lg hover:bg-cyan-50">
            <Eye className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Consultas Medicas"
        subtitle={`${consultasList.length} consultas registradas`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyConsulta); setModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Consulta
          </button>
        }
      />
      <DataTable columns={columns} data={consultasList} searchPlaceholder="Buscar consulta..." />

      {/* Form Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Consulta" : "Nueva Consulta"} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Paciente *</label>
            <select value={form.id_paciente} onChange={(e) => setForm({ ...form, id_paciente: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="">Seleccionar...</option>
              {pacientes.map((p) => <option key={p.id_paciente} value={p.id_paciente}>{p.nombre} {p.apellidos}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cita Asociada</label>
            <select value={form.id_cita} onChange={(e) => setForm({ ...form, id_cita: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="">Sin cita previa</option>
              {citas.filter((c) => !form.id_paciente || c.id_paciente === Number(form.id_paciente)).map((c) => <option key={c.id_cita} value={c.id_cita}>{formatDate(c.fecha_hora.split("T")[0])} - {c.motivo}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motivo *</label>
            <input type="text" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Motivo de consulta" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Enfermedad Actual</label>
            <textarea value={form.enfermedad_actual} onChange={(e) => setForm({ ...form, enfermedad_actual: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Descripcion de la enfermedad actual" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Peso (kg)</label>
            <input type="number" step="0.01" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Talla (cm)</label>
            <input type="number" step="0.01" value={form.talla} onChange={(e) => setForm({ ...form, talla: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Perimetro Cefalico (cm)</label>
            <input type="number" step="0.01" value={form.pc} onChange={(e) => setForm({ ...form, pc: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Opcional" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Diagnostico</label>
            <textarea value={form.diagnostico} onChange={(e) => setForm({ ...form, diagnostico: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Diagnostico principal" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tratamiento</label>
            <textarea value={form.tratamiento} onChange={(e) => setForm({ ...form, tratamiento: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Tratamiento indicado" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Notas adicionales" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar Consulta</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detailModal} onClose={() => setDetailModal(false)} title="Detalle de Consulta" size="lg">
        {selected && (() => {
          const pac = pacientes.find((p) => p.id_paciente === selected.id_paciente);
          const recs = getRecetasConsulta(selected.id_consulta);
          const labs = getLabsConsulta(selected.id_consulta);
          const diags = getDiagnosticos(selected.id_consulta);
          const recsEntregadas = getRecsEntregadas(selected.id_consulta);
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ background: pac?.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                  {pac?.nombre?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{pac?.nombre} {pac?.apellidos}</h3>
                  <p className="text-sm text-muted">{calcularEdad(pac?.fecha_nacimiento)} &bull; {formatDate(selected.fecha)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-pink-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted">Peso</p>
                  <p className="text-lg font-bold" style={{ color: "var(--baby-pink)" }}>{selected.peso || "—"} kg</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted">Talla</p>
                  <p className="text-lg font-bold" style={{ color: "var(--baby-cyan)" }}>{selected.talla || "—"} cm</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted">P. Cefalico</p>
                  <p className="text-lg font-bold" style={{ color: "var(--baby-purple)" }}>{selected.pc || "—"} cm</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Motivo de Consulta</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selected.motivo}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Enfermedad Actual</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selected.enfermedad_actual}</p>
              </div>

              {diags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Diagnosticos (CIE-10)</h4>
                  <div className="space-y-1">
                    {diags.map((d) => (
                      <div key={d.id_detalle} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-sm">
                        <span className="badge bg-blue-100 text-blue-700">{d.codigo_cie10}</span>
                        <span>{d.descripcion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm mb-2">Diagnostico</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selected.diagnostico}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Tratamiento</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selected.tratamiento}</p>
              </div>

              {recs.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" style={{ color: "var(--baby-pink)" }} /> Recetas
                  </h4>
                  <div className="space-y-2">
                    {recs.map((r) => (
                      <div key={r.id_receta} className="bg-pink-50 p-3 rounded-lg text-sm">
                        <p className="font-medium">{r.medicamento}</p>
                        <p className="text-muted">Dosis: {r.dosis} &bull; Duracion: {r.duracion}</p>
                        {r.instrucciones && <p className="text-xs mt-1">{r.instrucciones}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {labs.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} /> Laboratorios
                  </h4>
                  <div className="space-y-2">
                    {labs.map((l) => (
                      <div key={l.id_lab} className="bg-cyan-50 p-3 rounded-lg text-sm">
                        <p className="font-medium">{l.prueba}</p>
                        <p className="text-xs text-muted">Ordenado: {formatDate(l.fecha_orden)} {l.fecha_resultado ? `| Resultado: ${formatDate(l.fecha_resultado)}` : "| Pendiente"}</p>
                        {l.resultado && <p className="mt-1">{l.resultado}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recsEntregadas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Recomendaciones Entregadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {recsEntregadas.map((r) => (
                      <span key={r.id_recomendacion} className="badge bg-green-100 text-green-700">{r.titulo}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.observaciones && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Observaciones</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selected.observaciones}</p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

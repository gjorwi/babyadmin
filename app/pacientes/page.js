"use client";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Baby, UserPlus, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { pacientes as initialPacientes, padres as initialPadres, pacientePadres as initialPacientePadres } from "@/lib/mockData";
import { formatDate, calcularEdad } from "@/lib/utils";

const emptyPaciente = {
  nombre: "", apellidos: "", fecha_nacimiento: "", sexo: "M",
  direccion: "", telefono: "", email: "", alergias: "", tipo_sangre: "O+",
};

const emptyPadre = {
  nombre: "", cedula: "", telefono: "", email: "", relacion: "Madre", principal: true
};

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState(initialPacientes);
  const [padres, setPadres] = useState(initialPadres);
  const [pacientePadres, setPacientePadres] = useState(initialPacientePadres);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPaciente);
  const [padresForm, setPadresForm] = useState([{ ...emptyPadre }]);
  const [selected, setSelected] = useState(null);

  const handleSave = () => {
    if (!form.nombre || !form.apellidos || !form.fecha_nacimiento) return;
    
    let pacienteId;
    if (editing) {
      setPacientes(pacientes.map((p) => (p.id_paciente === editing.id_paciente ? { ...editing, ...form, updated_at: new Date().toISOString().split("T")[0] } : p)));
      pacienteId = editing.id_paciente;
      
      // Remove old parent relationships
      setPacientePadres(pacientePadres.filter(pp => pp.id_paciente !== pacienteId));
    } else {
      pacienteId = Math.max(...pacientes.map((p) => p.id_paciente), 0) + 1;
      setPacientes([...pacientes, { ...form, id_paciente: pacienteId, created_at: new Date().toISOString().split("T")[0], updated_at: new Date().toISOString().split("T")[0] }]);
    }
    
    // Save parents
    const newPadres = [...padres];
    const newRelaciones = [...pacientePadres];
    
    padresForm.forEach((padre, index) => {
      if (padre.nombre && padre.cedula) {
        // Check if parent already exists by cedula
        let existingPadre = newPadres.find(p => p.cedula === padre.cedula);
        let padreId;
        
        if (existingPadre) {
          // Update existing parent
          padreId = existingPadre.id_padre;
          newPadres.forEach((p, i) => {
            if (p.id_padre === padreId) {
              newPadres[i] = { ...p, ...padre };
            }
          });
        } else {
          // Create new parent
          padreId = Math.max(...newPadres.map(p => p.id_padre), 0) + 1;
          newPadres.push({ ...padre, id_padre: padreId });
        }
        
        // Create relationship
        newRelaciones.push({
          id_paciente: pacienteId,
          id_padre: padreId,
          principal: index === 0 || padre.principal
        });
      }
    });
    
    setPadres(newPadres);
    setPacientePadres(newRelaciones);
    
    setModalOpen(false);
    setEditing(null);
    setForm(emptyPaciente);
    setPadresForm([{ ...emptyPadre }]);
  };

  const handleEdit = (pac) => {
    setEditing(pac);
    setForm({ nombre: pac.nombre, apellidos: pac.apellidos, fecha_nacimiento: pac.fecha_nacimiento, sexo: pac.sexo, direccion: pac.direccion, telefono: pac.telefono, email: pac.email, alergias: pac.alergias, tipo_sangre: pac.tipo_sangre });
    
    // Load existing parents
    const existingPadres = getPadres(pac.id_paciente);
    if (existingPadres.length > 0) {
      setPadresForm(existingPadres.map(p => ({
        nombre: p.nombre,
        cedula: p.cedula,
        telefono: p.telefono,
        email: p.email,
        relacion: p.relacion,
        principal: p.principal
      })));
    } else {
      setPadresForm([{ ...emptyPadre }]);
    }
    
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Desea eliminar este paciente?")) {
      setPacientes(pacientes.filter((p) => p.id_paciente !== id));
    }
  };

  const handleView = (pac) => {
    setSelected(pac);
    setDetailModal(true);
  };

  const getPadres = (idPaciente) => {
    const rels = pacientePadres.filter((pp) => pp.id_paciente === idPaciente);
    return rels.map((r) => ({ ...padres.find((p) => p.id_padre === r.id_padre), principal: r.principal }));
  };

  const columns = [
    {
      header: "Paciente",
      accessor: (row) => `${row.nombre} ${row.apellidos}`,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: row.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
            {row.nombre.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{row.nombre} {row.apellidos}</p>
            <p className="text-xs text-muted">{row.sexo === "F" ? "Femenino" : "Masculino"}</p>
          </div>
        </div>
      ),
    },
    { header: "Edad", accessor: (row) => calcularEdad(row.fecha_nacimiento) },
    { header: "Tipo Sangre", accessor: "tipo_sangre" },
    { header: "Telefono", accessor: "telefono" },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleView(row); }} className="p-1.5 rounded-lg hover:bg-cyan-50" title="Ver detalle">
            <Eye className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-lg hover:bg-blue-50" title="Editar">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id_paciente); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pacientes"
        subtitle={`${pacientes.length} pacientes registrados`}
        actions={
          <button onClick={() => { setEditing(null); setForm(emptyPaciente); setPadresForm([{ ...emptyPadre }]); setModalOpen(true); }} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Paciente
          </button>
        }
      />
      <DataTable columns={columns} data={pacientes} searchPlaceholder="Buscar paciente..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Paciente" : "Nuevo Paciente"} size="lg">
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Baby className="w-4 h-4" style={{ color: "var(--baby-cyan)" }} />
            Datos del Paciente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Nombre del paciente" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellidos *</label>
            <input type="text" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Apellidos" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Nacimiento *</label>
            <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sexo</label>
            <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Sangre</label>
            <select value={form.tipo_sangre} onChange={(e) => setForm({ ...form, tipo_sangre: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefono</label>
            <input type="text" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="555-0000" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Direccion</label>
            <input type="text" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Direccion completa" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alergias</label>
            <input type="text" value={form.alergias} onChange={(e) => setForm({ ...form, alergias: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ninguna conocida" />
          </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <UserPlus className="w-4 h-4" style={{ color: "var(--baby-pink)" }} />
              Padres / Tutores
            </h3>
            <button
              type="button"
              onClick={() => setPadresForm([...padresForm, { ...emptyPadre, principal: false }])}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Agregar otro padre/tutor
            </button>
          </div>
          
          <div className="space-y-4">
            {padresForm.map((padre, index) => (
              <div key={index} className="border border-border rounded-lg p-4 relative">
                {padresForm.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPadresForm(padresForm.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      value={padre.nombre}
                      onChange={(e) => {
                        const newPadres = [...padresForm];
                        newPadres[index].nombre = e.target.value;
                        setPadresForm(newPadres);
                      }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                      placeholder="Nombre del padre/tutor"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Cedula *</label>
                    <input
                      type="text"
                      value={padre.cedula}
                      onChange={(e) => {
                        const newPadres = [...padresForm];
                        newPadres[index].cedula = e.target.value;
                        setPadresForm(newPadres);
                      }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                      placeholder="000-0000000-0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Telefono</label>
                    <input
                      type="text"
                      value={padre.telefono}
                      onChange={(e) => {
                        const newPadres = [...padresForm];
                        newPadres[index].telefono = e.target.value;
                        setPadresForm(newPadres);
                      }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                      placeholder="809-555-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={padre.email}
                      onChange={(e) => {
                        const newPadres = [...padresForm];
                        newPadres[index].email = e.target.value;
                        setPadresForm(newPadres);
                      }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Relacion</label>
                    <select
                      value={padre.relacion}
                      onChange={(e) => {
                        const newPadres = [...padresForm];
                        newPadres[index].relacion = e.target.value;
                        setPadresForm(newPadres);
                      }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Tutor">Tutor</option>
                      <option value="Abuelo/a">Abuelo/a</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={padre.principal}
                        onChange={(e) => {
                          const newPadres = [...padresForm];
                          newPadres[index].principal = e.target.checked;
                          setPadresForm(newPadres);
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs font-medium">Contacto principal</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      <Modal open={detailModal} onClose={() => setDetailModal(false)} title="Detalle del Paciente" size="lg">
        {selected && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: selected.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                {selected.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selected.nombre} {selected.apellidos}</h3>
                <p className="text-sm text-muted">{calcularEdad(selected.fecha_nacimiento)} &bull; {selected.sexo === "F" ? "Femenino" : "Masculino"} &bull; {selected.tipo_sangre}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Fecha de Nacimiento</p>
                <p className="text-sm font-medium">{formatDate(selected.fecha_nacimiento)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Telefono</p>
                <p className="text-sm font-medium">{selected.telefono}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Email</p>
                <p className="text-sm font-medium">{selected.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Direccion</p>
                <p className="text-sm font-medium">{selected.direccion}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Alergias</p>
                <p className="text-sm font-medium">{selected.alergias}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Registro</p>
                <p className="text-sm font-medium">{formatDate(selected.created_at)}</p>
              </div>
            </div>
            <h4 className="font-semibold mb-3">Padres / Tutores</h4>
            <div className="space-y-2">
              {getPadres(selected.id_paciente).map((padre, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full gradient-pink-cyan flex items-center justify-center text-white text-xs font-bold">
                    {padre?.nombre?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{padre?.nombre}</p>
                    <p className="text-xs text-muted">{padre?.relacion} &bull; {padre?.telefono}</p>
                  </div>
                  {padre?.principal && <span className="badge bg-cyan-100 text-cyan-700">Principal</span>}
                </div>
              ))}
              {getPadres(selected.id_paciente).length === 0 && <p className="text-sm text-muted">No hay padres/tutores registrados</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

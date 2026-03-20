"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, CheckCircle, XCircle, Users, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import { citas as initialCitas, pacientes, padres, pacientePadres } from "@/lib/mockData";
import { formatDate, calcularEdad } from "@/lib/utils";

export default function CitasPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [citasList, setCitasList] = useState(initialCitas);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [dayAppointmentsModal, setDayAppointmentsModal] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [selectedCita, setSelectedCita] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientList, setShowPatientList] = useState(false);

  const emptyCita = {
    id_paciente: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "09:00",
    motivo: "",
    estado: "programada",
    notas: ""
  };

  const [form, setForm] = useState(emptyCita);

  const searchPatients = (query) => {
    setPatientSearch(query);
    if (!query.trim()) {
      setFilteredPatients([]);
      setShowPatientList(false);
      return;
    }

    const searchLower = query.toLowerCase();
    const results = pacientes.filter(p => {
      // Search by patient name
      const fullName = `${p.nombre} ${p.apellidos}`.toLowerCase();
      if (fullName.includes(searchLower)) return true;

      // Search by parent cedula
      const parentRels = pacientePadres.filter(pp => pp.id_paciente === p.id_paciente);
      const parentIds = parentRels.map(pr => pr.id_padre);
      const patientParents = padres.filter(padre => parentIds.includes(padre.id_padre));
      
      return patientParents.some(padre => 
        padre.cedula?.toLowerCase().includes(searchLower) ||
        padre.nombre?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPatients(results);
    setShowPatientList(true);
  };

  const selectPatient = (patient) => {
    setForm({ ...form, id_paciente: String(patient.id_paciente) });
    setPatientSearch(`${patient.nombre} ${patient.apellidos}`);
    setShowPatientList(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getCitasForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return citasList.filter(c => c.fecha === dateStr).sort((a, b) => a.hora.localeCompare(b.hora));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    const citas = getCitasForDate(date);
    if (citas.length > 0) {
      setSelectedDate(date);
      setDayAppointmentsModal(true);
    }
  };

  const handleSave = () => {
    if (!form.id_paciente || !form.fecha || !form.hora) return;
    
    const data = { ...form, id_paciente: Number(form.id_paciente) };
    
    if (editingCita) {
      setCitasList(citasList.map(c => c.id_cita === editingCita.id_cita ? { ...editingCita, ...data } : c));
    } else {
      const newId = Math.max(...citasList.map(c => c.id_cita), 0) + 1;
      setCitasList([...citasList, { ...data, id_cita: newId }]);
    }
    
    setModalOpen(false);
    setEditingCita(null);
    setForm(emptyCita);
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    const paciente = getPaciente(cita.id_paciente);
    if (paciente) {
      setPatientSearch(`${paciente.nombre} ${paciente.apellidos}`);
    }
    setForm({
      id_paciente: String(cita.id_paciente),
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo || "",
      estado: cita.estado,
      notas: cita.notas || ""
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("¿Eliminar esta cita?")) {
      setCitasList(citasList.filter(c => c.id_cita !== id));
    }
  };

  const handleChangeEstado = (id, nuevoEstado) => {
    setCitasList(citasList.map(c => c.id_cita === id ? { ...c, estado: nuevoEstado } : c));
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      programada: "bg-blue-100 text-blue-700",
      confirmada: "bg-green-100 text-green-700",
      atendida: "bg-purple-100 text-purple-700",
      cancelada: "bg-red-100 text-red-700",
      "no asistio": "bg-gray-100 text-gray-700"
    };
    return badges[estado] || badges.programada;
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case "confirmada": return <CheckCircle className="w-3 h-3" />;
      case "cancelada": return <XCircle className="w-3 h-3" />;
      case "atendida": return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      programada: "bg-blue-500",
      confirmada: "bg-green-500",
      atendida: "bg-purple-500",
      cancelada: "bg-red-500",
      "no asistio": "bg-gray-500"
    };
    return colors[estado] || colors.programada;
  };

  const getPaciente = (idPaciente) => pacientes.find(p => p.id_paciente === idPaciente);

  const monthName = currentDate.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  const days = getDaysInMonth(currentDate);
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekDaysMobile = ["D", "L", "M", "M", "J", "V", "S"];

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div>
      <PageHeader
        title="Calendario de Citas"
        subtitle={`${citasList.length} citas registradas`}
        actions={
          <button onClick={() => { setEditingCita(null); setForm(emptyCita); setModalOpen(true); }} className="btn-primary p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nueva Cita</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Calendar Header */}
        <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={handlePrevMonth} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h2 className="text-base sm:text-xl font-bold capitalize min-w-[140px] sm:min-w-[200px] text-center">{monthName}</h2>
            <button onClick={handleNextMonth} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <button onClick={handleToday} className="btn-secondary px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm">
            Hoy
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 sm:p-4">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-muted py-1 sm:py-2">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{weekDaysMobile[index]}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((date, index) => {
              const citas = getCitasForDate(date);
              const today = isToday(date);
              const hasCitas = citas.length > 0;
              
              return (
                <div
                  key={index}
                  onClick={() => date && handleDateClick(date)}
                  className={`min-h-[60px] sm:min-h-[100px] border border-border rounded-lg p-1 sm:p-2 transition-all ${
                    !date ? "bg-gray-50" : hasCitas ? "bg-white hover:bg-blue-50 cursor-pointer" : "bg-white"
                  } ${today ? "ring-2 ring-cyan-500" : ""}`}
                >
                  {date && (
                    <>
                      <div className={`text-xs sm:text-sm font-semibold mb-1 ${today ? "text-cyan-600" : "text-gray-700"}`}>
                        {date.getDate()}
                      </div>
                      
                      {hasCitas && (
                        <div className="space-y-1">
                          {/* Mobile: Show count badge */}
                          <div className="sm:hidden">
                            <div className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 rounded px-1.5 py-0.5">
                              <Users className="w-3 h-3" />
                              <span className="text-xs font-medium">{citas.length}</span>
                            </div>
                          </div>
                          
                          {/* Desktop: Show colored dots for each appointment */}
                          <div className="hidden sm:flex flex-wrap gap-1">
                            {citas.slice(0, 4).map((cita, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${getEstadoColor(cita.estado)}`}
                                title={`${cita.hora} - ${getPaciente(cita.id_paciente)?.nombre}`}
                              />
                            ))}
                            {citas.length > 4 && (
                              <span className="text-[10px] text-muted">+{citas.length - 4}</span>
                            )}
                          </div>
                          
                          {/* Desktop: Show appointment count */}
                          <div className="hidden sm:block">
                            <div className="text-[10px] text-muted font-medium">
                              {citas.length} {citas.length === 1 ? "cita" : "citas"}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-3 sm:p-4 border-t border-border flex flex-wrap gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted">Programada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted">Confirmada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-muted">Atendida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-muted">Cancelada</span>
          </div>
        </div>
      </div>

      {/* Day Appointments Modal */}
      <Modal 
        open={dayAppointmentsModal} 
        onClose={() => setDayAppointmentsModal(false)} 
        title={selectedDate ? `Citas del ${formatDate(selectedDate.toISOString().split("T")[0])}` : "Citas del día"}
        size="lg"
      >
        {selectedDate && (
          <div className="space-y-3">
            {getCitasForDate(selectedDate).map(cita => {
              const paciente = getPaciente(cita.id_paciente);
              return (
                <div key={cita.id_cita} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: paciente?.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                      {paciente?.nombre.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{paciente?.nombre} {paciente?.apellidos}</p>
                          <p className="text-xs text-muted">{calcularEdad(paciente?.fecha_nacimiento)}</p>
                        </div>
                        <span className={`badge ${getEstadoBadge(cita.estado)} flex items-center gap-1 shrink-0`}>
                          {getEstadoIcon(cita.estado)}
                          <span className="hidden sm:inline">{cita.estado}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-1 text-muted">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{cita.hora}</span>
                        </div>
                        {cita.motivo && (
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-600 truncate block">{cita.motivo}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => { setSelectedCita(cita); setDayAppointmentsModal(false); setDetailModal(true); }} 
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                        >
                          Ver Detalle
                        </button>
                        <button 
                          onClick={() => { setDayAppointmentsModal(false); handleEdit(cita); }} 
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Editar
                        </button>
                        {cita.estado === "programada" && (
                          <button 
                            onClick={() => { handleChangeEstado(cita.id_cita, "confirmada"); }} 
                            className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs hover:bg-green-100"
                          >
                            Confirmar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingCita(null); setPatientSearch(""); setShowPatientList(false); }} title={editingCita ? "Editar Cita" : "Nueva Cita"}>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Paciente *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => searchPatients(e.target.value)}
                onFocus={() => patientSearch && setShowPatientList(true)}
                className="w-full border border-border rounded-lg pl-10 pr-3 py-2 text-sm"
                placeholder="Buscar por nombre del paciente o cédula del padre..."
              />
            </div>
            {showPatientList && filteredPatients.length > 0 && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPatientList(false)} />
                <div className="absolute z-20 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredPatients.map(p => {
                    const parentRels = pacientePadres.filter(pp => pp.id_paciente === p.id_paciente);
                    const parentIds = parentRels.map(pr => pr.id_padre);
                    const patientParents = padres.filter(padre => parentIds.includes(padre.id_padre));
                    const mainParent = patientParents.find(padre => parentRels.find(pr => pr.id_padre === padre.id_padre)?.principal) || patientParents[0];
                    
                    return (
                      <button
                        key={p.id_paciente}
                        onClick={() => selectPatient(p)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: p.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                            {p.nombre.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{p.nombre} {p.apellidos}</p>
                            <p className="text-xs text-muted">{calcularEdad(p.fecha_nacimiento)} • {mainParent?.nombre || "Sin padre registrado"}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {patientSearch && filteredPatients.length === 0 && showPatientList && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-border rounded-lg shadow-lg p-4 text-center">
                <p className="text-sm text-muted">No se encontraron pacientes</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha *</label>
              <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora *</label>
              <input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motivo</label>
            <input type="text" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Motivo de la cita" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="programada">Programada</option>
              <option value="confirmada">Confirmada</option>
              <option value="atendida">Atendida</option>
              <option value="cancelada">Cancelada</option>
              <option value="no asistio">No asistió</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Notas adicionales" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setModalOpen(false); setEditingCita(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detailModal} onClose={() => setDetailModal(false)} title="Detalle de Cita">
        {selectedCita && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              {(() => {
                const paciente = getPaciente(selectedCita.id_paciente);
                return paciente ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: paciente.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                      {paciente.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{paciente.nombre} {paciente.apellidos}</h3>
                      <p className="text-sm text-muted">{calcularEdad(paciente.fecha_nacimiento)} • {paciente.telefono}</p>
                    </div>
                  </>
                ) : <p>Paciente no encontrado</p>;
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Fecha</p>
                <p className="text-sm font-medium">{formatDate(selectedCita.fecha)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Hora</p>
                <p className="text-sm font-medium">{selectedCita.hora}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Motivo</p>
                <p className="text-sm font-medium">{selectedCita.motivo || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Estado</p>
                <span className={`badge ${getEstadoBadge(selectedCita.estado)} flex items-center gap-1 w-fit`}>
                  {getEstadoIcon(selectedCita.estado)}
                  {selectedCita.estado}
                </span>
              </div>
            </div>

            {selectedCita.notas && (
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-xs text-muted mb-1">Notas</p>
                <p className="text-sm">{selectedCita.notas}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {selectedCita.estado === "programada" && (
                <button onClick={() => { handleChangeEstado(selectedCita.id_cita, "confirmada"); setDetailModal(false); }} className="btn-primary px-4 py-2 rounded-lg text-sm flex-1">
                  Confirmar
                </button>
              )}
              {(selectedCita.estado === "programada" || selectedCita.estado === "confirmada") && (
                <button onClick={() => { handleChangeEstado(selectedCita.id_cita, "atendida"); setDetailModal(false); }} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex-1 hover:bg-purple-700">
                  Marcar Atendida
                </button>
              )}
              <button onClick={() => { setDetailModal(false); handleEdit(selectedCita); }} className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <Edit className="w-4 h-4" /> Editar
              </button>
              <button onClick={() => { handleDelete(selectedCita.id_cita); setDetailModal(false); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

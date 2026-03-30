"use client";
import { useState } from "react";
import { Search, FileText, Syringe, Pill, FlaskConical, BookOpen, Plus, Edit, Trash2, Eye, Printer, Weight, Ruler, Activity, X, TrendingUp, Brain } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import { pacientes, consultas as initialConsultas, vacunas as initialVacunas, recetas as initialRecetas, laboratorios as initialLaboratorios, recomendacionesEntregadas, recomendaciones, configuracion } from "@/lib/mockData";
import { formatDate, calcularEdad } from "@/lib/utils";

export default function HistorialMedicoPage() {
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("consultas");
  
  const [consultasList, setConsultasList] = useState(initialConsultas);
  const [vacunasList, setVacunasList] = useState(initialVacunas);
  const [recetasList, setRecetasList] = useState(initialRecetas);
  const [labsList, setLabsList] = useState(initialLaboratorios);
  const [crecimientoList, setCrecimientoList] = useState([]);
  const [evaluacionesList, setEvaluacionesList] = useState([]);
  
  const [consultaModal, setConsultaModal] = useState(false);
  const [vacunaModal, setVacunaModal] = useState(false);
  const [recetaModal, setRecetaModal] = useState(false);
  const [labModal, setLabModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [printRecetaModal, setPrintRecetaModal] = useState(false);
  const [crecimientoModal, setCrecimientoModal] = useState(false);
  const [evaluacionModal, setEvaluacionModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const emptyConsulta = { fecha: new Date().toISOString().split("T")[0], motivo: "", peso: "", talla: "", perimetro_cefalico: "", diagnostico: "", tratamiento: "", observaciones: "", monto: "", moneda: "dolar", tipo_pago: "fisico", metodo_pago: "contado" };
  const emptyVacuna = { nombre: "", fecha_aplicacion: new Date().toISOString().split("T")[0], dosis: "", lote: "", proxima_dosis: "" };
  const emptyReceta = { medicamento: "", dosis: "", frecuencia: "", duracion: "", indicaciones: "" };
  const emptyLab = { prueba: "", fecha_orden: new Date().toISOString().split("T")[0], fecha_resultado: "", resultado: "", foto_resultado: "" };
  const emptyCrecimiento = { fecha: new Date().toISOString().split("T")[0], edad_meses: "", peso: "", talla: "", perimetro_cefalico: "", imc: "" };
  const emptyEvaluacion = { fecha: new Date().toISOString().split("T")[0], area: "", observaciones: "", puntaje: "", recomendaciones: "" };
  
  const [consultaForm, setConsultaForm] = useState(emptyConsulta);
  const [vacunaForm, setVacunaForm] = useState(emptyVacuna);
  const [recetaForm, setRecetaForm] = useState(emptyReceta);
  const [labForm, setLabForm] = useState(emptyLab);
  const [crecimientoForm, setCrecimientoForm] = useState(emptyCrecimiento);
  const [evaluacionForm, setEvaluacionForm] = useState(emptyEvaluacion);

  const filteredPacientes = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telefono.includes(searchTerm)
  );

  const handleSelectPaciente = (paciente) => {
    setSelectedPaciente(paciente);
    setSearchTerm("");
  };

  const getConsultas = () => consultasList.filter(c => c.id_paciente === selectedPaciente?.id_paciente).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const getVacunas = () => vacunasList.filter(v => v.id_paciente === selectedPaciente?.id_paciente).sort((a, b) => new Date(b.fecha_aplicacion) - new Date(a.fecha_aplicacion));
  const getRecetas = () => {
    const consultasIds = getConsultas().map(c => c.id_consulta);
    return recetasList.filter(r => consultasIds.includes(r.id_consulta)).sort((a, b) => b.id_receta - a.id_receta);
  };
  const getLabs = () => {
    const consultasIds = getConsultas().map(c => c.id_consulta);
    return labsList.filter(l => consultasIds.includes(l.id_consulta)).sort((a, b) => b.id_lab - a.id_lab);
  };
  const getRecomendaciones = () => {
    const consultasIds = getConsultas().map(c => c.id_consulta);
    return recomendacionesEntregadas.filter(r => consultasIds.includes(r.id_consulta));
  };
  const getCrecimiento = () => crecimientoList.filter(c => c.id_paciente === selectedPaciente?.id_paciente).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const getEvaluaciones = () => evaluacionesList.filter(e => e.id_paciente === selectedPaciente?.id_paciente).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // CRUD Handlers
  const handleSaveConsulta = () => {
    if (!consultaForm.motivo) return;
    if (editingItem) {
      setConsultasList(consultasList.map(c => c.id_consulta === editingItem.id_consulta ? { ...editingItem, ...consultaForm, peso: parseFloat(consultaForm.peso) || null, talla: parseFloat(consultaForm.talla) || null, perimetro_cefalico: parseFloat(consultaForm.perimetro_cefalico) || null } : c));
    } else {
      const newId = Math.max(...consultasList.map(c => c.id_consulta), 0) + 1;
      setConsultasList([...consultasList, { ...consultaForm, id_consulta: newId, id_paciente: selectedPaciente.id_paciente, peso: parseFloat(consultaForm.peso) || null, talla: parseFloat(consultaForm.talla) || null, perimetro_cefalico: parseFloat(consultaForm.perimetro_cefalico) || null }]);
    }
    setConsultaModal(false);
    setEditingItem(null);
    setConsultaForm(emptyConsulta);
  };

  const handleEditConsulta = (consulta) => {
    setEditingItem(consulta);
    setConsultaForm({ fecha: consulta.fecha, motivo: consulta.motivo, peso: consulta.peso || "", talla: consulta.talla || "", perimetro_cefalico: consulta.perimetro_cefalico || "", diagnostico: consulta.diagnostico || "", tratamiento: consulta.tratamiento || "", observaciones: consulta.observaciones || "" });
    setConsultaModal(true);
  };

  const handleDeleteConsulta = (id) => {
    if (confirm("¿Eliminar esta consulta?")) {
      setConsultasList(consultasList.filter(c => c.id_consulta !== id));
    }
  };

  const handleSaveVacuna = () => {
    if (!vacunaForm.nombre) return;
    if (editingItem) {
      setVacunasList(vacunasList.map(v => v.id_vacuna === editingItem.id_vacuna ? { ...editingItem, ...vacunaForm } : v));
    } else {
      const newId = Math.max(...vacunasList.map(v => v.id_vacuna), 0) + 1;
      setVacunasList([...vacunasList, { ...vacunaForm, id_vacuna: newId, id_paciente: selectedPaciente.id_paciente }]);
    }
    setVacunaModal(false);
    setEditingItem(null);
    setVacunaForm(emptyVacuna);
  };

  const handleEditVacuna = (vacuna) => {
    setEditingItem(vacuna);
    setVacunaForm({ nombre: vacuna.nombre, fecha_aplicacion: vacuna.fecha_aplicacion, dosis: vacuna.dosis || "", lote: vacuna.lote || "", proxima_dosis: vacuna.proxima_dosis || "" });
    setVacunaModal(true);
  };

  const handleDeleteVacuna = (id) => {
    if (confirm("¿Eliminar este registro de vacuna?")) {
      setVacunasList(vacunasList.filter(v => v.id_vacuna !== id));
    }
  };

  const handleSaveReceta = () => {
    if (!recetaForm.medicamento) return;
    if (editingItem) {
      setRecetasList(recetasList.map(r => r.id_receta === editingItem.id_receta ? { ...editingItem, ...recetaForm } : r));
    } else {
      const ultimaConsulta = getConsultas()[0];
      if (!ultimaConsulta) {
        alert("Debe crear una consulta primero");
        return;
      }
      const newId = Math.max(...recetasList.map(r => r.id_receta), 0) + 1;
      setRecetasList([...recetasList, { ...recetaForm, id_receta: newId, id_consulta: ultimaConsulta.id_consulta, enviada: false }]);
    }
    setRecetaModal(false);
    setEditingItem(null);
    setRecetaForm(emptyReceta);
  };

  const handleEditReceta = (receta) => {
    setEditingItem(receta);
    setRecetaForm({ medicamento: receta.medicamento, dosis: receta.dosis || "", frecuencia: receta.frecuencia || "", duracion: receta.duracion || "", indicaciones: receta.indicaciones || "" });
    setRecetaModal(true);
  };

  const handleDeleteReceta = (id) => {
    if (confirm("¿Eliminar esta receta?")) {
      setRecetasList(recetasList.filter(r => r.id_receta !== id));
    }
  };

  const handlePrintReceta = (receta) => {
    setSelectedItem(receta);
    setPrintRecetaModal(true);
  };

  const handleSaveLab = () => {
    if (!labForm.prueba) return;
    if (editingItem) {
      setLabsList(labsList.map(l => l.id_lab === editingItem.id_lab ? { ...editingItem, ...labForm } : l));
    } else {
      const ultimaConsulta = getConsultas()[0];
      if (!ultimaConsulta) {
        alert("Debe crear una consulta primero");
        return;
      }
      const newId = Math.max(...labsList.map(l => l.id_lab), 0) + 1;
      setLabsList([...labsList, { ...labForm, id_lab: newId, id_consulta: ultimaConsulta.id_consulta, archivo: "" }]);
    }
    setLabModal(false);
    setEditingItem(null);
    setLabForm(emptyLab);
  };

  const handleEditLab = (lab) => {
    setEditingItem(lab);
    setLabForm({ prueba: lab.prueba, fecha_orden: lab.fecha_orden, fecha_resultado: lab.fecha_resultado || "", resultado: lab.resultado || "", foto_resultado: lab.foto_resultado || "" });
    setLabModal(true);
  };

  const handleDeleteLab = (id) => {
    if (confirm("¿Eliminar esta orden de laboratorio?")) {
      setLabsList(labsList.filter(l => l.id_lab !== id));
    }
  };

  const handleSaveCrecimiento = () => {
    if (!crecimientoForm.peso || !crecimientoForm.talla) return;
    if (editingItem) {
      setCrecimientoList(crecimientoList.map(c => c.id_crecimiento === editingItem.id_crecimiento ? { ...editingItem, ...crecimientoForm } : c));
    } else {
      const newId = Math.max(...crecimientoList.map(c => c.id_crecimiento || 0), 0) + 1;
      setCrecimientoList([...crecimientoList, { ...crecimientoForm, id_crecimiento: newId, id_paciente: selectedPaciente.id_paciente }]);
    }
    setCrecimientoModal(false);
    setEditingItem(null);
    setCrecimientoForm(emptyCrecimiento);
  };

  const handleSaveEvaluacion = () => {
    if (!evaluacionForm.area) return;
    if (editingItem) {
      setEvaluacionesList(evaluacionesList.map(e => e.id_evaluacion === editingItem.id_evaluacion ? { ...editingItem, ...evaluacionForm } : e));
    } else {
      const newId = Math.max(...evaluacionesList.map(e => e.id_evaluacion || 0), 0) + 1;
      setEvaluacionesList([...evaluacionesList, { ...evaluacionForm, id_evaluacion: newId, id_paciente: selectedPaciente.id_paciente }]);
    }
    setEvaluacionModal(false);
    setEditingItem(null);
    setEvaluacionForm(emptyEvaluacion);
  };

  const tabs = [
    { id: "consultas", label: "Consultas", icon: FileText, count: getConsultas().length },
    { id: "vacunas", label: "Vacunas", icon: Syringe, count: getVacunas().length },
    { id: "crecimiento", label: "Crecimiento", icon: TrendingUp, count: getCrecimiento().length },
    { id: "evaluaciones", label: "Evaluaciones", icon: Brain, count: getEvaluaciones().length },
    { id: "recetas", label: "Recetas", icon: Pill, count: getRecetas().length },
    { id: "laboratorios", label: "Laboratorios", icon: FlaskConical, count: getLabs().length },
    { id: "recomendaciones", label: "Recomendaciones", icon: BookOpen, count: getRecomendaciones().length },
  ];

  const consultorioInfo = {
    nombre: configuracion.find(c => c.clave === "nombre_consultorio")?.valor || "BabyTips",
    telefono: configuracion.find(c => c.clave === "telefono_consultorio")?.valor || "",
    direccion: configuracion.find(c => c.clave === "direccion_consultorio")?.valor || "",
    email: configuracion.find(c => c.clave === "email_consultorio")?.valor || "",
  };

  return (
    <div>
      <PageHeader title="Historial Médico" subtitle="Buscar paciente y gestionar su historial completo" />

      {!selectedPaciente ? (
        <div className="bg-white rounded-xl border border-border p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl gradient-pink-cyan flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Buscar Paciente</h3>
              <p className="text-sm text-muted">Ingrese el nombre, apellido o teléfono del paciente</p>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre, apellido o teléfono..." className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm" autoFocus />
            </div>

            {searchTerm && (
              <div className="border border-border rounded-xl divide-y divide-border max-h-96 overflow-y-auto">
                {filteredPacientes.length > 0 ? (
                  filteredPacientes.map(pac => (
                    <button key={pac.id_paciente} onClick={() => handleSelectPaciente(pac)} className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: pac.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                        {pac.nombre.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{pac.nombre} {pac.apellidos}</p>
                        <p className="text-xs text-muted">{calcularEdad(pac.fecha_nacimiento)} • {pac.sexo === "F" ? "Femenino" : "Masculino"} • {pac.telefono}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted"><p>No se encontraron pacientes</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: selectedPaciente.sexo === "F" ? "var(--baby-pink)" : "var(--baby-cyan)" }}>
                  {selectedPaciente.nombre.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPaciente.nombre} {selectedPaciente.apellidos}</h2>
                  <p className="text-sm text-muted">{calcularEdad(selectedPaciente.fecha_nacimiento)} • {selectedPaciente.sexo === "F" ? "Femenino" : "Masculino"} • Tipo: {selectedPaciente.tipo_sangre}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPaciente(null)} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cambiar Paciente</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Teléfono</p>
                <p className="text-sm font-medium">{selectedPaciente.telefono}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Email</p>
                <p className="text-sm font-medium truncate">{selectedPaciente.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Alergias</p>
                <p className="text-sm font-medium">{selectedPaciente.alergias || "Ninguna"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Fecha Nac.</p>
                <p className="text-sm font-medium">{formatDate(selectedPaciente.fecha_nacimiento)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="flex border-b border-border overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const count = selectedPaciente ? tab.count : 0;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50" : "text-gray-600 hover:bg-gray-50"}`}>
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span className="badge bg-gray-100 text-gray-600 text-xs">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === "consultas" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Consultas Médicas</h3>
                    <button onClick={() => { setEditingItem(null); setConsultaForm(emptyConsulta); setConsultaModal(true); }} className="btn-primary p-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nueva Consulta</span>
                    </button>
                  </div>
                  
                  {getConsultas().length > 0 ? (
                    <div className="space-y-3">
                      {getConsultas().map(consulta => (
                        <div key={consulta.id_consulta} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{consulta.motivo}</p>
                                <p className="text-xs text-muted">{formatDate(consulta.fecha)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setSelectedItem(consulta); setDetailModal(true); }} className="p-1.5 rounded-lg hover:bg-blue-50">
                                <Eye className="w-4 h-4 text-blue-500" />
                              </button>
                              <button onClick={() => handleEditConsulta(consulta)} className="p-1.5 rounded-lg hover:bg-cyan-50">
                                <Edit className="w-4 h-4 text-cyan-600" />
                              </button>
                              <button onClick={() => handleDeleteConsulta(consulta.id_consulta)} className="p-1.5 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                          {consulta.diagnostico && <p className="text-sm text-gray-600 mb-2"><strong>Diagnóstico:</strong> {consulta.diagnostico}</p>}
                          <div className="flex gap-4 text-xs text-muted">
                            {consulta.peso && <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{consulta.peso} kg</span>}
                            {consulta.talla && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{consulta.talla} cm</span>}
                            {consulta.perimetro_cefalico && <span className="flex items-center gap-1"><Activity className="w-3 h-3" />PC: {consulta.perimetro_cefalico} cm</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay consultas registradas</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "vacunas" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">Tarjeta de Vacunación</h3>
                      <p className="text-xs text-muted">Sociedad Venezolana de Puericultura y Pediatría</p>
                    </div>
                    <button onClick={() => { setEditingItem(null); setVacunaForm(emptyVacuna); setVacunaModal(true); }} className="btn-primary p-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Registrar Vacuna</span>
                    </button>
                  </div>
                  
                  <div className="bg-white border-2 border-green-600 rounded-lg p-6 mb-4">
                    <div className="border-b-2 border-green-600 pb-3 mb-4">
                      <h4 className="text-center font-bold text-green-700 text-lg">ESQUEMA DE VACUNACIÓN INFANTIL</h4>
                      <p className="text-center text-xs text-muted mt-1">Según normativa de la Sociedad Venezolana de Puericultura y Pediatría</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-green-50">
                            <th className="border border-green-300 px-3 py-2 text-left font-semibold">Edad</th>
                            <th className="border border-green-300 px-3 py-2 text-left font-semibold">Vacuna</th>
                            <th className="border border-green-300 px-3 py-2 text-left font-semibold">Dosis</th>
                            <th className="border border-green-300 px-3 py-2 text-left font-semibold">Fecha</th>
                            <th className="border border-green-300 px-3 py-2 text-left font-semibold">Lote</th>
                            <th className="border border-green-300 px-3 py-2 text-center font-semibold">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { edad: "Recién nacido", vacunas: ["BCG", "Hepatitis B (1ra dosis)"] },
                            { edad: "2 meses", vacunas: ["Pentavalente (1ra)", "Rotavirus (1ra)", "Neumococo (1ra)", "Polio (1ra)"] },
                            { edad: "4 meses", vacunas: ["Pentavalente (2da)", "Rotavirus (2da)", "Neumococo (2da)", "Polio (2da)"] },
                            { edad: "6 meses", vacunas: ["Pentavalente (3ra)", "Rotavirus (3ra)", "Neumococo (3ra)", "Polio (3ra)", "Influenza (1ra)"] },
                            { edad: "7 meses", vacunas: ["Influenza (2da)"] },
                            { edad: "12 meses", vacunas: ["SRP (1ra)", "Neumococo (refuerzo)", "Hepatitis A (1ra)", "Varicela (1ra)"] },
                            { edad: "15 meses", vacunas: ["Pentavalente (refuerzo)"] },
                            { edad: "18 meses", vacunas: ["Hepatitis A (2da)", "Varicela (2da)"] },
                            { edad: "4 años", vacunas: ["DPT (refuerzo)", "Polio (refuerzo)", "SRP (2da)"] },
                            { edad: "9 años", vacunas: ["VPH (niñas - 2 dosis)"] },
                          ].map((grupo, idx) => (
                            grupo.vacunas.map((nombreVacuna, vidx) => {
                              const vacunaRegistrada = getVacunas().find(v => 
                                v.nombre.toLowerCase().includes(nombreVacuna.toLowerCase().split('(')[0].trim().toLowerCase())
                              );
                              return (
                                <tr key={`${idx}-${vidx}`} className={vacunaRegistrada ? "bg-green-50" : "hover:bg-gray-50"}>
                                  {vidx === 0 && (
                                    <td rowSpan={grupo.vacunas.length} className="border border-green-300 px-3 py-2 font-medium bg-green-100">
                                      {grupo.edad}
                                    </td>
                                  )}
                                  <td className="border border-green-300 px-3 py-2">{nombreVacuna}</td>
                                  <td className="border border-green-300 px-3 py-2 text-center">
                                    {vacunaRegistrada ? (
                                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs">✓</span>
                                    ) : (
                                      <span className="text-muted">-</span>
                                    )}
                                  </td>
                                  <td className="border border-green-300 px-3 py-2 text-xs">
                                    {vacunaRegistrada ? formatDate(vacunaRegistrada.fecha_aplicacion) : "-"}
                                  </td>
                                  <td className="border border-green-300 px-3 py-2 text-xs">
                                    {vacunaRegistrada?.lote || "-"}
                                  </td>
                                  <td className="border border-green-300 px-3 py-2 text-center">
                                    {vacunaRegistrada ? (
                                      <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => handleEditVacuna(vacunaRegistrada)} className="p-1 rounded hover:bg-cyan-100">
                                          <Edit className="w-3 h-3 text-cyan-600" />
                                        </button>
                                        <button onClick={() => handleDeleteVacuna(vacunaRegistrada.id_vacuna)} className="p-1 rounded hover:bg-red-100">
                                          <Trash2 className="w-3 h-3 text-red-400" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => { 
                                          setVacunaForm({ ...emptyVacuna, nombre: nombreVacuna }); 
                                          setVacunaModal(true); 
                                        }} 
                                        className="text-xs text-cyan-600 hover:text-cyan-800 underline"
                                      >
                                        Registrar
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Nota:</strong> Este esquema está basado en las recomendaciones de la Sociedad Venezolana de Puericultura y Pediatría. 
                        Consulte con su pediatra para un esquema personalizado según las necesidades de su hijo.
                      </p>
                    </div>
                  </div>

                  {getVacunas().length === 0 && (
                    <div className="text-center py-8 text-muted bg-gray-50 rounded-lg">
                      <Syringe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No hay vacunas registradas</p>
                      <p className="text-xs mt-1">Utilice la tabla superior para registrar las vacunas aplicadas</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "recetas" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Recetas Médicas</h3>
                    <button onClick={() => { setEditingItem(null); setRecetaForm(emptyReceta); setRecetaModal(true); }} className="btn-primary p-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nueva Receta</span>
                    </button>
                  </div>
                  
                  {getRecetas().length > 0 ? (
                    <div className="space-y-3">
                      {getRecetas().map(receta => (
                        <div key={receta.id_receta} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                              <Pill className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{receta.medicamento}</p>
                              <p className="text-sm text-gray-600">{receta.dosis} • {receta.frecuencia} • {receta.duracion}</p>
                              {receta.indicaciones && <p className="text-xs text-muted mt-1">{receta.indicaciones}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => handlePrintReceta(receta)} className="p-1.5 rounded-lg hover:bg-purple-50">
                                <Printer className="w-4 h-4 text-purple-600" />
                              </button>
                              <button onClick={() => handleEditReceta(receta)} className="p-1.5 rounded-lg hover:bg-cyan-50">
                                <Edit className="w-4 h-4 text-cyan-600" />
                              </button>
                              <button onClick={() => handleDeleteReceta(receta.id_receta)} className="p-1.5 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted">
                      <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay recetas registradas</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "laboratorios" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Órdenes de Laboratorio</h3>
                    <button onClick={() => { setEditingItem(null); setLabForm(emptyLab); setLabModal(true); }} className="btn-primary p-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nueva Orden</span>
                    </button>
                  </div>
                  
                  {getLabs().length > 0 ? (
                    <div className="space-y-3">
                      {getLabs().map(lab => (
                        <div key={lab.id_lab} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                              <FlaskConical className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{lab.prueba}</p>
                              <p className="text-xs text-muted">Orden: {formatDate(lab.fecha_orden)}</p>
                              {lab.fecha_resultado ? (
                                <p className="text-sm text-gray-600 mt-1"><strong>Resultado:</strong> {lab.resultado}</p>
                              ) : (
                                <span className="badge bg-yellow-100 text-yellow-700 text-xs mt-1">Pendiente</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleEditLab(lab)} className="p-1.5 rounded-lg hover:bg-cyan-50">
                                <Edit className="w-4 h-4 text-cyan-600" />
                              </button>
                              <button onClick={() => handleDeleteLab(lab.id_lab)} className="p-1.5 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted">
                      <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay órdenes de laboratorio</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "crecimiento" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Gráficos de Crecimiento (Percentiles OMS)</h3>
                    <button onClick={() => { setEditingItem(null); setCrecimientoForm(emptyCrecimiento); setCrecimientoModal(true); }} className="btn-primary p-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nuevo Registro</span>
                    </button>
                  </div>
                  
                  {getCrecimiento().length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800"><strong>Percentiles OMS:</strong> Los gráficos de crecimiento permiten evaluar el desarrollo físico del niño comparándolo con estándares de la Organización Mundial de la Salud.</p>
                      </div>
                      <div className="space-y-3">
                        {getCrecimiento().map(crec => (
                          <div key={crec.id_crecimiento} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{formatDate(crec.fecha)} - {crec.edad_meses} meses</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                                    <div className="bg-white rounded px-2 py-1 border border-border">
                                      <span className="text-muted">Peso:</span> <strong>{crec.peso} kg</strong>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1 border border-border">
                                      <span className="text-muted">Talla:</span> <strong>{crec.talla} cm</strong>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1 border border-border">
                                      <span className="text-muted">P. Cefálico:</span> <strong>{crec.perimetro_cefalico} cm</strong>
                                    </div>
                                    {crec.imc && (
                                      <div className="bg-white rounded px-2 py-1 border border-border">
                                        <span className="text-muted">IMC:</span> <strong>{crec.imc}</strong>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => { setEditingItem(crec); setCrecimientoForm(crec); setCrecimientoModal(true); }} className="p-1.5 rounded-lg hover:bg-cyan-50">
                                  <Edit className="w-4 h-4 text-cyan-600" />
                                </button>
                                <button onClick={() => { if (confirm("¿Eliminar este registro?")) setCrecimientoList(crecimientoList.filter(c => c.id_crecimiento !== crec.id_crecimiento)); }} className="p-1.5 rounded-lg hover:bg-red-50">
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay registros de crecimiento</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "evaluaciones" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Evaluaciones Psicosociales</h3>
                    <button onClick={() => { setEditingItem(null); setEvaluacionForm(emptyEvaluacion); setEvaluacionModal(true); }} className="btn-primary p-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Nueva Evaluación</span>
                    </button>
                  </div>
                  
                  {getEvaluaciones().length > 0 ? (
                    <div className="space-y-3">
                      {getEvaluaciones().map(evaluacion => (
                        <div key={evaluacion.id_evaluacion} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                <Brain className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{evaluacion.area}</p>
                                <p className="text-xs text-muted">{formatDate(evaluacion.fecha)}</p>
                                {evaluacion.puntaje && <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Puntaje: {evaluacion.puntaje}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setEditingItem(evaluacion); setEvaluacionForm(evaluacion); setEvaluacionModal(true); }} className="p-1.5 rounded-lg hover:bg-cyan-50">
                                <Edit className="w-4 h-4 text-cyan-600" />
                              </button>
                              <button onClick={() => { if (confirm("¿Eliminar esta evaluación?")) setEvaluacionesList(evaluacionesList.filter(e => e.id_evaluacion !== evaluacion.id_evaluacion)); }} className="p-1.5 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                          {evaluacion.observaciones && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                              <p className="text-xs text-muted mb-1">Observaciones:</p>
                              <p className="text-sm">{evaluacion.observaciones}</p>
                            </div>
                          )}
                          {evaluacion.recomendaciones && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs text-muted mb-1">Recomendaciones:</p>
                              <p className="text-sm">{evaluacion.recomendaciones}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted">
                      <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay evaluaciones psicosociales registradas</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "recomendaciones" && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold">Recomendaciones Entregadas</h3>
                    <p className="text-xs text-muted mt-1">Las recomendaciones se entregan desde la página de Recomendaciones y se vinculan a las consultas</p>
                  </div>
                  {getRecomendaciones().length > 0 ? (
                    <div className="space-y-3">
                      {getRecomendaciones().map(rec => {
                        const recomendacion = recomendaciones.find(r => r.id_recomendacion === rec.id_recomendacion);
                        return (
                          <div key={rec.id_entrega} className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{recomendacion?.titulo}</p>
                                <p className="text-xs text-muted">{formatDate(rec.fecha_entrega)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay recomendaciones entregadas</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal open={consultaModal} onClose={() => { setConsultaModal(false); setEditingItem(null); }} title={editingItem ? "Editar Consulta" : "Nueva Consulta"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha *</label>
            <input type="date" value={consultaForm.fecha} onChange={(e) => setConsultaForm({ ...consultaForm, fecha: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motivo de Consulta *</label>
            <textarea value={consultaForm.motivo} onChange={(e) => setConsultaForm({ ...consultaForm, motivo: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Razón de la visita" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Peso (kg)</label>
              <input type="number" step="0.1" value={consultaForm.peso} onChange={(e) => setConsultaForm({ ...consultaForm, peso: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Talla (cm)</label>
              <input type="number" step="0.1" value={consultaForm.talla} onChange={(e) => setConsultaForm({ ...consultaForm, talla: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PC (cm)</label>
              <input type="number" step="0.1" value={consultaForm.perimetro_cefalico} onChange={(e) => setConsultaForm({ ...consultaForm, perimetro_cefalico: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Diagnóstico</label>
            <textarea value={consultaForm.diagnostico} onChange={(e) => setConsultaForm({ ...consultaForm, diagnostico: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tratamiento</label>
            <textarea value={consultaForm.tratamiento} onChange={(e) => setConsultaForm({ ...consultaForm, tratamiento: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea value={consultaForm.observaciones} onChange={(e) => setConsultaForm({ ...consultaForm, observaciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-semibold mb-3 text-sm">Información de Facturación</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monto de Consulta</label>
                <input type="number" step="0.01" value={consultaForm.monto} onChange={(e) => setConsultaForm({ ...consultaForm, monto: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Moneda</label>
                <select value={consultaForm.moneda} onChange={(e) => setConsultaForm({ ...consultaForm, moneda: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                  <option value="dolar">Dólares (USD)</option>
                  <option value="bolivares">Bolívares (Bs.)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium mb-1">Método de Pago</label>
                <select value={consultaForm.metodo_pago} onChange={(e) => setConsultaForm({ ...consultaForm, metodo_pago: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                  <option value="contado">De Contado</option>
                  <option value="credito">A Crédito</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Pago</label>
                <select value={consultaForm.tipo_pago} onChange={(e) => setConsultaForm({ ...consultaForm, tipo_pago: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                  <option value="fisico">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="pago_movil">Pago Móvil</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setConsultaModal(false); setEditingItem(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSaveConsulta} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      <Modal open={vacunaModal} onClose={() => { setVacunaModal(false); setEditingItem(null); }} title={editingItem ? "Editar Vacuna" : "Registrar Vacuna"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vacuna *</label>
            <input type="text" value={vacunaForm.nombre} onChange={(e) => setVacunaForm({ ...vacunaForm, nombre: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Nombre de la vacuna" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Aplicación *</label>
              <input type="date" value={vacunaForm.fecha_aplicacion} onChange={(e) => setVacunaForm({ ...vacunaForm, fecha_aplicacion: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosis</label>
              <input type="text" value={vacunaForm.dosis} onChange={(e) => setVacunaForm({ ...vacunaForm, dosis: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="1ra, 2da, etc." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lote</label>
              <input type="text" value={vacunaForm.lote} onChange={(e) => setVacunaForm({ ...vacunaForm, lote: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Próxima Dosis</label>
              <input type="date" value={vacunaForm.proxima_dosis} onChange={(e) => setVacunaForm({ ...vacunaForm, proxima_dosis: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setVacunaModal(false); setEditingItem(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSaveVacuna} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      <Modal open={recetaModal} onClose={() => { setRecetaModal(false); setEditingItem(null); }} title={editingItem ? "Editar Receta" : "Nueva Receta"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Medicamento *</label>
            <input type="text" value={recetaForm.medicamento} onChange={(e) => setRecetaForm({ ...recetaForm, medicamento: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dosis</label>
              <input type="text" value={recetaForm.dosis} onChange={(e) => setRecetaForm({ ...recetaForm, dosis: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="5ml, 1 tableta, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frecuencia</label>
              <input type="text" value={recetaForm.frecuencia} onChange={(e) => setRecetaForm({ ...recetaForm, frecuencia: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Cada 8 horas" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duración</label>
            <input type="text" value={recetaForm.duracion} onChange={(e) => setRecetaForm({ ...recetaForm, duracion: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="7 días" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Indicaciones</label>
            <textarea value={recetaForm.indicaciones} onChange={(e) => setRecetaForm({ ...recetaForm, indicaciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setRecetaModal(false); setEditingItem(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSaveReceta} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      <Modal open={labModal} onClose={() => { setLabModal(false); setEditingItem(null); }} title={editingItem ? "Editar Laboratorio" : "Nueva Orden de Laboratorio"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prueba / Examen *</label>
            <input type="text" value={labForm.prueba} onChange={(e) => setLabForm({ ...labForm, prueba: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Orden</label>
              <input type="date" value={labForm.fecha_orden} onChange={(e) => setLabForm({ ...labForm, fecha_orden: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Resultado</label>
              <input type="date" value={labForm.fecha_resultado} onChange={(e) => setLabForm({ ...labForm, fecha_resultado: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resultado</label>
            <textarea value={labForm.resultado} onChange={(e) => setLabForm({ ...labForm, resultado: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Foto del Resultado Físico</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setLabForm({ ...labForm, foto_resultado: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-baby-cyan file:text-white hover:file:bg-opacity-90"
            />
            {labForm.foto_resultado && (
              <div className="mt-2">
                <img src={labForm.foto_resultado} alt="Preview" className="max-w-full h-auto max-h-40 rounded-lg border border-border" />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setLabModal(false); setEditingItem(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSaveLab} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      <Modal open={detailModal} onClose={() => setDetailModal(false)} title="Detalle de Consulta" size="lg">
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Fecha</p>
                <p className="text-sm font-medium">{formatDate(selectedItem.fecha)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Motivo</p>
                <p className="text-sm font-medium">{selectedItem.motivo}</p>
              </div>
            </div>
            {(selectedItem.peso || selectedItem.talla || selectedItem.perimetro_cefalico) && (
              <div className="grid grid-cols-3 gap-4">
                {selectedItem.peso && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted mb-1">Peso</p>
                    <p className="text-sm font-medium">{selectedItem.peso} kg</p>
                  </div>
                )}
                {selectedItem.talla && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted mb-1">Talla</p>
                    <p className="text-sm font-medium">{selectedItem.talla} cm</p>
                  </div>
                )}
                {selectedItem.perimetro_cefalico && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-muted mb-1">Perímetro Cefálico</p>
                    <p className="text-sm font-medium">{selectedItem.perimetro_cefalico} cm</p>
                  </div>
                )}
              </div>
            )}
            {selectedItem.diagnostico && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Diagnóstico</p>
                <p className="text-sm">{selectedItem.diagnostico}</p>
              </div>
            )}
            {selectedItem.tratamiento && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Tratamiento</p>
                <p className="text-sm">{selectedItem.tratamiento}</p>
              </div>
            )}
            {selectedItem.observaciones && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted mb-1">Observaciones</p>
                <p className="text-sm">{selectedItem.observaciones}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Prescription Print Modal */}
      <Modal open={printRecetaModal} onClose={() => setPrintRecetaModal(false)} title="Receta Médica" size="lg">
        {selectedItem && selectedPaciente && (
          <div id="receta-print" className="bg-white">
            <div className="border-4 border-double" style={{ borderColor: "var(--baby-cyan)" }}>
              <div className="p-8">
                <div className="flex items-start justify-between mb-6 pb-4 border-b-2" style={{ borderColor: "var(--baby-pink)" }}>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      <span style={{ color: "var(--baby-pink)" }}>Baby</span>
                      <span style={{ color: "var(--baby-cyan)" }}>Tips</span>
                    </h1>
                    <p className="text-sm text-muted">Tu Pediatra Con Estilo</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold">{consultorioInfo.nombre}</p>
                    <p className="text-muted">{consultorioInfo.direccion}</p>
                    <p className="text-muted">Tel: {consultorioInfo.telefono}</p>
                    <p className="text-muted">{consultorioInfo.email}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3" style={{ color: "var(--baby-cyan)" }}>RECETA MÉDICA</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Paciente:</strong> {selectedPaciente.nombre} {selectedPaciente.apellidos}</p>
                      <p><strong>Edad:</strong> {calcularEdad(selectedPaciente.fecha_nacimiento)}</p>
                    </div>
                    <div>
                      <p><strong>Fecha:</strong> {formatDate(new Date().toISOString().split("T")[0])}</p>
                      <p><strong>Tipo de Sangre:</strong> {selectedPaciente.tipo_sangre}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <p className="text-xs text-muted mb-1">MEDICAMENTO</p>
                    <p className="text-xl font-bold" style={{ color: "var(--baby-pink)" }}>{selectedItem.medicamento}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted mb-1">DOSIS</p>
                      <p className="font-semibold">{selectedItem.dosis}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">FRECUENCIA</p>
                      <p className="font-semibold">{selectedItem.frecuencia}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">DURACIÓN</p>
                      <p className="font-semibold">{selectedItem.duracion}</p>
                    </div>
                  </div>
                  {selectedItem.indicaciones && (
                    <div>
                      <p className="text-xs text-muted mb-1">INDICACIONES</p>
                      <p className="text-sm">{selectedItem.indicaciones}</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-6 border-t border-gray-300">
                  <div className="text-center">
                    <div className="inline-block border-t-2 border-gray-400 px-12 pt-2">
                      <p className="font-semibold">Dra. Pediatra</p>
                      <p className="text-sm text-muted">Pediatría General</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-xs text-center text-muted">
                  <p>Esta receta es válida por 30 días desde la fecha de emisión</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => setPrintRecetaModal(false)} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cerrar</button>
          <button onClick={() => window.print()} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </Modal>

      {/* Modal Crecimiento */}
      <Modal open={crecimientoModal} onClose={() => { setCrecimientoModal(false); setEditingItem(null); }} title={editingItem ? "Editar Registro de Crecimiento" : "Nuevo Registro de Crecimiento"}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800">Los datos de crecimiento se comparan con los percentiles de la OMS para evaluar el desarrollo del niño.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha *</label>
              <input type="date" value={crecimientoForm.fecha} onChange={(e) => setCrecimientoForm({ ...crecimientoForm, fecha: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Edad (meses) *</label>
              <input type="number" value={crecimientoForm.edad_meses} onChange={(e) => setCrecimientoForm({ ...crecimientoForm, edad_meses: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 6" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
              <input type="number" step="0.01" value={crecimientoForm.peso} onChange={(e) => setCrecimientoForm({ ...crecimientoForm, peso: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 7.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Talla (cm) *</label>
              <input type="number" step="0.1" value={crecimientoForm.talla} onChange={(e) => setCrecimientoForm({ ...crecimientoForm, talla: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 68.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Perímetro Cefálico (cm)</label>
              <input type="number" step="0.1" value={crecimientoForm.perimetro_cefalico} onChange={(e) => setCrecimientoForm({ ...crecimientoForm, perimetro_cefalico: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: 44.2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">IMC</label>
              <input type="number" step="0.1" value={crecimientoForm.imc} onChange={(e) => setCrecimientoForm({ ...crecimientoForm, imc: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Calculado automáticamente" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setCrecimientoModal(false); setEditingItem(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSaveCrecimiento} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>

      {/* Modal Evaluaciones Psicosociales */}
      <Modal open={evaluacionModal} onClose={() => { setEvaluacionModal(false); setEditingItem(null); }} title={editingItem ? "Editar Evaluación Psicosocial" : "Nueva Evaluación Psicosocial"}>
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-purple-800">Las evaluaciones psicosociales permiten monitorear el desarrollo emocional, social y cognitivo del niño.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha *</label>
            <input type="date" value={evaluacionForm.fecha} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, fecha: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Área de Evaluación *</label>
            <select value={evaluacionForm.area} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, area: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
              <option value="">Seleccionar área...</option>
              <option value="Desarrollo Motor">Desarrollo Motor</option>
              <option value="Desarrollo del Lenguaje">Desarrollo del Lenguaje</option>
              <option value="Desarrollo Social">Desarrollo Social</option>
              <option value="Desarrollo Cognitivo">Desarrollo Cognitivo</option>
              <option value="Desarrollo Emocional">Desarrollo Emocional</option>
              <option value="Conducta">Conducta</option>
              <option value="Aprendizaje">Aprendizaje</option>
              <option value="Atención">Atención</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Puntaje / Resultado</label>
            <input type="text" value={evaluacionForm.puntaje} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, puntaje: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Ej: Normal, 85/100, Adecuado para la edad" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea value={evaluacionForm.observaciones} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, observaciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Detalles de la evaluación, hallazgos importantes..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recomendaciones</label>
            <textarea value={evaluacionForm.recomendaciones} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, recomendaciones: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Sugerencias para padres, seguimiento, intervenciones..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button onClick={() => { setEvaluacionModal(false); setEditingItem(null); }} className="btn-secondary px-4 py-2 rounded-lg text-sm">Cancelar</button>
          <button onClick={handleSaveEvaluacion} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}

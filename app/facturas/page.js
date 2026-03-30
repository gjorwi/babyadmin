"use client";
import { useState } from "react";
import { Search, DollarSign, CreditCard, FileText, Plus, Eye, Edit, Trash2, TrendingUp, AlertCircle, CheckCircle, Clock, XCircle, Wallet, Users, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import { pacientes, facturas as facturasData, pagos as pagosData, consultas } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

export default function FacturasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [facturasList, setFacturasList] = useState(facturasData);
  const [pagosList, setPagosList] = useState(pagosData);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [facturaModal, setFacturaModal] = useState(false);
  const [pagoModal, setPagoModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [filterEstado, setFilterEstado] = useState("todas");

  const emptyFactura = {
    numero_factura: "",
    fecha: new Date().toISOString().split("T")[0],
    id_paciente: "",
    id_consulta: "",
    monto_total: "",
    moneda: "dolar",
    metodo_pago: "contado",
    tipo_pago: "fisico",
    estado: "pendiente",
    saldo_pendiente: "",
    usuario_registro: "Dra. Pediatra",
    notas: ""
  };

  const emptyPago = {
    fecha_pago: new Date().toISOString().split("T")[0],
    monto: "",
    moneda: "dolar",
    tipo_pago: "fisico",
    referencia: "",
    usuario_registro: "Dra. Pediatra",
    notas: ""
  };

  const [facturaForm, setFacturaForm] = useState(emptyFactura);
  const [pagoForm, setPagoForm] = useState(emptyPago);

  const filteredPacientes = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFacturasPaciente = (idPaciente) => {
    return facturasList.filter(f => f.id_paciente === idPaciente);
  };

  const getPagosByFactura = (idFactura) => {
    return pagosList.filter(p => p.id_factura === idFactura);
  };

  const calcularEstadoCuenta = (idPaciente) => {
    const facturasPaciente = getFacturasPaciente(idPaciente);
    const totalFacturado = facturasPaciente.reduce((sum, f) => sum + f.monto_total, 0);
    const totalPagado = facturasPaciente.reduce((sum, f) => sum + (f.monto_total - f.saldo_pendiente), 0);
    const saldoPendiente = facturasPaciente.reduce((sum, f) => sum + f.saldo_pendiente, 0);
    
    return {
      debe: totalFacturado,
      haber: totalPagado,
      saldo: saldoPendiente
    };
  };

  const handleSaveFactura = () => {
    if (!facturaForm.id_paciente || !facturaForm.monto_total) {
      alert("Complete los campos requeridos");
      return;
    }

    const montoTotal = parseFloat(facturaForm.monto_total);
    const saldoPendiente = facturaForm.metodo_pago === "contado" ? 0 : montoTotal;
    const estado = facturaForm.metodo_pago === "contado" ? "pagada" : "pendiente";

    if (editingItem) {
      setFacturasList(facturasList.map(f => 
        f.id_factura === editingItem.id_factura 
          ? { ...facturaForm, id_factura: f.id_factura, saldo_pendiente, estado }
          : f
      ));
    } else {
      const newFactura = {
        ...facturaForm,
        id_factura: Math.max(...facturasList.map(f => f.id_factura)) + 1,
        numero_factura: `FAC-2025-${String(facturasList.length + 1).padStart(3, '0')}`,
        saldo_pendiente,
        estado
      };
      setFacturasList([...facturasList, newFactura]);

      if (facturaForm.metodo_pago === "contado") {
        const newPago = {
          id_pago: Math.max(...pagosList.map(p => p.id_pago)) + 1,
          id_factura: newFactura.id_factura,
          fecha_pago: facturaForm.fecha,
          monto: montoTotal,
          moneda: facturaForm.moneda,
          tipo_pago: facturaForm.tipo_pago,
          referencia: "PAGO COMPLETO",
          usuario_registro: facturaForm.usuario_registro,
          notas: "Pago completo al contado"
        };
        setPagosList([...pagosList, newPago]);
      }
    }

    setFacturaModal(false);
    setEditingItem(null);
    setFacturaForm(emptyFactura);
  };

  const handleSavePago = () => {
    if (!pagoForm.monto || !selectedFactura) {
      alert("Complete los campos requeridos");
      return;
    }

    const montoPago = parseFloat(pagoForm.monto);
    const factura = facturasList.find(f => f.id_factura === selectedFactura.id_factura);

    if (montoPago > factura.saldo_pendiente) {
      alert("El monto del pago no puede ser mayor al saldo pendiente");
      return;
    }

    const newPago = {
      ...pagoForm,
      id_pago: Math.max(...pagosList.map(p => p.id_pago)) + 1,
      id_factura: selectedFactura.id_factura
    };

    setPagosList([...pagosList, newPago]);

    const nuevoSaldo = factura.saldo_pendiente - montoPago;
    const nuevoEstado = nuevoSaldo === 0 ? "pagada" : "abonada";

    setFacturasList(facturasList.map(f =>
      f.id_factura === selectedFactura.id_factura
        ? { ...f, saldo_pendiente: nuevoSaldo, estado: nuevoEstado }
        : f
    ));

    setPagoModal(false);
    setPagoForm(emptyPago);
    setSelectedFactura(null);
  };

  const handleDeleteFactura = (id) => {
    if (confirm("¿Eliminar esta factura?")) {
      setFacturasList(facturasList.filter(f => f.id_factura !== id));
      setPagosList(pagosList.filter(p => p.id_factura !== id));
    }
  };

  const handleEditFactura = (factura) => {
    setEditingItem(factura);
    setFacturaForm(factura);
    setFacturaModal(true);
  };

  const handleVerDetalle = (factura) => {
    setSelectedFactura(factura);
    setDetailModal(true);
  };

  const handleAbonar = (factura) => {
    setSelectedFactura(factura);
    setPagoForm({ ...emptyPago, moneda: factura.moneda });
    setPagoModal(true);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pagada: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Pagada" },
      pendiente: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pendiente" },
      abonada: { color: "bg-blue-100 text-blue-700", icon: TrendingUp, text: "Abonada" },
      vencida: { color: "bg-red-100 text-red-700", icon: XCircle, text: "Vencida" }
    };
    const badge = badges[estado] || badges.pendiente;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const filteredFacturas = selectedPaciente 
    ? getFacturasPaciente(selectedPaciente.id_paciente).filter(f => 
        filterEstado === "todas" || f.estado === filterEstado
      )
    : [];

  const estadoCuenta = selectedPaciente ? calcularEstadoCuenta(selectedPaciente.id_paciente) : null;

  return (
    <div className="p-3 sm:p-6">
      <PageHeader 
        title="Facturación y Cobros" 
        subtitle="Gestión de facturas, pagos y estado de cuenta de pacientes"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pacientes</h3>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredPacientes.map(paciente => {
              const estado = calcularEstadoCuenta(paciente.id_paciente);
              const tieneDeuda = estado.saldo > 0;
              
              return (
                <div
                  key={paciente.id_paciente}
                  onClick={() => setSelectedPaciente(paciente)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPaciente?.id_paciente === paciente.id_paciente
                      ? "bg-baby-cyan bg-opacity-10 border-baby-cyan"
                      : "border-border hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{paciente.nombre} {paciente.apellidos}</p>
                      <p className="text-xs text-muted">ID: {paciente.id_paciente}</p>
                    </div>
                    {tieneDeuda && (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                  </div>
                  {tieneDeuda && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-orange-600 font-medium">
                        Saldo: ${estado.saldo.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPaciente ? (
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedPaciente.nombre} {selectedPaciente.apellidos}
                    </h3>
                    <p className="text-sm text-muted">Estado de Cuenta</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setFacturaForm({ ...emptyFactura, id_paciente: selectedPaciente.id_paciente });
                      setFacturaModal(true);
                    }}
                    className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Factura
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-blue-600 font-medium">DEBE</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      ${estadoCuenta?.debe.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted mt-1">Total facturado</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">HABER</p>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      ${estadoCuenta?.haber.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted mt-1">Total pagado</p>
                  </div>

                  <div className={`rounded-lg p-4 ${estadoCuenta?.saldo > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className={`w-5 h-5 ${estadoCuenta?.saldo > 0 ? 'text-orange-600' : 'text-gray-600'}`} />
                      <p className={`text-xs font-medium ${estadoCuenta?.saldo > 0 ? 'text-orange-600' : 'text-gray-600'}`}>SALDO</p>
                    </div>
                    <p className={`text-2xl font-bold ${estadoCuenta?.saldo > 0 ? 'text-orange-700' : 'text-gray-700'}`}>
                      ${estadoCuenta?.saldo.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted mt-1">Pendiente de pago</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Facturas</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value)}
                      className="border border-border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="todas">Todas</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="abonada">Abonadas</option>
                      <option value="pagada">Pagadas</option>
                      <option value="vencida">Vencidas</option>
                    </select>
                  </div>
                </div>

                {filteredFacturas.length > 0 ? (
                  <div className="space-y-3">
                    {filteredFacturas.map(factura => {
                      const pagosFactura = getPagosByFactura(factura.id_factura);
                      const consulta = consultas.find(c => c.id_consulta === factura.id_consulta);
                      
                      return (
                        <div key={factura.id_factura} className="border border-border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-semibold">{factura.numero_factura}</p>
                                {getEstadoBadge(factura.estado)}
                              </div>
                              <p className="text-sm text-muted mb-1">
                                Fecha: {formatDate(factura.fecha)}
                              </p>
                              {consulta && (
                                <p className="text-xs text-muted">
                                  Consulta: {consulta.motivo}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold" style={{ color: "var(--baby-pink)" }}>
                                {factura.moneda === "dolar" ? "$" : "Bs."} {factura.monto_total.toFixed(2)}
                              </p>
                              {factura.saldo_pendiente > 0 && (
                                <p className="text-sm text-orange-600 font-medium">
                                  Pendiente: {factura.moneda === "dolar" ? "$" : "Bs."} {factura.saldo_pendiente.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted mb-3">
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {factura.metodo_pago === "contado" ? "De Contado" : factura.metodo_pago === "credito" ? "A Crédito" : "Mixto"}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {factura.moneda === "dolar" ? "USD" : "Bs."}
                            </span>
                            {pagosFactura.length > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {pagosFactura.length} pago{pagosFactura.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => handleVerDetalle(factura)}
                              className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Ver Detalle</span>
                            </button>
                            {factura.saldo_pendiente > 0 && (
                              <button
                                onClick={() => handleAbonar(factura)}
                                className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 flex items-center justify-center gap-2"
                              >
                                <DollarSign className="w-4 h-4" />
                                <span>Abonar</span>
                              </button>
                            )}
                            <div className="flex gap-2 sm:gap-1">
                              <button
                                onClick={() => handleEditFactura(factura)}
                                className="flex-1 sm:flex-none p-2 rounded-lg hover:bg-cyan-50 flex items-center justify-center gap-1"
                              >
                                <Edit className="w-4 h-4 text-cyan-600" />
                                <span className="text-xs sm:hidden">Editar</span>
                              </button>
                              <button
                                onClick={() => handleDeleteFactura(factura.id_factura)}
                                className="flex-1 sm:flex-none p-2 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                                <span className="text-xs sm:hidden">Eliminar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No hay facturas registradas</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-border p-12 text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted opacity-30" />
              <p className="text-muted text-lg">Seleccione un paciente para ver sus facturas</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={facturaModal}
        onClose={() => {
          setFacturaModal(false);
          setEditingItem(null);
          setFacturaForm(emptyFactura);
        }}
        title=""
        size="lg"
      >
        <div className="relative">
          <div className="bg-gradient-to-br from-baby-pink via-purple-500 to-baby-cyan p-4 sm:p-8 -m-6 mb-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
                  <DollarSign className="w-7 h-7 sm:w-8 sm:h-8" />
                  Caja de Ventas
                </h2>
                <p className="text-xs sm:text-sm opacity-90">Registra el cobro de manera rápida y sencilla</p>
              </div>
              <div className="w-full sm:w-auto">
                <p className="text-xs opacity-75 mb-1">Fecha</p>
                <input
                  type="date"
                  value={facturaForm.fecha}
                  onChange={(e) => setFacturaForm({ ...facturaForm, fecha: e.target.value })}
                  className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1.5 text-sm text-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 sm:p-5 border-2 border-baby-cyan/30">
              <label className="flex items-center gap-2 text-xs font-bold text-baby-cyan uppercase tracking-wide mb-2">
                <Users className="w-4 h-4" />
                Cliente
              </label>
              <select
                value={facturaForm.id_paciente}
                onChange={(e) => setFacturaForm({ ...facturaForm, id_paciente: parseInt(e.target.value) })}
                className="w-full border-2 border-baby-cyan/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-semibold focus:border-baby-cyan focus:ring-2 focus:ring-baby-cyan/20 transition-all"
                disabled={!!selectedPaciente}
              >
                <option value="">Seleccionar paciente...</option>
                {pacientes.map(p => (
                  <option key={p.id_paciente} value={p.id_paciente}>
                    {p.nombre} {p.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border-2 border-green-400/30">
                <label className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-wide mb-3">
                  <DollarSign className="w-4 h-4" />
                  Monto a Cobrar
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-bold text-green-600">
                    {facturaForm.moneda === "dolar" ? "$" : "Bs."}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={facturaForm.monto_total}
                    onChange={(e) => setFacturaForm({ ...facturaForm, monto_total: e.target.value })}
                    className="w-full border-2 border-green-400/50 rounded-xl pl-12 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 text-2xl sm:text-3xl font-bold text-green-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border-2 border-purple-400/30">
                <label className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wide mb-3">
                  <Wallet className="w-4 h-4" />
                  Moneda
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFacturaForm({ ...facturaForm, moneda: "dolar" })}
                    className={`py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      facturaForm.moneda === "dolar"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                        : "bg-white border-2 border-purple-200 text-purple-600 hover:border-purple-400"
                    }`}
                  >
                    USD
                  </button>
                  <button
                    type="button"
                    onClick={() => setFacturaForm({ ...facturaForm, moneda: "bolivares" })}
                    className={`py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      facturaForm.moneda === "bolivares"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                        : "bg-white border-2 border-purple-200 text-purple-600 hover:border-purple-400"
                    }`}
                  >
                    Bs.
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 sm:p-5 border-2 border-orange-400/30">
              <label className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wide mb-3">
                <CreditCard className="w-4 h-4" />
                Forma de Pago
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFacturaForm({ ...facturaForm, metodo_pago: "contado" })}
                  className={`py-3 sm:py-4 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    facturaForm.metodo_pago === "contado"
                      ? "bg-gradient-to-r from-baby-pink to-pink-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-orange-200 text-orange-600 hover:border-orange-400"
                  }`}
                >
                  Contado
                </button>
                <button
                  type="button"
                  onClick={() => setFacturaForm({ ...facturaForm, metodo_pago: "credito" })}
                  className={`py-3 sm:py-4 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    facturaForm.metodo_pago === "credito"
                      ? "bg-gradient-to-r from-baby-pink to-pink-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-orange-200 text-orange-600 hover:border-orange-400"
                  }`}
                >
                  Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setFacturaForm({ ...facturaForm, metodo_pago: "mixto" })}
                  className={`py-3 sm:py-4 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    facturaForm.metodo_pago === "mixto"
                      ? "bg-gradient-to-r from-baby-pink to-pink-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-orange-200 text-orange-600 hover:border-orange-400"
                  }`}
                >
                  Mixto
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-5 border-2 border-cyan-400/30">
              <label className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wide mb-3">
                <Wallet className="w-4 h-4" />
                Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFacturaForm({ ...facturaForm, tipo_pago: "fisico" })}
                  className={`py-4 sm:py-5 rounded-xl font-bold transition-all ${
                    facturaForm.tipo_pago === "fisico"
                      ? "bg-gradient-to-r from-baby-cyan to-cyan-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-cyan-200 text-cyan-600 hover:border-cyan-400"
                  }`}
                >
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                  <div className="text-xs">Efectivo</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFacturaForm({ ...facturaForm, tipo_pago: "transferencia" })}
                  className={`py-4 sm:py-5 rounded-xl font-bold transition-all ${
                    facturaForm.tipo_pago === "transferencia"
                      ? "bg-gradient-to-r from-baby-cyan to-cyan-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-cyan-200 text-cyan-600 hover:border-cyan-400"
                  }`}
                >
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                  <div className="text-xs">Transferencia</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFacturaForm({ ...facturaForm, tipo_pago: "pago_movil" })}
                  className={`py-4 sm:py-5 rounded-xl font-bold transition-all ${
                    facturaForm.tipo_pago === "pago_movil"
                      ? "bg-gradient-to-r from-baby-cyan to-cyan-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-cyan-200 text-cyan-600 hover:border-cyan-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                  <div className="text-xs">Pago Móvil</div>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
                <FileText className="w-4 h-4" />
                Consulta Asociada (Opcional)
              </label>
              <select
                value={facturaForm.id_consulta || ""}
                onChange={(e) => setFacturaForm({ ...facturaForm, id_consulta: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Sin consulta asociada</option>
                {consultas
                  .filter(c => !facturaForm.id_paciente || c.id_paciente === facturaForm.id_paciente)
                  .map(c => (
                    <option key={c.id_consulta} value={c.id_consulta}>
                      {formatDate(c.fecha)} - {c.motivo}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
                <Edit className="w-4 h-4" />
                Notas Adicionales
              </label>
              <textarea
                value={facturaForm.notas}
                onChange={(e) => setFacturaForm({ ...facturaForm, notas: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                rows={2}
                placeholder="Observaciones, detalles del servicio..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t-2 border-gray-200">
            <button
              onClick={() => {
                setFacturaModal(false);
                setEditingItem(null);
                setFacturaForm(emptyFactura);
              }}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button 
              onClick={handleSaveFactura} 
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-baby-pink via-purple-500 to-baby-cyan hover:shadow-2xl text-white rounded-xl text-sm sm:text-base font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Registrar Cobro
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={pagoModal}
        onClose={() => {
          setPagoModal(false);
          setPagoForm(emptyPago);
          setSelectedFactura(null);
        }}
        title="Registrar Pago / Abono"
      >
        {selectedFactura && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Factura: {selectedFactura.numero_factura}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Monto Total:</p>
                  <p className="font-semibold">
                    {selectedFactura.moneda === "dolar" ? "$" : "Bs."} {selectedFactura.monto_total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Saldo Pendiente:</p>
                  <p className="font-semibold text-orange-600">
                    {selectedFactura.moneda === "dolar" ? "$" : "Bs."} {selectedFactura.saldo_pendiente.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Pago *</label>
              <input
                type="date"
                value={pagoForm.fecha_pago}
                onChange={(e) => setPagoForm({ ...pagoForm, fecha_pago: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monto a Pagar *</label>
                <input
                  type="number"
                  step="0.01"
                  value={pagoForm.monto}
                  onChange={(e) => setPagoForm({ ...pagoForm, monto: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="0.00"
                  max={selectedFactura.saldo_pendiente}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Pago *</label>
                <select
                  value={pagoForm.tipo_pago}
                  onChange={(e) => setPagoForm({ ...pagoForm, tipo_pago: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="fisico">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="pago_movil">Pago Móvil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Referencia</label>
              <input
                type="text"
                value={pagoForm.referencia}
                onChange={(e) => setPagoForm({ ...pagoForm, referencia: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Número de referencia, confirmación..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                value={pagoForm.notas}
                onChange={(e) => setPagoForm({ ...pagoForm, notas: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                rows={2}
                placeholder="Observaciones del pago..."
              />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={() => {
              setPagoModal(false);
              setPagoForm(emptyPago);
              setSelectedFactura(null);
            }}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
          <button onClick={handleSavePago} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">
            Registrar Pago
          </button>
        </div>
      </Modal>

      <Modal
        open={detailModal}
        onClose={() => {
          setDetailModal(false);
          setSelectedFactura(null);
        }}
        title="Detalle de Factura"
        size="lg"
      >
        {selectedFactura && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-baby-pink to-baby-cyan p-6 rounded-lg text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedFactura.numero_factura}</h3>
                  <p className="text-sm opacity-90">Fecha: {formatDate(selectedFactura.fecha)}</p>
                </div>
                {getEstadoBadge(selectedFactura.estado)}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs opacity-75">MONTO TOTAL</p>
                  <p className="text-xl font-bold">
                    {selectedFactura.moneda === "dolar" ? "$" : "Bs."} {selectedFactura.monto_total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75">PAGADO</p>
                  <p className="text-xl font-bold">
                    {selectedFactura.moneda === "dolar" ? "$" : "Bs."} {(selectedFactura.monto_total - selectedFactura.saldo_pendiente).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75">PENDIENTE</p>
                  <p className="text-xl font-bold">
                    {selectedFactura.moneda === "dolar" ? "$" : "Bs."} {selectedFactura.saldo_pendiente.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-1">PACIENTE</p>
                <p className="font-semibold">
                  {pacientes.find(p => p.id_paciente === selectedFactura.id_paciente)?.nombre}{" "}
                  {pacientes.find(p => p.id_paciente === selectedFactura.id_paciente)?.apellidos}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-1">MÉTODO DE PAGO</p>
                <p className="font-semibold capitalize">{selectedFactura.metodo_pago}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-1">MONEDA</p>
                <p className="font-semibold">{selectedFactura.moneda === "dolar" ? "Dólares (USD)" : "Bolívares (Bs.)"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted mb-1">REGISTRADO POR</p>
                <p className="font-semibold">{selectedFactura.usuario_registro}</p>
              </div>
            </div>

            {selectedFactura.notas && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-muted mb-1">NOTAS</p>
                <p className="text-sm">{selectedFactura.notas}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Historial de Pagos
              </h4>
              
              {getPagosByFactura(selectedFactura.id_factura).length > 0 ? (
                <div className="space-y-3">
                  {getPagosByFactura(selectedFactura.id_factura).map((pago, index) => (
                    <div key={pago.id_pago} className="border border-border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-700 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {pago.moneda === "dolar" ? "$" : "Bs."} {pago.monto.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted">{formatDate(pago.fecha_pago)}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          {pago.tipo_pago === "fisico" ? "Efectivo" : pago.tipo_pago === "transferencia" ? "Transferencia" : "Pago Móvil"}
                        </span>
                      </div>
                      {pago.referencia && (
                        <p className="text-xs text-muted mb-1">
                          <span className="font-medium">Ref:</span> {pago.referencia}
                        </p>
                      )}
                      {pago.notas && (
                        <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                          {pago.notas}
                        </p>
                      )}
                      <p className="text-xs text-muted mt-2">
                        Registrado por: {pago.usuario_registro}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 text-muted opacity-30" />
                  <p className="text-sm text-muted">No hay pagos registrados</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={() => {
              setDetailModal(false);
              setSelectedFactura(null);
            }}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
}

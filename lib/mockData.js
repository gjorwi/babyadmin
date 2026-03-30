export const pacientes = [
  {
    id_paciente: 1, nombre: "Sofia", apellidos: "Garcia Lopez",
    fecha_nacimiento: "2024-03-15", sexo: "F",
    direccion: "Av. Principal #123, Col. Centro", telefono: "555-0101",
    email: "garcia.familia@email.com", alergias: "Ninguna conocida",
    tipo_sangre: "O+", created_at: "2024-03-20", updated_at: "2025-01-10",
  },
  {
    id_paciente: 2, nombre: "Mateo", apellidos: "Rodriguez Sanchez",
    fecha_nacimiento: "2023-07-22", sexo: "M",
    direccion: "Calle 5 de Mayo #456", telefono: "555-0202",
    email: "rodriguez.mat@email.com", alergias: "Penicilina",
    tipo_sangre: "A+", created_at: "2023-08-01", updated_at: "2025-02-15",
  },
  {
    id_paciente: 3, nombre: "Valentina", apellidos: "Martinez Ruiz",
    fecha_nacimiento: "2025-01-10", sexo: "F",
    direccion: "Blvd. Las Flores #789", telefono: "555-0303",
    email: "martinez.val@email.com", alergias: "Ninguna conocida",
    tipo_sangre: "B+", created_at: "2025-01-15", updated_at: "2025-03-01",
  },
  {
    id_paciente: 4, nombre: "Diego", apellidos: "Hernandez Torres",
    fecha_nacimiento: "2022-11-05", sexo: "M",
    direccion: "Calle Roble #321", telefono: "555-0404",
    email: "hernandez.d@email.com", alergias: "Sulfas",
    tipo_sangre: "AB+", created_at: "2022-12-01", updated_at: "2025-01-20",
  },
  {
    id_paciente: 5, nombre: "Isabella", apellidos: "Lopez Mendoza",
    fecha_nacimiento: "2024-06-18", sexo: "F",
    direccion: "Av. Universidad #654", telefono: "555-0505",
    email: "lopez.isa@email.com", alergias: "Ninguna conocida",
    tipo_sangre: "O-", created_at: "2024-07-01", updated_at: "2025-02-28",
  },
];

export const padres = [
  { id_padre: 1, nombre: "Maria Lopez Fernandez", telefono: "555-0101", email: "maria.lopez@email.com", relacion: "Madre" },
  { id_padre: 2, nombre: "Carlos Garcia Perez", telefono: "555-0102", email: "carlos.garcia@email.com", relacion: "Padre" },
  { id_padre: 3, nombre: "Ana Sanchez Diaz", telefono: "555-0202", email: "ana.sanchez@email.com", relacion: "Madre" },
  { id_padre: 4, nombre: "Laura Ruiz Gomez", telefono: "555-0303", email: "laura.ruiz@email.com", relacion: "Madre" },
  { id_padre: 5, nombre: "Pedro Martinez Silva", telefono: "555-0304", email: "pedro.mtz@email.com", relacion: "Padre" },
  { id_padre: 6, nombre: "Roberto Hernandez Vega", telefono: "555-0404", email: "roberto.h@email.com", relacion: "Padre" },
  { id_padre: 7, nombre: "Carmen Torres Luna", telefono: "555-0405", email: "carmen.t@email.com", relacion: "Madre" },
  { id_padre: 8, nombre: "Elena Mendoza Rios", telefono: "555-0505", email: "elena.m@email.com", relacion: "Madre" },
];

export const pacientePadres = [
  { id_paciente: 1, id_padre: 1, principal: true },
  { id_paciente: 1, id_padre: 2, principal: false },
  { id_paciente: 2, id_padre: 3, principal: true },
  { id_paciente: 3, id_padre: 4, principal: true },
  { id_paciente: 3, id_padre: 5, principal: false },
  { id_paciente: 4, id_padre: 6, principal: false },
  { id_paciente: 4, id_padre: 7, principal: true },
  { id_paciente: 5, id_padre: 8, principal: true },
];

export const citas = [
  { id_cita: 1, id_paciente: 1, fecha_hora: "2025-03-20T09:00", motivo: "Control de crecimiento", estado: "programada" },
  { id_cita: 2, id_paciente: 2, fecha_hora: "2025-03-20T10:00", motivo: "Fiebre y tos", estado: "confirmada" },
  { id_cita: 3, id_paciente: 3, fecha_hora: "2025-03-20T11:00", motivo: "Vacunacion 2 meses", estado: "programada" },
  { id_cita: 4, id_paciente: 4, fecha_hora: "2025-03-19T09:00", motivo: "Revision anual", estado: "atendida" },
  { id_cita: 5, id_paciente: 5, fecha_hora: "2025-03-19T10:30", motivo: "Control de peso", estado: "atendida" },
  { id_cita: 6, id_paciente: 1, fecha_hora: "2025-03-18T14:00", motivo: "Dolor abdominal", estado: "atendida" },
  { id_cita: 7, id_paciente: 2, fecha_hora: "2025-03-21T09:00", motivo: "Seguimiento tratamiento", estado: "programada" },
  { id_cita: 8, id_paciente: 3, fecha_hora: "2025-03-17T11:00", motivo: "Control recien nacido", estado: "no asistio" },
  { id_cita: 9, id_paciente: 4, fecha_hora: "2025-03-22T15:00", motivo: "Alergia en piel", estado: "programada" },
  { id_cita: 10, id_paciente: 5, fecha_hora: "2025-03-16T10:00", motivo: "Vacunacion", estado: "cancelada" },
];

export const consultas = [
  {
    id_consulta: 1, id_paciente: 4, id_cita: 4, fecha: "2025-03-19",
    motivo: "Revision anual", enfermedad_actual: "Sin enfermedad actual. Paciente acude a revision de rutina.",
    peso: 15.2, talla: 92.5, pc: null,
    diagnostico: "Nino sano. Desarrollo adecuado para la edad.",
    tratamiento: "No requiere tratamiento. Continuar alimentacion balanceada.",
    observaciones: "Desarrollo psicomotor adecuado. Lenguaje apropiado para la edad.",
  },
  {
    id_consulta: 2, id_paciente: 5, id_cita: 5, fecha: "2025-03-19",
    motivo: "Control de peso", enfermedad_actual: "Madre refiere que la paciente ha bajado de peso en las ultimas 2 semanas.",
    peso: 7.8, talla: 67.0, pc: 42.5,
    diagnostico: "Peso bajo para la edad. Posible intolerancia alimentaria.",
    tratamiento: "Formula hipoalergenica. Control en 2 semanas.",
    observaciones: "Solicitar estudios de laboratorio para descartar intolerancia.",
  },
  {
    id_consulta: 3, id_paciente: 1, id_cita: 6, fecha: "2025-03-18",
    motivo: "Dolor abdominal", enfermedad_actual: "Madre refiere dolor abdominal de 2 dias de evolucion, sin fiebre.",
    peso: 6.5, talla: 62.0, pc: 40.0,
    diagnostico: "Colicos del lactante",
    tratamiento: "Simeticona 0.5ml cada 8 horas por 5 dias. Masaje abdominal.",
    observaciones: "Se explican tecnicas de masaje abdominal a la madre.",
  },
];

export const recetas = [
  { id_receta: 1, id_consulta: 2, medicamento: "Formula hipoalergenica NAN HA", dosis: "120ml cada 3 horas", duracion: "Hasta nueva indicacion", instrucciones: "Preparar con agua hervida tibia. No mezclar con otros alimentos.", fecha: "2025-03-19", enviado: true },
  { id_receta: 2, id_consulta: 3, medicamento: "Simeticona gotas", dosis: "0.5ml cada 8 horas", duracion: "5 dias", instrucciones: "Administrar antes de cada toma de leche.", fecha: "2025-03-18", enviado: true },
  { id_receta: 3, id_consulta: 3, medicamento: "Probioticos infantiles", dosis: "5 gotas una vez al dia", duracion: "14 dias", instrucciones: "Administrar por la manana mezclado con leche.", fecha: "2025-03-18", enviado: true },
];

export const laboratorios = [
  { id_lab: 1, id_consulta: 2, prueba: "Biometria hematica completa", fecha_orden: "2025-03-19", fecha_resultado: null, resultado: null, archivo: null },
  { id_lab: 2, id_consulta: 2, prueba: "IgE especifica para leche de vaca", fecha_orden: "2025-03-19", fecha_resultado: null, resultado: null, archivo: null },
  { id_lab: 3, id_consulta: 1, prueba: "Examen general de orina", fecha_orden: "2025-03-19", fecha_resultado: "2025-03-20", resultado: "Normal. Sin alteraciones.", archivo: "resultado_ego_diego.pdf" },
];

export const vacunas = [
  { id_vacuna: 1, id_paciente: 1, nombre: "BCG", dosis: "Unica", fecha_aplicacion: "2024-03-16", fecha_proxima: null, lote: "BCG-2024-001", lugar: "Hospital General", observaciones: "" },
  { id_vacuna: 2, id_paciente: 1, nombre: "Hepatitis B", dosis: "1ra dosis", fecha_aplicacion: "2024-03-16", fecha_proxima: "2024-05-16", lote: "HB-2024-045", lugar: "Hospital General", observaciones: "" },
  { id_vacuna: 3, id_paciente: 1, nombre: "Hepatitis B", dosis: "2da dosis", fecha_aplicacion: "2024-05-15", fecha_proxima: "2024-09-15", lote: "HB-2024-112", lugar: "Consultorio BabyTips", observaciones: "" },
  { id_vacuna: 4, id_paciente: 2, nombre: "BCG", dosis: "Unica", fecha_aplicacion: "2023-07-23", fecha_proxima: null, lote: "BCG-2023-089", lugar: "Hospital Materno", observaciones: "" },
  { id_vacuna: 5, id_paciente: 2, nombre: "Pentavalente", dosis: "1ra dosis", fecha_aplicacion: "2023-09-22", fecha_proxima: "2023-11-22", lote: "PENTA-2023-034", lugar: "Consultorio BabyTips", observaciones: "" },
  { id_vacuna: 6, id_paciente: 2, nombre: "Pentavalente", dosis: "2da dosis", fecha_aplicacion: "2023-11-20", fecha_proxima: "2024-01-22", lote: "PENTA-2023-078", lugar: "Consultorio BabyTips", observaciones: "" },
  { id_vacuna: 7, id_paciente: 3, nombre: "BCG", dosis: "Unica", fecha_aplicacion: "2025-01-11", fecha_proxima: null, lote: "BCG-2025-003", lugar: "Hospital General", observaciones: "Aplicada al nacimiento" },
  { id_vacuna: 8, id_paciente: 4, nombre: "Influenza", dosis: "Refuerzo anual", fecha_aplicacion: "2024-10-15", fecha_proxima: "2025-10-15", lote: "INF-2024-567", lugar: "Consultorio BabyTips", observaciones: "" },
];

export const recomendaciones = [
  { id_recomendacion: 1, titulo: "Cuidados del recien nacido", contenido: "Lactancia materna exclusiva los primeros 6 meses. Bano diario con agua tibia. Cuidados del cordon umbilical: mantener limpio y seco. Posicion boca arriba para dormir.", edad_min: 0, edad_max: 1, activa: true },
  { id_recomendacion: 2, titulo: "Lactancia materna", contenido: "Ofrecer el pecho a libre demanda, minimo 8-12 veces al dia. Posiciones correctas de amamantamiento. Signos de buena succion. Cuidados del pezon.", edad_min: 0, edad_max: 6, activa: true },
  { id_recomendacion: 3, titulo: "Alimentacion complementaria", contenido: "Iniciar a los 6 meses. Comenzar con papillas de frutas y verduras. Introducir un alimento nuevo cada 3 dias. Evitar miel, sal y azucar antes del ano.", edad_min: 6, edad_max: 12, activa: true },
  { id_recomendacion: 4, titulo: "Sueno seguro", contenido: "Dormir boca arriba. Colchon firme sin almohadas ni peluches. Temperatura ambiente agradable. No compartir cama con adultos.", edad_min: 0, edad_max: 12, activa: true },
  { id_recomendacion: 5, titulo: "Desarrollo motor 1-2 anos", contenido: "Estimulacion temprana con juegos de gateo, caminar con apoyo. Permitir exploracion segura. Juguetes apropiados para la edad.", edad_min: 12, edad_max: 24, activa: true },
];

export const recomendacionesEntregadas = [
  { id_entrega: 1, id_consulta: 3, id_recomendacion: 1, fecha: "2025-03-18" },
  { id_entrega: 2, id_consulta: 3, id_recomendacion: 2, fecha: "2025-03-18" },
  { id_entrega: 3, id_consulta: 3, id_recomendacion: 4, fecha: "2025-03-18" },
];

export const recordatorios = [
  { id_recordatorio: 1, id_paciente: 1, tipo: "vacuna", fecha_envio: "2025-03-25T08:00", mensaje: "Recordatorio: Sofia tiene pendiente la 3ra dosis de Hepatitis B.", enviado: false, medio: "email" },
  { id_recordatorio: 2, id_paciente: 2, tipo: "cita", fecha_envio: "2025-03-20T08:00", mensaje: "Recordatorio: Mateo tiene cita manana a las 9:00 AM.", enviado: false, medio: "sms" },
  { id_recordatorio: 3, id_paciente: 3, tipo: "cumpleanos", fecha_envio: "2026-01-10T08:00", mensaje: "Feliz cumpleanos Valentina! El equipo de BabyTips le desea un maravilloso dia.", enviado: false, medio: "email" },
  { id_recordatorio: 4, id_paciente: 4, tipo: "seguimiento", fecha_envio: "2025-03-26T08:00", mensaje: "Recordatorio: Diego debe acudir a seguimiento por alergia en piel.", enviado: false, medio: "email" },
  { id_recordatorio: 5, id_paciente: 1, tipo: "cumpleanos", fecha_envio: "2026-03-15T08:00", mensaje: "Feliz cumpleanos Sofia! De parte del equipo BabyTips.", enviado: false, medio: "email" },
];

export const configuracion = [
  { id_config: 1, clave: "recordatorio_cita_horas", valor: "24" },
  { id_config: 2, clave: "recordatorio_vacuna_dias", valor: "7" },
  { id_config: 3, clave: "nombre_consultorio", valor: "BabyTips - Tu Pediatra Con Estilo" },
  { id_config: 4, clave: "direccion_consultorio", valor: "Av. de la Salud #100, Col. Medica" },
  { id_config: 5, clave: "telefono_consultorio", valor: "555-BABY-001" },
  { id_config: 6, clave: "email_consultorio", valor: "contacto@babytips.com" },
  { id_config: 7, clave: "horario_inicio", valor: "08:00" },
  { id_config: 8, clave: "horario_fin", valor: "18:00" },
  { id_config: 9, clave: "duracion_cita_minutos", valor: "30" },
  { id_config: 10, clave: "enviar_encuesta_satisfaccion", valor: "true" },
];

export const diagnosticosDetalle = [
  { id_detalle: 1, id_consulta: 1, codigo_cie10: "Z00.1", descripcion: "Examen de salud de rutina del nino" },
  { id_detalle: 2, id_consulta: 2, codigo_cie10: "R63.4", descripcion: "Perdida de peso anormal" },
  { id_detalle: 3, id_consulta: 2, codigo_cie10: "K52.2", descripcion: "Posible intolerancia alimentaria" },
  { id_detalle: 4, id_consulta: 3, codigo_cie10: "R10.4", descripcion: "Colico del lactante" },
];

export const estadisticasMensuales = [
  { mes: "Oct", consultas: 45, vacunas: 22, citas: 52 },
  { mes: "Nov", consultas: 52, vacunas: 28, citas: 58 },
  { mes: "Dic", consultas: 38, vacunas: 15, citas: 42 },
  { mes: "Ene", consultas: 55, vacunas: 30, citas: 60 },
  { mes: "Feb", consultas: 48, vacunas: 25, citas: 53 },
  { mes: "Mar", consultas: 32, vacunas: 18, citas: 38 },
];

export const facturas = [
  {
    id_factura: 1,
    id_consulta: 1,
    id_paciente: 4,
    numero_factura: "FAC-2025-001",
    fecha: "2025-03-19",
    monto_total: 50.00,
    moneda: "dolar",
    metodo_pago: "contado",
    estado: "pagada",
    saldo_pendiente: 0,
    usuario_registro: "Dra. Pediatra",
    notas: "Consulta de rutina - Pago completo"
  },
  {
    id_factura: 2,
    id_consulta: 2,
    id_paciente: 5,
    numero_factura: "FAC-2025-002",
    fecha: "2025-03-19",
    monto_total: 75.00,
    moneda: "dolar",
    metodo_pago: "credito",
    estado: "pendiente",
    saldo_pendiente: 75.00,
    usuario_registro: "Dra. Pediatra",
    notas: "Consulta especializada - A crédito"
  },
  {
    id_factura: 3,
    id_consulta: 3,
    id_paciente: 1,
    numero_factura: "FAC-2025-003",
    fecha: "2025-03-18",
    monto_total: 1200.00,
    moneda: "bolivares",
    metodo_pago: "mixto",
    estado: "abonada",
    saldo_pendiente: 600.00,
    usuario_registro: "Dra. Pediatra",
    notas: "Consulta + medicamentos - Pago mixto"
  },
  {
    id_factura: 4,
    id_consulta: null,
    id_paciente: 2,
    numero_factura: "FAC-2025-004",
    fecha: "2025-03-15",
    monto_total: 40.00,
    moneda: "dolar",
    metodo_pago: "contado",
    estado: "pagada",
    saldo_pendiente: 0,
    usuario_registro: "Dra. Pediatra",
    notas: "Vacunación - Pago en efectivo"
  },
  {
    id_factura: 5,
    id_consulta: null,
    id_paciente: 1,
    numero_factura: "FAC-2025-005",
    fecha: "2025-03-10",
    monto_total: 2500.00,
    moneda: "bolivares",
    metodo_pago: "credito",
    estado: "vencida",
    saldo_pendiente: 2500.00,
    usuario_registro: "Dra. Pediatra",
    notas: "Estudios de laboratorio - Vencida"
  }
];

export const pagos = [
  {
    id_pago: 1,
    id_factura: 1,
    fecha_pago: "2025-03-19",
    monto: 50.00,
    moneda: "dolar",
    tipo_pago: "fisico",
    referencia: "EFECTIVO",
    usuario_registro: "Dra. Pediatra",
    notas: "Pago completo en efectivo"
  },
  {
    id_pago: 2,
    id_factura: 3,
    fecha_pago: "2025-03-18",
    monto: 600.00,
    moneda: "bolivares",
    tipo_pago: "transferencia",
    referencia: "TRANS-123456789",
    usuario_registro: "Dra. Pediatra",
    notas: "Abono inicial - 50%"
  },
  {
    id_pago: 3,
    id_factura: 4,
    fecha_pago: "2025-03-15",
    monto: 40.00,
    moneda: "dolar",
    tipo_pago: "pago_movil",
    referencia: "PM-0414-9876543",
    usuario_registro: "Dra. Pediatra",
    notas: "Pago móvil Banesco"
  }
];

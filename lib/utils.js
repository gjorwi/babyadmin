import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "—";
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(dateTimeStr) {
  if (!dateTimeStr) return "—";
  const date = new Date(dateTimeStr);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "—";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento + "T00:00:00");
  let anos = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth() - nacimiento.getMonth();
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  if (hoy.getDate() < nacimiento.getDate()) {
    meses--;
    if (meses < 0) {
      anos--;
      meses += 12;
    }
  }
  if (anos === 0) {
    return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  }
  return `${anos} ${anos === 1 ? "ano" : "anos"}, ${meses} ${meses === 1 ? "mes" : "meses"}`;
}

export function calcularEdadMeses(fechaNacimiento) {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento + "T00:00:00");
  return (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
}

export function getEstadoBadgeClass(estado) {
  const map = {
    programada: "bg-blue-100 text-blue-700",
    confirmada: "bg-green-100 text-green-700",
    "en consulta": "bg-yellow-100 text-yellow-700",
    atendida: "bg-emerald-100 text-emerald-700",
    cancelada: "bg-red-100 text-red-700",
    "no asistio": "bg-gray-100 text-gray-600",
  };
  return map[estado] || "bg-gray-100 text-gray-600";
}

export function getTipoRecordatorioBadge(tipo) {
  const map = {
    cumpleanos: "bg-pink-100 text-pink-700",
    vacuna: "bg-cyan-100 text-cyan-700",
    cita: "bg-blue-100 text-blue-700",
    seguimiento: "bg-purple-100 text-purple-700",
  };
  return map[tipo] || "bg-gray-100 text-gray-600";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Función helper para hacer peticiones
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// PACIENTES
export const pacientesAPI = {
  getAll: () => fetchAPI('/pacientes'),
  getById: (id) => fetchAPI(`/pacientes/${id}`),
  create: (data) => fetchAPI('/pacientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/pacientes/${id}`, { method: 'DELETE' }),
};

// CONSULTAS
export const consultasAPI = {
  getAll: () => fetchAPI('/consultas'),
  getById: (id) => fetchAPI(`/consultas/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/consultas/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/consultas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/consultas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/consultas/${id}`, { method: 'DELETE' }),
};

// VACUNAS
export const vacunasAPI = {
  getAll: () => fetchAPI('/vacunas'),
  getById: (id) => fetchAPI(`/vacunas/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/vacunas/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/vacunas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/vacunas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/vacunas/${id}`, { method: 'DELETE' }),
};

// RECETAS
export const recetasAPI = {
  getAll: () => fetchAPI('/recetas'),
  getById: (id) => fetchAPI(`/recetas/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/recetas/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/recetas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/recetas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/recetas/${id}`, { method: 'DELETE' }),
};

// LABORATORIOS
export const laboratoriosAPI = {
  getAll: () => fetchAPI('/laboratorios'),
  getById: (id) => fetchAPI(`/laboratorios/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/laboratorios/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/laboratorios', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/laboratorios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/laboratorios/${id}`, { method: 'DELETE' }),
};

// FACTURAS
export const facturasAPI = {
  getAll: () => fetchAPI('/facturas'),
  getById: (id) => fetchAPI(`/facturas/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/facturas/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/facturas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/facturas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/facturas/${id}`, { method: 'DELETE' }),
};

// PAGOS
export const pagosAPI = {
  getAll: () => fetchAPI('/pagos'),
  getById: (id) => fetchAPI(`/pagos/${id}`),
  getByFactura: (id_factura) => fetchAPI(`/pagos/factura/${id_factura}`),
  create: (data) => fetchAPI('/pagos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/pagos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/pagos/${id}`, { method: 'DELETE' }),
};

// CITAS
export const citasAPI = {
  getAll: () => fetchAPI('/citas'),
  getById: (id) => fetchAPI(`/citas/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/citas/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/citas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/citas/${id}`, { method: 'DELETE' }),
};

// RECORDATORIOS
export const recordatoriosAPI = {
  getAll: () => fetchAPI('/recordatorios'),
  getById: (id) => fetchAPI(`/recordatorios/${id}`),
  getByPaciente: (id_paciente) => fetchAPI(`/recordatorios/paciente/${id_paciente}`),
  create: (data) => fetchAPI('/recordatorios', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/recordatorios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/recordatorios/${id}`, { method: 'DELETE' }),
};

// Validadores de Entrada y Sanitizacion de Filtros (AB#8, AB#11)
const VALID_STATUSES = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
const VALID_PRIORITIES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
const VALID_CATEGORIES = ['HARDWARE', 'SOFTWARE', 'NETWORK', 'SECURITY', 'ACCESS'];

function validateCreateIncident(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload invalido'] };
  }
  if (!payload.title || String(payload.title).trim().length < 5) {
    errors.push('El titulo es obligatorio y debe contener al menos 5 caracteres');
  }
  if (!payload.description || String(payload.description).trim().length < 10) {
    errors.push('La descripcion es obligatoria y debe detallar el incidente');
  }
  if (!payload.category || !VALID_CATEGORIES.includes(String(payload.category).toUpperCase())) {
    errors.push('Categoria invalida. Valores permitidos: ' + VALID_CATEGORIES.join(', '));
  }
  if (!payload.reported_by || !String(payload.reported_by).includes('@')) {
    errors.push('Debe indicar un correo valido en reported_by');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function filterIncidentsList(incidents, query) {
  let result = [...incidents];
  if (query.status) {
    result = result.filter(i => i.status.toUpperCase() === String(query.status).toUpperCase());
  }
  if (query.priority) {
    result = result.filter(i => i.priority.toUpperCase() === String(query.priority).toUpperCase());
  }
  if (query.category) {
    result = result.filter(i => i.category.toUpperCase() === String(query.category).toUpperCase());
  }
  if (query.assigned_to_id) {
    result = result.filter(i => String(i.assigned_to_id) === String(query.assigned_to_id));
  }
  if (query.search) {
    const s = String(query.search).toLowerCase().trim();
    result = result.filter(i =>
      i.title.toLowerCase().includes(s) ||
      i.description.toLowerCase().includes(s) ||
      i.reported_by.toLowerCase().includes(s)
    );
  }
  return result;
}

module.exports = {
  VALID_STATUSES,
  VALID_PRIORITIES,
  VALID_CATEGORIES,
  validateCreateIncident,
  filterIncidentsList
};
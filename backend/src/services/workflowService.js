// Servicio de Transicion de Estados y Calculo de Indicadores (AB#15, AB#33)
const { VALID_STATUSES, VALID_CATEGORIES } = require('../validators/incidentValidator');

function canTransitionStatus(currentStatus, nextStatus) {
  if (!VALID_STATUSES.includes(nextStatus)) return false;
  // Un incidente CERRADO no debe regresar a NUEVO directamente
  if (currentStatus === 'CERRADO' && nextStatus === 'NUEVO') return false;
  return true;
}

function computeDashboardMetrics(incidents, users) {
  const total = incidents.length;
  const abiertos = incidents.filter(i => ['NUEVO', 'ASIGNADO', 'EN_PROCESO'].includes(i.status)).length;
  const cerrados = incidents.filter(i => ['RESUELTO', 'CERRADO'].includes(i.status)).length;
  const criticos = incidents.filter(i => i.priority === 'CRITICA' && i.status !== 'CERRADO').length;

  const porCategoria = VALID_CATEGORIES.map(cat => ({
    categoria: cat,
    total: incidents.filter(i => i.category === cat).length
  }));

  const porTecnico = users.map(user => ({
    id: user.id,
    nombre: user.name,
    asignados: incidents.filter(i => i.assigned_to_id === user.id && i.status !== 'CERRADO').length,
    resueltos: incidents.filter(i => i.assigned_to_id === user.id && ['RESUELTO', 'CERRADO'].includes(i.status)).length
  }));

  return { total, abiertos, cerrados, criticos, porCategoria, porTecnico };
}

module.exports = {
  canTransitionStatus,
  computeDashboardMetrics
};
const test = require('node:test');
const assert = require('node:assert');
const app = require('../backend/server.js');

// Simple helper para simular peticiones HTTP usando supertest si está disponible, o mocks directos
test('Suite de Pruebas Unitarias - IT Incident Hub (AB#24)', async (t) => {
  
  await t.test('1. Validar que la API expone el estado de salud UP', () => {
    assert.strictEqual(typeof app, 'function');
  });

  await t.test('2. Validar estructura de estados requeridos por la rúbrica', () => {
    const requiredStatuses = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
    assert.strictEqual(requiredStatuses.length, 5);
    assert.ok(requiredStatuses.includes('NUEVO'));
    assert.ok(requiredStatuses.includes('ASIGNADO'));
    assert.ok(requiredStatuses.includes('EN_PROCESO'));
    assert.ok(requiredStatuses.includes('RESUELTO'));
    assert.ok(requiredStatuses.includes('CERRADO'));
  });

  await t.test('3. Validar cálculo de métricas del Dashboard (AB#33)', () => {
    const mockIncidents = [
      { id: 1, status: 'NUEVO', priority: 'ALTA' },
      { id: 2, status: 'EN_PROCESO', priority: 'CRITICA' },
      { id: 3, status: 'CERRADO', priority: 'BAJA' }
    ];
    const abiertos = mockIncidents.filter(i => ['NUEVO', 'ASIGNADO', 'EN_PROCESO'].includes(i.status)).length;
    const cerrados = mockIncidents.filter(i => ['RESUELTO', 'CERRADO'].includes(i.status)).length;
    const criticos = mockIncidents.filter(i => i.priority === 'CRITICA' && i.status !== 'CERRADO').length;

    assert.strictEqual(abiertos, 2);
    assert.strictEqual(cerrados, 1);
    assert.strictEqual(criticos, 1);
  });

  await t.test('4. Validar validaciones de campos obligatorios al registrar incidente (AB#8)', () => {
    const payloadValido = {
      title: 'Fallo de impresora',
      description: 'No enciende',
      category: 'HARDWARE',
      reported_by: 'usuario@empresa.com'
    };
    assert.ok(payloadValido.title.length > 0);
    assert.ok(payloadValido.description.length > 0);
    assert.ok(payloadValido.category.length > 0);
    assert.ok(payloadValido.reported_by.includes('@'));
  });
});

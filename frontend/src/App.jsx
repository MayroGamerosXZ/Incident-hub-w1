import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Formulario nuevo incidente
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('SOFTWARE');
  const [newPriority, setNewPriority] = useState('MEDIA');
  const [newReportedBy, setNewReportedBy] = useState('');

  // Formulario detalle / cambio de estado
  const [targetStatus, setTargetStatus] = useState('');
  const [targetTech, setTargetTech] = useState('');
  const [newComment, setNewComment] = useState('');

  // Cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const [incRes, userRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/incidents?${params.toString()}`).then(r => r.json()),
        fetch(`${API_BASE}/users`).then(r => r.json()),
        fetch(`${API_BASE}/dashboard/stats`).then(r => r.json())
      ]);

      setIncidents(incRes);
      setUsers(userRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter, categoryFilter, searchTerm]);

  // Manejar creación de incidente (AB#9)
  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          priority: newPriority,
          reported_by: newReportedBy
        })
      });
      if (res.ok) {
        setShowNewModal(false);
        setNewTitle('');
        setNewDesc('');
        setNewReportedBy('');
        fetchData();
      }
    } catch (err) {
      alert('Error al registrar incidente');
    }
  };

  // Abrir detalle
  const openDetail = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}`);
      const data = await res.json();
      setSelectedIncident(data);
      setTargetStatus(data.status);
      setTargetTech(data.assigned_to_id || '');
    } catch (err) {
      alert('Error al cargar detalle');
    }
  };

  // Actualizar estado / asignación (AB#16)
  const handleUpdateStatus = async () => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE}/incidents/${selectedIncident.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          assigned_to_id: targetTech || null,
          changed_by: 'Operador en Turno',
          change_reason: 'Transición manual en tablero web'
        })
      });
      if (res.ok) {
        openDetail(selectedIncident.id);
        fetchData();
      }
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  // Agregar comentario
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE}/incidents/${selectedIncident.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: 'Mesa de Ayuda',
          comment: newComment
        })
      });
      if (res.ok) {
        setNewComment('');
        openDetail(selectedIncident.id);
      }
    } catch (err) {
      alert('Error al agregar comentario');
    }
  };

  const getStatusBadge = (st) => {
    const cls = `badge badge-${st.toLowerCase()}`;
    return <span className={cls}>{st}</span>;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.5rem 2rem' }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🛡️</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em' }}>IT Incident Hub</h1>
            <span style={{ backgroundColor: '#1e293b', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
              v0.1.0-w1
            </span>
            <span style={{ backgroundColor: '#047857', color: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
              Azure Boards: AB#4 - AB#34
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Plataforma Corporativa de Trazabilidad y Gestión Continua de Incidentes de TI
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>➕</span> Nuevo Incidente
        </button>
      </header>

      {/* KPI DASHBOARD (AB#34) */}
      {stats && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Incidentes</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem' }}>{stats.total}</div>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Abiertos / En Proceso</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem', color: '#f59e0b' }}>{stats.abiertos}</div>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Casos Críticos</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem', color: '#ef4444' }}>{stats.criticos}</div>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Resueltos / Cerrados</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem', color: '#10b981' }}>{stats.cerrados}</div>
          </div>
        </section>
      )}

      {/* BARRA DE FILTROS (AB#12) */}
      <section style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por título o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1', minWidth: '240px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.55rem 0.75rem', color: '#fff' }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.55rem 0.75rem', color: '#fff' }}
        >
          <option value="">Todos los Estados</option>
          <option value="NUEVO">NUEVO</option>
          <option value="ASIGNADO">ASIGNADO</option>
          <option value="EN_PROCESO">EN_PROCESO</option>
          <option value="RESUELTO">RESUELTO</option>
          <option value="CERRADO">CERRADO</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.55rem 0.75rem', color: '#fff' }}
        >
          <option value="">Todas las Prioridades</option>
          <option value="BAJA">BAJA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="ALTA">ALTA</option>
          <option value="CRITICA">CRÍTICA</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.55rem 0.75rem', color: '#fff' }}
        >
          <option value="">Todas las Categorías</option>
          <option value="HARDWARE">HARDWARE</option>
          <option value="SOFTWARE">SOFTWARE</option>
          <option value="NETWORK">NETWORK</option>
          <option value="SECURITY">SECURITY</option>
          <option value="ACCESS">ACCESS</option>
        </select>
      </section>

      {/* TABLA DE INCIDENTES (AB#12) */}
      <section style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#334155', color: '#cbd5e1' }}>
              <th style={{ padding: '0.75rem 1rem' }}>ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Título</th>
              <th style={{ padding: '0.75rem 1rem' }}>Categoría</th>
              <th style={{ padding: '0.75rem 1rem' }}>Prioridad</th>
              <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
              <th style={{ padding: '0.75rem 1rem' }}>Técnico Asignado</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Cargando incidentes...</td></tr>
            ) : incidents.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No se encontraron incidentes con los filtros seleccionados.</td></tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#38bdf8' }}>#{inc.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{inc.title}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>{inc.category}</td>
                  <td style={{ padding: '0.75rem 1rem' }} className={`priority-${inc.priority.toLowerCase()}`}>
                    {inc.priority}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{getStatusBadge(inc.status)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: inc.assigned_technician ? '#f8fafc' : '#64748b' }}>
                    {inc.assigned_technician ? inc.assigned_technician.name : 'Sin asignar'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => openDetail(inc.id)}
                      style={{ backgroundColor: '#334155', color: '#38bdf8', border: '1px solid #475569', borderRadius: '4px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* MODAL: NUEVO INCIDENTE (AB#9) */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', maxWidth: '500px', width: '100%', padding: '1.5rem', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Registrar Nuevo Incidente</h2>
            <form onSubmit={handleCreateIncident} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Título del Incidente *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Falla de conexión en impresora de RRHH"
                  style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Descripción Detallada *</label>
                <textarea
                  required
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explica qué ocurrió y el impacto observado..."
                  style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Categoría *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#fff' }}
                  >
                    <option value="HARDWARE">HARDWARE</option>
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="NETWORK">NETWORK</option>
                    <option value="SECURITY">SECURITY</option>
                    <option value="ACCESS">ACCESS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Prioridad *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#fff' }}
                  >
                    <option value="BAJA">BAJA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="ALTA">ALTA</option>
                    <option value="CRITICA">CRÍTICA</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Reportado Por (Correo / Usuario) *</label>
                <input
                  type="text"
                  required
                  value={newReportedBy}
                  onChange={(e) => setNewReportedBy(e.target.value)}
                  placeholder="usuario@empresa.com"
                  style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{ backgroundColor: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563eb', border: 'none', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Guardar Incidente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALLE, HISTORIAL Y CAMBIO DE ESTADO (AB#16, AB#19) */}
      {selectedIncident && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>Incidente #{selectedIncident.id}</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.2rem' }}>{selectedIncident.title}</h2>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem', backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
              {selectedIncident.description}
            </p>

            {/* PANEL DE OPERACIÓN: CAMBIAR ESTADO / ASIGNAR */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.75rem' }}>⚙️ Transición de Operación</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Estado Actual: {selectedIncident.status}</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '4px', padding: '0.4rem', color: '#fff' }}
                  >
                    <option value="NUEVO">NUEVO</option>
                    <option value="ASIGNADO">ASIGNADO</option>
                    <option value="EN_PROCESO">EN_PROCESO</option>
                    <option value="RESUELTO">RESUELTO</option>
                    <option value="CERRADO">CERRADO</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Técnico Asignado</label>
                  <select
                    value={targetTech}
                    onChange={(e) => setTargetTech(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '4px', padding: '0.4rem', color: '#fff' }}
                  >
                    <option value="">-- Sin Asignar --</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  style={{ alignSelf: 'flex-end', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.45rem 1rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Actualizar
                </button>
              </div>
            </div>

            {/* BITÁCORA / LÍNEA DE TIEMPO (AB#19) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.5rem' }}>📜 Historial de Estados (Auditoría)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                {selectedIncident.logs && selectedIncident.logs.map(log => (
                  <div key={log.id} style={{ fontSize: '0.8rem', backgroundColor: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                    <span style={{ color: '#94a3b8' }}>{new Date(log.created_at).toLocaleTimeString()}:</span> Transición a <strong>{log.new_status}</strong> por <em>{log.changed_by}</em> ({log.change_reason})
                  </div>
                ))}
              </div>
            </div>

            {/* COMENTARIOS */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.5rem' }}>💬 Comentarios de Seguimiento</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                {selectedIncident.comments && selectedIncident.comments.map(c => (
                  <div key={c.id} style={{ fontSize: '0.8rem', backgroundColor: '#0f172a', padding: '0.5rem', borderRadius: '4px' }}>
                    <strong>{c.author_name}:</strong> {c.comment}
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Agregar una nota técnica..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Comentar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

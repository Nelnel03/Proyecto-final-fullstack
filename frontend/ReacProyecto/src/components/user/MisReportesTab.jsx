import React, { useState, useEffect, useCallback } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import '../../styles/user/MisReportesTab.css';

// Utility to parse content that might serialize Location and Description together
const parseContenido = (contenido) => {
  if (!contenido) {
    return { ubicacion: 'No especificada', descripcion: 'No especificada' };
  }
  const matchDouble = contenido.match(/^Ubicación:\s*([\s\S]*?)(?:\n\n|\r\n\r\n)([\s\S]*)$/i);
  if (matchDouble) {
    return { ubicacion: matchDouble[1].trim(), descripcion: matchDouble[2].trim() };
  }
  const matchSingle = contenido.match(/^Ubicación:\s*([^\n]+)\n+([\s\S]*)$/i);
  if (matchSingle) {
    return { ubicacion: matchSingle[1].trim(), descripcion: matchSingle[2].trim() };
  }
  if (contenido.toLowerCase().startsWith('ubicación:')) {
    const ubi = contenido.substring(10).trim();
    return { ubicacion: ubi || 'No especificada', descripcion: 'No especificada' };
  }
  return { ubicacion: 'No especificada', descripcion: contenido.trim() };
};

const formatReportDate = (dateStr) => {
  if (!dateStr) return 'No especificada';
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch { return dateStr; }
};

const STATUS_STYLES = {
  'Pendiente':        { bg: '#fef9c3', text: '#92400e', border: '#fde68a', icon: '' },
  'En Proceso':       { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', icon: '' },
  'Leído':            { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: '' },
  'Solucionado':      { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', icon: '' },
  'En Investigación': { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: '' },
  'Resuelto':         { bg: '#dcfce7', text: '#166534', border: '#86efac', icon: '' },
  'Aprobada':         { bg: '#dcfce7', text: '#166534', border: '#86efac', icon: '✓ ' },
  'Rechazada':        { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', icon: '× ' },
};

function StatusBadge({ estado }) {
  const display = estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Pendiente';
  const s = STATUS_STYLES[display] || STATUS_STYLES['Pendiente'];
  return (
    <span
      className="status-badge-pill"
      style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {s.icon} {display}
    </span>
  );
}

function MisReportesTab({ user }) {
  const [reportesRobo, setReportesRobo] = useState([]);
  const [mensajesSoporte, setMensajesSoporte] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [solicitudesVol, setSolicitudesVol] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('todos');

  // Estado del modal de edición
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ tipo_arbol: '', ubicacion: '', descripcion: '' });
  const [guardando, setGuardando] = useState(false);

  const cargarTodo = useCallback(async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const [todosRobos, todosSoporte, todasActividades, todasSolicitudes] = await Promise.all([
        services.getReportesRobados(),
        services.getReportes(),
        services.getReportesVoluntariado(),
        services.getSolicitudesVoluntariado()
      ]);
      setReportesRobo((todosRobos || []).filter(r => r.usuario_id === user.id || r.userId === user.id).reverse());
      setMensajesSoporte((todosSoporte || []).filter(m => m.usuario_id === user.id || m.userId === user.id).reverse());
      setActividades((todasActividades || []).filter(a => a.voluntario_id === user.id || a.voluntarioId === user.id).reverse());
      setSolicitudesVol((todasSolicitudes || []).filter(s => s.usuario_id === user.id || s.userId === user.id).reverse());
      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error('Error al cargar mis reportes:', err);
    } finally {
      setCargando(false);
    }
  }, [user?.id]);

  useEffect(() => {
    cargarTodo();
    const interval = setInterval(cargarTodo, 30000);
    return () => clearInterval(interval);
  }, [cargarTodo]);

  // ── ABRIR MODAL DE EDICIÓN ──
  const abrirEdicion = (r) => {
    const parsed = parseContenido(r.contenido || r.descripcion);
    setFormEdit({
      tipo_arbol: r.tipo_arbol || r.asunto || '',
      ubicacion: r.ubicacion || (parsed.ubicacion !== 'No especificada' ? parsed.ubicacion : ''),
      descripcion: r.descripcion || (parsed.descripcion !== 'No especificada' ? parsed.descripcion : ''),
    });
    setEditando(r);
  };

  const cerrarEdicion = () => {
    setEditando(null);
    setFormEdit({ tipo_arbol: '', ubicacion: '', descripcion: '' });
  };

  // ── GUARDAR EDICIÓN ──
  const handleGuardarEdicion = async () => {
    if (!formEdit.tipo_arbol.trim() || !formEdit.ubicacion.trim() || !formEdit.descripcion.trim()) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de guardar.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Los datos del reporte serán actualizados.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;

    setGuardando(true);
    try {
      const actualizado = {
        ...editando,
        asunto: formEdit.tipo_arbol,
        tipo_arbol: formEdit.tipo_arbol,
        ubicacion: formEdit.ubicacion,
        descripcion: formEdit.descripcion,
        contenido: `Ubicación: ${formEdit.ubicacion}\n\n${formEdit.descripcion}`,
      };
      await services.putReportesRobados(actualizado, editando.id);
      setReportesRobo(prev => prev.map(r => r.id === editando.id ? actualizado : r));
      cerrarEdicion();
      Swal.fire({
        title: '¡Reporte actualizado!',
        text: 'Los cambios han sido guardados exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2200,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error al guardar',
        text: 'No se pudo actualizar el reporte. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setGuardando(false);
    }
  };

  // ── ELIMINAR REPORTE ──
  const handleEliminar = async (r) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar reporte?',
      html: `<p style="color:#374151">Se eliminará permanentemente el reporte:<br/><strong style="color:#ef4444">"${r.asunto || r.tipo_arbol || 'Sustracción de Árbol'}"</strong></p><p style="font-size:0.85rem;color:#6b7280">Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '🗑️ Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;

    // Optimistic update
    setReportesRobo(prev => prev.filter(x => x.id !== r.id));
    try {
      await services.deleteReportesRobados(r.id);
      Swal.fire({
        title: 'Reporte eliminado',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      // Rollback
      setReportesRobo(prev => [r, ...prev].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      Swal.fire({
        title: 'Error al eliminar',
        text: 'No se pudo eliminar el reporte. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="mis-reportes-container">

      {/* ── MODAL DE EDICIÓN ── */}
      {editando && (
        <div className="edit-modal-overlay" onClick={cerrarEdicion}>
          <div className="edit-modal-card" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <div>
                <span className="edit-modal-subtitle">✏️ Editar Reporte de Robo</span>
                <h3 className="edit-modal-title">Modificar datos del incidente</h3>
              </div>
              <button className="edit-modal-close" onClick={cerrarEdicion} aria-label="Cerrar">✕</button>
            </div>

            <div className="edit-modal-body">
              {/* Especie / Tipo */}
              <div className="edit-field-group">
                <label className="edit-field-label">
                  🌳 Especie / Tipo de Árbol <span className="required-star">*</span>
                </label>
                <input
                  className="edit-field-input"
                  type="text"
                  value={formEdit.tipo_arbol}
                  onChange={e => setFormEdit(f => ({ ...f, tipo_arbol: e.target.value }))}
                  placeholder="Ej: Almendro de playa, Roble..."
                  maxLength={100}
                />
              </div>

              {/* Ubicación */}
              <div className="edit-field-group">
                <label className="edit-field-label">
                  📍 Ubicación del incidente <span className="required-star">*</span>
                </label>
                <input
                  className="edit-field-input"
                  type="text"
                  value={formEdit.ubicacion}
                  onChange={e => setFormEdit(f => ({ ...f, ubicacion: e.target.value }))}
                  placeholder="Ej: Sendero norte, junto al mirador..."
                />
              </div>

              {/* Descripción */}
              <div className="edit-field-group">
                <label className="edit-field-label">
                  📝 Descripción del incidente <span className="required-star">*</span>
                </label>
                <textarea
                  className="edit-field-input edit-field-textarea"
                  rows={5}
                  value={formEdit.descripcion}
                  onChange={e => setFormEdit(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Describe el incidente con el mayor detalle posible..."
                />
                <span className="char-counter">{formEdit.descripcion.length} caracteres</span>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button className="edit-btn-cancel" onClick={cerrarEdicion} disabled={guardando}>
                Cancelar
              </button>
              <button className="edit-btn-save" onClick={handleGuardarEdicion} disabled={guardando}>
                {guardando ? '⏳ Guardando...' : '✓ Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header con botón de refresco */}
      <div className="mis-reportes-header">
        <h2 className="mis-reportes-title">Mis Solicitudes y Reportes</h2>
        <div className="mis-reportes-actions">
          {ultimaActualizacion && (
            <span className="last-updated-text">
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>
          )}
          <button onClick={cargarTodo} disabled={cargando} className="refresh-reportes-btn">
            {cargando ? '...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mis-reportes-filtros">
        <button className={`filtro-rep-btn${filtroActivo === 'todos' ? ' active' : ''}`} onClick={() => setFiltroActivo('todos')}>Todos</button>
        <button className={`filtro-rep-btn${filtroActivo === 'soporte' ? ' active' : ''}`} onClick={() => setFiltroActivo('soporte')}>Soporte</button>
        <button className={`filtro-rep-btn${filtroActivo === 'robo' ? ' active' : ''}`} onClick={() => setFiltroActivo('robo')}>Robos</button>
        <button className={`filtro-rep-btn${filtroActivo === 'postulacion' ? ' active' : ''}`} onClick={() => setFiltroActivo('postulacion')}>Voluntariado</button>
        {user?.rol === 'voluntario' && (
          <button className={`filtro-rep-btn${filtroActivo === 'actividades' ? ' active' : ''}`} onClick={() => setFiltroActivo('actividades')}>Labores</button>
        )}
      </div>

      {cargando && mensajesSoporte.length === 0 ? (
        <p className="mis-reportes-loading">Cargando tus datos...</p>
      ) : (
        <div className="mis-reportes-grid">

          {/* ── SOPORTE ── */}
          {(filtroActivo === 'todos' || filtroActivo === 'soporte') && (
            <section>
              <h3 className="section-title-soporte">Mensajes de Soporte</h3>
              {mensajesSoporte.length === 0 ? (
                <p className="empty-section-text">No has enviado mensajes de soporte.</p>
              ) : (
                <div className="cards-grid">
                  {mensajesSoporte.map(m => (
                    <div key={m.id} className="reporte-item-card" style={{ borderLeft: `5px solid ${STATUS_STYLES[m.estado]?.border || '#e5e7eb'}` }}>
                      <div className="card-top-row">
                        <strong className="card-title-soporte">{m.asunto}</strong>
                        <StatusBadge estado={m.estado} />
                      </div>
                      <p className="card-message">{m.contenido || m.mensaje}</p>
                      <small className="card-date">Enviado: {new Date(m.fecha).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── ROBOS ── */}
          {(filtroActivo === 'todos' || filtroActivo === 'robo') && (
            <section>
              <h3 className="section-title-robo">Reportes de Robo</h3>
              {reportesRobo.length === 0 ? (
                <p className="empty-section-text">No tienes reportes de robo.</p>
              ) : (
                <div className="user-robo-cards-grid">
                  {reportesRobo.map(r => {
                    const parsed = parseContenido(r.contenido || r.descripcion);
                    const ubicacionVal = r.ubicacion || parsed.ubicacion;
                    const descripcionVal = r.descripcion || parsed.descripcion;
                    const fechaVal = formatReportDate(r.fecha);
                    const puedeEditar = !r.estado || r.estado === 'Pendiente';

                    return (
                      <div
                        key={r.id}
                        className="user-robo-card-item"
                        style={{ borderLeft: `5px solid ${STATUS_STYLES[r.estado]?.border || '#e5e7eb'}` }}
                      >
                        {/* Encabezado */}
                        <div className="user-robo-card-header">
                          <div className="user-robo-card-title-group">
                            <span className="user-robo-card-subtitle">Alerta de Robo</span>
                            <strong className="user-robo-card-title">
                              Reporte: {r.asunto || r.tipo_arbol || 'Sustracción de Árbol'}
                            </strong>
                          </div>
                          <StatusBadge estado={r.estado} />
                        </div>

                        {/* Secciones de información */}
                        <div className="user-robo-card-sections">
                          <div className="user-robo-section-block user-location-block">
                            <span className="user-robo-block-label">📍 Ubicación:</span>
                            <p className="user-robo-block-value">{ubicacionVal}</p>
                          </div>
                          <div className="user-robo-section-block user-description-block">
                            <span className="user-robo-block-label">📝 Descripción:</span>
                            <p className="user-robo-block-value user-description-text">"{descripcionVal}"</p>
                          </div>
                          <div className="user-robo-section-block user-date-block">
                            <span className="user-robo-block-label">📅 Fecha de envío:</span>
                            <p className="user-robo-block-value">{fechaVal}</p>
                          </div>
                          {r.tipo_arbol && (
                            <div className="user-robo-section-block user-additional-block">
                              <span className="user-robo-block-label">🌳 Información adicional:</span>
                              <div className="user-additional-fields">
                                <div className="user-add-field">
                                  <span className="user-add-label">Especie:</span>
                                  <span className="user-add-val">{r.tipo_arbol}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ── ACCIONES CRUD ── */}
                        <div className="robo-crud-actions">
                          {puedeEditar ? (
                            <button
                              className="crud-btn crud-btn-edit"
                              onClick={() => abrirEdicion(r)}
                              title="Editar este reporte"
                            >
                              ✏️ Editar
                            </button>
                          ) : (
                            <span className="crud-no-edit-hint" title="Solo puedes editar reportes en estado Pendiente">
                              🔒 En proceso
                            </span>
                          )}
                          <button
                            className="crud-btn crud-btn-delete"
                            onClick={() => handleEliminar(r)}
                            title="Eliminar este reporte"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ── HISTORIAL DE ACTIVIDADES (VOLUNTARIO) ── */}
          {user?.rol === 'voluntario' && (filtroActivo === 'todos' || filtroActivo === 'actividades') && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                <h3 className="section-title-actividad">Mis Reportes de Actividad</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }}>
                    ✓ {actividades.filter(a => a.estado === 'aprobado').length} Aprobadas
                  </span>
                  <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                    ⏳ {actividades.filter(a => a.estado !== 'aprobado').length} Pendientes
                  </span>
                  <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                    🕐 {actividades.filter(a => a.estado === 'aprobado').reduce((sum, a) => sum + (Number(a.horas) || 0), 0)}h aceptadas
                  </span>
                </div>
              </div>
              {actividades.length === 0 ? (
                <p className="empty-section-text">No tienes registros de actividad.</p>
              ) : (
                <div className="cards-grid">
                  {actividades.map(a => {
                    const aprobado = a.estado === 'aprobado';
                    return (
                      <div key={a.id} className="reporte-item-card" style={{ borderLeft: `5px solid ${aprobado ? '#10b981' : '#f59e0b'}` }}>
                        <div className="card-top-row">
                          <strong className="card-title-actividad">{a.tipoTarea}</strong>
                          {aprobado ? (
                            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }}>✓ Aprobado</span>
                          ) : (
                            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>⏳ Pendiente</span>
                          )}
                        </div>
                        <p className="card-detail card-detail-dark" style={{ fontWeight: 600 }}>{a.horas}h — {a.fecha}</p>
                        <p className="card-detail card-detail-italic">{a.tareas}</p>
                        {aprobado && (
                          <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '8px', background: '#f0fdf4', fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                            ✓ Horas validadas por el administrador
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ── POSTULACIONES VOLUNTARIADO ── */}
          {(filtroActivo === 'todos' || filtroActivo === 'postulacion') && (
            <section>
              <h3 className="section-title-postulacion" style={{ color: '#7c3aed' }}>
                Solicitudes de Voluntariado
              </h3>
              {solicitudesVol.length === 0 ? (
                <p className="empty-section-text">No tienes solicitudes de voluntariado.</p>
              ) : (
                <div className="cards-grid">
                  {solicitudesVol.map(s => (
                    <div key={s.id} className="reporte-item-card" style={{ borderLeft: `5px solid ${STATUS_STYLES[s.estado]?.border || '#7c3aed'}` }}>
                      <div className="card-top-row">
                        <strong className="card-title-postulacion" style={{ color: '#5b21b6' }}>Postulación a Voluntario</strong>
                        <StatusBadge estado={s.estado} />
                      </div>
                      <p className="card-detail card-detail-dark" style={{ fontStyle: 'italic' }}>"{s.mensaje}"</p>
                      <small className="card-date">Enviado: {new Date(s.fecha).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      )}
    </div>
  );
}

export default MisReportesTab;

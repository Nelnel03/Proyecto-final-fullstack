import React, { useState, useEffect, useCallback } from 'react';
import services from '../../services/services';
import '../../styles/MisReportesTab.css';

// Paleta de colores de estado compartida con el admin
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
  const s = STATUS_STYLES[estado] || STATUS_STYLES['Pendiente'];
  return (
    <span
      className="status-badge-pill"
      style={{
        backgroundColor: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.icon} {estado || 'Pendiente'}
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
      setReportesRobo((todosRobos || []).filter(r => r.userId === user.id).reverse());
      setMensajesSoporte((todosSoporte || []).filter(m => m.userId === user.id).reverse());
      setActividades((todasActividades || []).filter(a => a.voluntarioId === user.id).reverse());
      setSolicitudesVol((todasSolicitudes || []).filter(s => s.userId === user.id).reverse());
      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error('Error al cargar mis reportes:', err);
    } finally {
      setCargando(false);
    }
  }, [user?.id]);

  useEffect(() => {
    cargarTodo();
    // Refresco automático cada 30 segundos para ver cambios del admin en tiempo real
    const interval = setInterval(cargarTodo, 30000);
    return () => clearInterval(interval);
  }, [cargarTodo]);

  return (
    <div className="mis-reportes-container">
      {/* Header con botón de refresco */}
      <div className="mis-reportes-header">
        <h2 className="mis-reportes-title">Mis Solicitudes y Reportes</h2>
        <div className="mis-reportes-actions">
          {ultimaActualizacion && (
            <span className="last-updated-text">
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={cargarTodo}
            disabled={cargando}
            className="refresh-reportes-btn"
          >
            {cargando ? '...' : 'Actualizar'}
          </button>
        </div>
      </div>

      <div className="mis-reportes-filtros">
        <button className={`filtro-rep-btn ${filtroActivo === 'todos' ? 'active' : ''}`} onClick={() => setFiltroActivo('todos')}>Todos</button>
        <button className={`filtro-rep-btn ${filtroActivo === 'soporte' ? 'active' : ''}`} onClick={() => setFiltroActivo('soporte')}>Soporte</button>
        <button className={`filtro-rep-btn ${filtroActivo === 'robo' ? 'active' : ''}`} onClick={() => setFiltroActivo('robo')}>Robos</button>
        <button className={`filtro-rep-btn ${filtroActivo === 'postulacion' ? 'active' : ''}`} onClick={() => setFiltroActivo('postulacion')}>Voluntariado</button>
        {user?.rol === 'voluntario' && (
          <button className={`filtro-rep-btn ${filtroActivo === 'actividades' ? 'active' : ''}`} onClick={() => setFiltroActivo('actividades')}>Labores</button>
        )}
      </div>

      {cargando && mensajesSoporte.length === 0 ? (
        <p className="mis-reportes-loading">Cargando tus datos...</p>
      ) : (
        <div className="mis-reportes-grid">

          {/* ── SOPORTE ── */}
          {(filtroActivo === 'todos' || filtroActivo === 'soporte') && (
            <section>
            <h3 className="section-title-soporte">
              Mensajes de Soporte
            </h3>
            {mensajesSoporte.length === 0 ? (
              <p className="empty-section-text">No has enviado mensajes de soporte.</p>
            ) : (
              <div className="cards-grid">
                {mensajesSoporte.map(m => (
                  <div
                    key={m.id}
                    className="reporte-item-card"
                    style={{ borderLeft: `5px solid ${STATUS_STYLES[m.estado]?.border || '#e5e7eb'}` }}
                  >
                    <div className="card-top-row">
                      <strong className="card-title-soporte">{m.asunto}</strong>
                      <StatusBadge estado={m.estado} />
                    </div>
                    <p className="card-message">{m.mensaje}</p>
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
            <h3 className="section-title-robo">
              Reportes de Robo
            </h3>
            {reportesRobo.length === 0 ? (
              <p className="empty-section-text">No tienes reportes de robo.</p>
            ) : (
              <div className="cards-grid">
                {reportesRobo.map(r => (
                  <div
                    key={r.id}
                    className="reporte-item-card"
                    style={{ borderLeft: `5px solid ${STATUS_STYLES[r.estado]?.border || '#e5e7eb'}` }}
                  >
                    <div className="card-top-row">
                      <strong className="card-title-robo">{r.tipo_arbol}</strong>
                      <StatusBadge estado={r.estado} />
                    </div>
                    <p className="card-detail card-detail-gray">{r.ubicacion}</p>
                    <p className="card-detail card-detail-dark">{r.descripcion}</p>
                    <small className="card-date">Enviado: {new Date(r.fecha).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
            </section>
          )}

          {user.rol === 'voluntario' && (filtroActivo === 'todos' || filtroActivo === 'actividades') && (
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
                      <div
                        key={a.id}
                        className="reporte-item-card"
                        style={{ borderLeft: `5px solid ${aprobado ? '#10b981' : '#f59e0b'}` }}
                      >
                        <div className="card-top-row">
                          <strong className="card-title-actividad">{a.tipoTarea}</strong>
                          {aprobado ? (
                            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }}>
                              ✓ Aprobado
                            </span>
                          ) : (
                            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                              ⏳ Pendiente
                            </span>
                          )}
                        </div>
                        <p className="card-detail card-detail-dark" style={{ fontWeight: 600 }}>
                          {a.horas}h — {a.fecha}
                        </p>
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
                    <div 
                      key={s.id} 
                      className="reporte-item-card"
                      style={{ borderLeft: `5px solid ${STATUS_STYLES[s.estado]?.border || '#7c3aed'}` }}
                    >
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

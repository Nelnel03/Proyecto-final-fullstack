import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import '../../styles/BuzonTab.css';

const ESTADOS_SOPORTE = ['Pendiente', 'En Proceso', 'Leído', 'Solucionado'];
const ESTADOS_ROBO    = ['Pendiente', 'En Investigación', 'Resuelto'];

const getStatusClass = (estado) => {
  switch (estado) {
    case 'Pendiente':        return 'status-pendiente';
    case 'En Proceso':       return 'status-proceso';
    case 'Leído':            return 'status-leido';
    case 'Solucionado':      return 'status-solucionado';
    case 'En Investigación': return 'status-investigacion';
    case 'Resuelto':         return 'status-resuelto';
    default:                 return 'status-pendiente';
  }
};

function StatusBadge({ estado }) {
  const statusClass = getStatusClass(estado);
  return (
    <span className={`status-badge ${statusClass}`}>
      {estado || 'Pendiente'}
    </span>
  );
}

function BuzonTab({ refrescarNotificaciones }) {
  const [reportesVoluntario, setReportesVoluntario] = useState([]);
  const [reportesRobo, setReportesRobo] = useState([]);
  const [reportesSoporte, setReportesSoporte] = useState([]);
  const [solicitudesVol, setSolicitudesVol] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState('soporte');
  const [subPostulacion, setSubPostulacion] = useState('pendientes');
  const [subLabor, setSubLabor] = useState('nuevas');
  const [subSoporte, setSubSoporte] = useState('usuarios');

  useEffect(() => { 
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000); 
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [volDatos, roboDatos, sopDatos, solDatos] = await Promise.all([
        services.getReportesVoluntariado(),
        services.getReportesRobados(),
        services.getReportes(),
        services.getSolicitudesVoluntariado()
      ]);
      setReportesVoluntario((volDatos || []).sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha)));
      setReportesRobo((roboDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      setReportesSoporte((sopDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      setSolicitudesVol((solDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (err) {
      console.error('Error al cargar datos del buzón:', err);
    } finally {
      if (refrescarNotificaciones) refrescarNotificaciones();
      setCargando(false);
    }
  };

  /* ── Postulaciones: Aceptar/Rechazar ── */
  const handleAprobarSolicitud = async (sol) => {
    const res = await Swal.fire({
      title: '¿Aprobar nuevo voluntario?',
      text: `El usuario ${sol.userName} pasará a tener rango de voluntario oficialmente.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      // 1. Obtener datos del usuario completo
      const allUsers = await services.getUsuarios();
      const userObj = allUsers.find(u => u.id === sol.userId);
      
      if (userObj) {
          // 2. Actualizar el rol del usuario a voluntario
          await services.putUsuarios({ ...userObj, rol: 'voluntario' }, userObj.id);
          
          // 3. Crear ficha de voluntariado oficial
          const nuevaFicha = {
              nombre: sol.userName,
              email: sol.userEmail,
              area: 'Por asignar',
              fechaIngreso: new Date().toISOString().split('T')[0],
              rol: 'voluntario',
              fotoPerfil: userObj.fotoPerfil || ''
          };
          await services.postVoluntariados(nuevaFicha);
      }

      // 4. Marcar solicitud como aprobada
      await services.putSolicitudVoluntariado({ ...sol, estado: 'Aprobada' }, sol.id);
      
      // 5. Refrescar UI
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'Aprobada' } : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire('¡Felicidades!', 'Nuevo voluntariado registrado con éxito.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo procesar la aprobación.', 'error');
    }
  };

  const handleRechazarSolicitud = async (sol) => {
    const res = await Swal.fire({
      title: '¿Rechazar solicitud?',
      text: `Se notificará al usuario de la decisión.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      await services.putSolicitudVoluntariado({ ...sol, estado: 'Rechazada' }, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'Rechazada' } : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire('Procesado', 'La solicitud ha sido rechazada.', 'info');
    } catch {
      Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
    }
  };

  /* ── Postulaciones: Marcar como visto ── */
  const handleVistoSolicitud = async (sol) => {
    if (sol.visto) return;
    try {
      const updated = { ...sol, visto: true };
      await services.putSolicitudVoluntariado(updated, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? updated : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) {
      console.error("Error al marcar como visto:", err);
    }
  };

  /* ── Labores Voluntarios: Marcar como visto ── */
  const handleVistoReporteVoluntario = async (rep) => {
    if (rep.visto) return;
    try {
      const updated = { ...rep, visto: true };
      await services.putReporteVoluntariado(updated, rep.id);
      setReportesVoluntario(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) {
      console.error("Error al marcar reporte de labor como visto:", err);
    }
  };

  const handleVistoSoporte = async (rep) => {
    if (rep.visto) return;
    try {
      const updated = { ...rep, visto: true };
      await services.putReportes(updated, rep.id);
      setReportesSoporte(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) {
      console.error("Error al marcar soporte como visto:", err);
    }
  };

  const handleAprobarLabor = async (reporte) => {
    try {
      const reporteActualizado = { ...reporte, estado: 'aprobado', visto: true };
      await services.putReporteVoluntariado(reporteActualizado, reporte.id);
      
      // Actualizar contador de horas del voluntario si es necesario (asumiendo que reporte ya tiene las horas)
      setReportesVoluntario(prev => prev.map(r => r.id === reporte.id ? reporteActualizado : r));
      
      Swal.fire({
        icon: 'success',
        title: 'Labor Aprobada',
        text: 'Se han validado las horas del voluntario.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo aprobar la labor.', 'error');
    }
  };

  const handleRechazarLabor = async (reporte) => {
    const { value: motivo } = await Swal.fire({
      title: 'Rechazar Labor',
      input: 'textarea',
      inputLabel: 'Indica el motivo del rechazo',
      inputPlaceholder: 'La foto no es clara, faltan detalles...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Rechazar definitivamente',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => !value && 'Debes indicar un motivo para el rechazo'
    });

    if (motivo) {
      try {
        const reporteActualizado = { ...reporte, estado: 'rechazado', motivoRechazo: motivo, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, reporte.id);
        setReportesVoluntario(prev => prev.map(r => r.id === reporte.id ? reporteActualizado : r));
        
        Swal.fire({
          icon: 'success',
          title: 'Labor Rechazada',
          text: 'Se ha notificado al voluntario con el motivo.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire('Error', 'No se pudo rechazar la labor.', 'error');
      }
    }
  };

  /* ── Solicitudes de Tareas: Aprobar / Rechazar ── */
  const handleAprobarSolicitudTarea = async (log) => {
    const { value: date } = await Swal.fire({
      title: 'Validar Asignación',
      text: 'Indica la fecha en que el voluntario debe realizar la tarea:',
      icon: 'question',
      input: 'date',
      inputAttributes: { min: new Date().toISOString().split('T')[0] },
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Asignar Fecha',
      cancelButtonText: 'Cancelar'
    });

    if (date) {
      try {
        const reporteActualizado = { ...log, estado: 'asignado', fecha: date, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, log.id);
        setReportesVoluntario(prev => prev.map(r => r.id === log.id ? reporteActualizado : r));
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'success', title: 'Asignación Aprobada', text: 'Se ha asignado la labor al voluntario.', timer: 2500, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'No se pudo aprobar la asignación.', 'error');
      }
    }
  };

  const handleRechazarSolicitudTarea = async (log) => {
    const { value: motivo } = await Swal.fire({
      title: 'Rechazar Solicitud',
      input: 'textarea',
      inputLabel: 'Razón del rechazo (opcional)',
      inputPlaceholder: 'Falta disponibilidad...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar Tarea',
      cancelButtonText: 'Cancelar'
    });
    if (motivo !== undefined) {
      try {
        const reporteActualizado = { ...log, estado: 'rechazado_pre', motivoRechazo: motivo, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, log.id);
        setReportesVoluntario(prev => prev.map(r => r.id === log.id ? reporteActualizado : r));
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'success', title: 'Asignación Rechazada', text: 'El voluntario no podrá realizar esta labor.', timer: 2500, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'No se pudo rechazar la asignación.', 'error');
      }
    }
  };

  /* ── Soporte: actualizar estado ── */
  const handleEstadoSoporte = async (rep, nuevoEstado) => {
    try {
      const updated = { ...rep, estado: nuevoEstado };
      await services.putReportes(updated, rep.id);
      setReportesSoporte(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  /* ── Soporte: eliminar ── */
  const handleEliminarSoporte = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar mensaje?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;
    try {
      await services.deleteReportes(id);
      setReportesSoporte(prev => prev.filter(r => r.id !== id));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error');
    }
  };

  /* ── Robos: actualizar estado ── */
  const handleEstadoRobo = async (rep, nuevoEstado) => {
    try {
      const updated = { ...rep, estado: nuevoEstado, visto: true };
      await services.putReportesRobados(updated, rep.id);
      setReportesRobo(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  /* ── Robos: eliminar ── */
  const handleEliminarRobo = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar reporte de robo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bc6c25',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;
    try {
      await services.deleteReportesRobados(id);
      setReportesRobo(prev => prev.filter(r => r.id !== id));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el reporte.', 'error');
    }
  };

  /* ── Tabs ── */
  const solicitudesLabores = reportesVoluntario.filter(r => r.estado === 'solicitado');
  const laboresNormales = reportesVoluntario.filter(r => r.estado !== 'solicitado');

  const tabs = [
    { id: 'soporte',      label: `Soporte (${reportesSoporte.length})`,     activeColor: 'var(--color-bosque-helecho)' },
    { id: 'robos',        label: `Robos (${reportesRobo.length})`,           activeColor: 'var(--color-bosque-helecho)' },
    { id: 'postulaciones', label: `Postulaciones (${solicitudesVol.length})`, activeColor: 'var(--color-bosque-helecho)' },
    { id: 'solicitudes_labores', label: `Sol. Tareas (${solicitudesLabores.length})`, activeColor: 'var(--color-bosque-helecho)' },
    { id: 'actividades',  label: `Labores (${reportesVoluntario.filter(r => r.estado === 'enviado' && !r.visto).length})`,   activeColor: 'var(--color-bosque-helecho)' },
  ];

  /* ── Selectores de estado inline ── */
  const SelectEstado = ({ value, opciones, onChange }) => (
    <select
      value={value || opciones[0]}
      onChange={e => onChange(e.target.value)}
      className={`select-status-basic ${getStatusClass(value)}`}
    >
      {opciones.map(op => <option key={op} value={op}>{op}</option>)}
    </select>
  );

  /* ── Botón eliminar ── */
  const BtnEliminar = ({ onClick }) => (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Evitar que el click en borrar marque como leído
        onClick();
      }}
      className="btn-delete-basic"
    >
      Eliminar
    </button>
  );

  return (
    <div className="tab-content">
      {/* Header */}
      <div className="buzon-header">
        <div className="buzon-title-section">
          <h2>Buzón Interno</h2>
          <p className="buzon-subtitle">
            Gestión de mensajes, reportes y actividades de la comunidad
          </p>
        </div>
        <div className="buzon-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setSeccion(t.id)}
              className={`buzon-tab-btn ${seccion === t.id ? 'active' : ''}`}
              style={seccion === t.id ? { backgroundColor: t.activeColor, border: `1.5px solid ${t.activeColor}` } : { color: t.activeColor, border: `1.5px solid ${t.activeColor}` }}
            >
              {t.label}
            </button>
          ))}
          <button onClick={cargarDatos} title="Actualizar" className="refresh-btn">↺</button>
        </div>
      </div>

      {cargando ? (
        <div className="buzon-loading">Cargando mensajes...</div>
      ) : (
        <>
      {seccion === 'soporte' && (
        <div className="buzon-section">
          <div className="buzon-section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="buzon-section-title" style={{ margin: 0 }}>Mensajes de Soporte</h2>
            <div className="buzon-tabs-sub" style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`sub-tab-btn ${subSoporte === 'usuarios' ? 'active' : ''}`}
                onClick={() => setSubSoporte('usuarios')}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: subSoporte === 'usuarios' ? '#22c55e' : '#e5e7eb', color: subSoporte === 'usuarios' ? '#fff' : '#4b5563', fontWeight: 700 }}
              >
                Usuarios ({reportesSoporte.filter(r => !r.usuarioId?.startsWith('vol-')).length})
              </button>
              <button 
                className={`sub-tab-btn ${subSoporte === 'voluntarios' ? 'active' : ''}`}
                onClick={() => setSubSoporte('voluntarios')}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: subSoporte === 'voluntarios' ? '#22c55e' : '#e5e7eb', color: subSoporte === 'voluntarios' ? '#fff' : '#4b5563', fontWeight: 700 }}
              >
                Voluntarios ({reportesSoporte.filter(r => r.usuarioId?.startsWith('vol-')).length})
              </button>
            </div>
          </div>

          <div className="reportes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {reportesSoporte.filter(r => subSoporte === 'voluntarios' ? r.usuarioId?.startsWith('vol-') : !r.usuarioId?.startsWith('vol-')).length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hay mensajes en esta categoría.</p>
            ) : (
              reportesSoporte
                .filter(r => subSoporte === 'voluntarios' ? r.usuarioId?.startsWith('vol-') : !r.usuarioId?.startsWith('vol-'))
                .map((rep) => (
                  <div key={rep.id} 
                    className={`reporte-card card-soporte ${!rep.visto ? 'unread-card' : ''}`} 
                    onClick={() => handleVistoSoporte(rep)}
                    style={{ background: '#fff', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative', borderLeft: `5px solid ${rep.usuarioId?.startsWith('vol-') ? '#f59e0b' : '#3b82f6'}`, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div className="title-with-badge">
                        {!rep.visto && <span className="unread-dot-mini" title="No visto"></span>}
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, background: rep.usuarioId?.startsWith('vol-') ? '#fef3c7' : '#dbeafe', color: rep.usuarioId?.startsWith('vol-') ? '#92400e' : '#1e40af', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {rep.usuarioId?.startsWith('vol-') ? 'Soporte Voluntariado' : 'Soporte General'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{rep.fecha}</span>
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 800 }}>{rep.asunto}</h3>
                    <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#6b7280' }}>De: <strong>{rep.usuarioNombre || rep.userName || rep.voluntarioNombre || 'Anónimo'}</strong></p>
                    <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '10px', border: '1px solid #e5e7eb', color: '#334155' }}>
                      {rep.contenido || rep.mensaje || '—'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button onClick={() => services.deleteReportes(rep.id).then(() => cargarDatos())} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Eliminar</button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

          {/* ── SECCIÓN ROBOS ── */}
          {seccion === 'robos' && (
            reportesRobo.length === 0 ? (
              <Vacia mensaje="No hay alertas de robo actualmente." />
            ) : (
              <div className="reportes-list">
                {reportesRobo.map(rep => (
                  <div 
                    key={rep.id} 
                    className={`reporte-card card-robo ${!rep.visto ? 'unread-card' : ''}`}
                    onClick={() => {
                        if (!rep.visto) handleEstadoRobo(rep, rep.estado || 'En Investigación');
                    }}
                  >
                    <div className="row-between">
                      <div className="title-with-badge">
                        {!rep.visto && <span className="unread-dot-mini" title="No visto"></span>}
                        <h3 className="card-title title-robo">Árbol: {rep.tipo_arbol}</h3>
                        <span className="meta-text">{rep.ubicacion}</span>
                      </div>
                      <div className="card-actions-right">
                        <SelectEstado
                          value={rep.estado}
                          opciones={ESTADOS_ROBO}
                          onChange={(v) => handleEstadoRobo(rep, v)}
                        />
                        <span className="status-date">
                          {new Date(rep.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="message-box box-robo">
                      <strong className="box-title-inner inner-title-robo">Descripción:</strong>
                      <p className="message-text">{rep.descripcion}</p>
                    </div>
                    <div className="card-footer-between">
                      <span className="meta-text">Reportado por: <strong>{rep.userName}</strong></span>
                      <BtnEliminar onClick={() => handleEliminarRobo(rep.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── SECCIÓN POSTULACIONES VOLUNTARIADO ── */}
          {seccion === 'postulaciones' && (
            <div className="sub-buzon-container">
              {/* Filtros Internos de Postulaciones */}
              <div className="sub-tabs-filtros">
                <button 
                  className={`sub-tab-btn ${subPostulacion === 'pendientes' ? 'active-green' : ''}`}
                  onClick={() => setSubPostulacion('pendientes')}
                >
                  Pendientes ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === 'pendiente').length})
                </button>
                <button 
                  className={`sub-tab-btn ${subPostulacion === 'aceptadas' ? 'active-green' : ''}`}
                  onClick={() => setSubPostulacion('aceptadas')}
                >
                  Aceptadas ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === 'aprobada').length})
                </button>
                <button 
                  className={`sub-tab-btn ${subPostulacion === 'rechazadas' ? 'active-green' : ''}`}
                  onClick={() => setSubPostulacion('rechazadas')}
                >
                  Rechazadas ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === 'rechazada').length})
                </button>
              </div>

              <div className="reportes-list">
                {solicitudesVol
                  .filter(sol => {
                    const est = (sol.estado || '').toLowerCase();
                    if (subPostulacion === 'pendientes') return est === 'pendiente';
                    if (subPostulacion === 'aceptadas') return est === 'aprobada';
                    if (subPostulacion === 'rechazadas') return est === 'rechazada';
                    return false;
                  })
                  .length === 0 ? (
                    <Vacia mensaje={`No hay solicitudes ${subPostulacion} en este momento.`} />
                  ) : (
                    solicitudesVol
                      .filter(sol => {
                        const est = (sol.estado || '').toLowerCase();
                        if (subPostulacion === 'pendientes') return est === 'pendiente';
                        if (subPostulacion === 'aceptadas') return est === 'aprobada';
                        if (subPostulacion === 'rechazadas') return est === 'rechazada';
                        return false;
                      })
                      .map(sol => (
                        <div 
                          key={sol.id} 
                          className={`reporte-card card-postulacion ${!sol.visto ? 'unread-card' : ''} status-${(sol.estado || '').toLowerCase()}`}
                          onClick={() => {
                              if (!sol.visto) handleVistoSolicitud(sol);
                          }}
                        >
                          <div className="row-between">
                            <div className="title-with-badge">
                              {!sol.visto && <span className="unread-dot-mini" title="No visto"></span>}
                              <h3 className="card-title">
                                Postulación: {sol.userName}
                              </h3>
                              <span className="meta-text">{sol.userEmail}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                              <span className="status-date">{new Date(sol.fecha).toLocaleDateString()}</span>
                              {sol.estado !== 'Pendiente' && <StatusBadge estado={sol.estado} />}
                            </div>
                          </div>
                          <div className="message-box box-postulacion">
                            <strong className="box-title-inner">Motivación del usuario:</strong>
                            <p className={`message-text text-${(sol.estado || '').toLowerCase()}`}>
                              {sol.mensaje}
                            </p>
                          </div>
                          {sol.estado === 'Pendiente' && (
                          <div className="card-footer" style={{ gap: '10px' }}>
                            <button 
                              onClick={() => handleRechazarSolicitud(sol)} 
                              className="btn-delete-basic btn-rechazar-post"
                            >
                              Rechazar
                            </button>
                            <button 
                              onClick={() => handleAprobarSolicitud(sol)} 
                              className="admin-btn-user-submit btn-aprobar-post"
                            >
                              Aprobar Voluntario
                            </button>
                          </div>
                          )}
                        </div>
                      ))
                )}
              </div>
            </div>
          )}

          {/* ── SECCIÓN SOLICITUDES DE TAREAS ── */}
          {seccion === 'solicitudes_labores' && (
            <div className="sub-buzon-container">
              {solicitudesLabores.length === 0 ? (
                <Vacia mensaje="No hay solicitudes de labores para aprobar." />
              ) : (
                <div className="reportes-list">
                  {solicitudesLabores.map(rep => (
                    <div 
                      key={rep.id} 
                      className={`reporte-card card-voluntario ${!rep.visto ? 'unread-card' : ''}`}
                      onClick={() => {
                        if (!rep.visto) handleVistoReporteVoluntario(rep);
                      }}
                    >
                      <div className="row-between">
                        <div className="title-with-badge">
                          {!rep.visto && <span className="unread-dot-mini" title="No visto" style={{ backgroundColor: 'var(--color-bosque-helecho)' }}></span>}
                          <div>
                            <h3 className="card-title title-soporte" style={{ color: 'var(--color-bosque-helecho)' }}>{rep.voluntarioNombre} quiere realizar una tarea</h3>
                            <span className="meta-text">{rep.voluntarioEmail}</span>
                          </div>
                        </div>
                        <div className="voluntario-stats">
                          <span className="hours-tag">{rep.horas} {rep.horas === 1 ? 'Hora' : 'Horas'}</span>
                          <p className="voluntario-date-time">{new Date(rep.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="message-box box-voluntario">
                        <strong className="box-title-inner inner-title-voluntario">Tarea Solicitada:</strong>
                        <p className="message-text">{rep.tipoTarea}</p>
                      </div>
                      <div className="card-footer" style={{ gap: '10px' }}>
                        <button onClick={() => handleRechazarSolicitudTarea(rep)} className="btn-delete-basic btn-rechazar-post">
                          Rechazar
                        </button>
                        <button onClick={() => handleAprobarSolicitudTarea(rep)} className="admin-btn-user-submit btn-aprobar-post">
                          Asignar Tarea
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SECCIÓN LABORES VOLUNTARIOS ── */}
          {seccion === 'actividades' && (
            <div className="sub-buzon-container">
              {/* Filtros Internos de Labores */}
              <div className="sub-tabs-filtros">
                <button 
                  className={`sub-tab-btn ${subLabor === 'nuevas' ? 'active-green' : ''}`}
                  onClick={() => setSubLabor('nuevas')}
                >
                  Nuevas evidencias ({reportesVoluntario.filter(r => r.estado === 'enviado' && !r.visto).length})
                </button>
                <button 
                  className={`sub-tab-btn ${subLabor === 'revisadas' ? 'active-green' : ''}`}
                  onClick={() => setSubLabor('revisadas')}
                >
                  Historial revisado ({reportesVoluntario.filter(r => r.visto || r.estado === 'aprobado').length})
                </button>
              </div>

              <div className="reportes-list">
                {laboresNormales
                  .filter(rep => {
                    if (subLabor === 'nuevas') return !rep.visto;
                    if (subLabor === 'revisadas') return rep.visto;
                    return false;
                  })
                  .length === 0 ? (
                    <Vacia mensaje={`No hay labores ${subLabor === 'nuevas' ? 'sin revisar' : 'revisadas'} en este momento.`} />
                  ) : (
                    laboresNormales
                      .filter(rep => {
                        if (subLabor === 'nuevas') return !rep.visto;
                        if (subLabor === 'revisadas') return rep.visto;
                        return false;
                      })
                      .map(rep => (
                        <div 
                          key={rep.id} 
                          className={`reporte-card card-voluntario ${!rep.visto ? 'unread-card' : ''}`}
                          onClick={() => {
                              if (!rep.visto) handleVistoReporteVoluntario(rep);
                          }}
                        >
                          <div className="row-between">
                            <div className="title-with-badge">
                              {!rep.visto && <span className="unread-dot-mini" title="No visto" style={{ backgroundColor: 'var(--color-bosque-helecho)' }}></span>}
                              <div>
                                <h3 className="card-title title-soporte" style={{ color: 'var(--color-bosque-helecho)' }}>{rep.voluntarioNombre}</h3>
                                <span className="meta-text">{rep.voluntarioEmail}</span>
                              </div>
                            </div>
                            <div className="voluntario-stats">
                              <span className="hours-tag">
                                {rep.horas} {rep.horas === 1 ? 'Hora' : 'Horas'}
                              </span>
                              <p className="voluntario-date-time">{rep.fecha} · {rep.horaInicio}–{rep.horaFin}</p>
                            </div>
                          </div>
                          <div className="message-box box-voluntario">
                            <strong className="box-title-inner inner-title-voluntario">Detalles de la labor ({rep.tipoTarea}):</strong>
                            <p className="message-text">{rep.tareas}</p>
                          </div>
                          {rep.pruebas && (
                            <div className="evidence-box">
                              <strong>Evidencia adjunta:</strong> 
                              {rep.pruebas.startsWith('data:image') ? (
                                  <img src={rep.pruebas} alt="Prueba de labor" style={{ display: 'block', maxWidth: '100%', borderRadius: '8px', marginTop: '8px', border: '1px solid #ddd' }} />
                              ) : (
                                  <p className="meta-text">{rep.pruebas}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Helpers ── */
function Vacia({ mensaje }) {
  return (
    <div className="empty-message-container">
      <p className="empty-message-text">{mensaje}</p>
    </div>
  );
}

export default BuzonTab;

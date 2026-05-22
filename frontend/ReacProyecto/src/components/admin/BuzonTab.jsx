import React, { useState, useEffect, useCallback } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { 
  MessageSquare, 
  ShieldAlert, 
  UserPlus, 
  ClipboardCheck, 
  Activity, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Clock, 
  Calendar,
  MoreVertical,
  Check,
  Search,
  Bell,
  ChevronRight,
  Filter,
  Eye,
  MoreHorizontal,
  Loader2
} from 'lucide-react';

const ESTADOS_SOPORTE = ['Pendiente', 'En Proceso', 'Leído', 'Solucionado'];
const ESTADOS_ROBO    = ['Pendiente', 'En Investigación', 'Resuelto'];

function StatusBadge({ estado }) {
  const est = (estado || 'Pendiente').toLowerCase().replace(' ', '');
  const getColors = () => {
    switch(est) {
      case 'solucionado':
      case 'resuelto':
      case 'aprobada':
        return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--ui-success)' };
      case 'enproceso':
      case 'eninvestigación':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--ui-info)' };
      case 'rechazada':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--ui-error)' };
      default:
        return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--ui-warning)' };
    }
  };
  
  const colors = getColors();
  
  return (
    <span style={{ 
      padding: '4px 10px', 
      borderRadius: '20px', 
      fontSize: '0.65rem', 
      fontWeight: 800, 
      textTransform: 'uppercase',
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.text}20`
    }}>
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
  const [subPostulacion, setSubPostulacion] = useState('pendiente');
  const [subLabor, setSubLabor] = useState('nuevas');
  const [subSoporte, setSubSoporte] = useState('usuarios');

  // Ref estable para evitar que refrescarNotificaciones recree cargarDatos en cada render del padre
  const refrescarRef = React.useRef(refrescarNotificaciones);
  useEffect(() => { refrescarRef.current = refrescarNotificaciones; }, [refrescarNotificaciones]);

  // background=true: refresco silencioso (sin spinner), background=false: carga inicial o manual
  const cargarDatos = useCallback(async (background = false) => {
    if (!background) setCargando(true);
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
    } catch (err) { console.error(err);
      console.error('Error al cargar datos del buzón:', err);
    } finally {
      if (refrescarRef.current) refrescarRef.current();
      if (!background) setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos(false);
    const interval = setInterval(() => cargarDatos(true), 60000);
    return () => clearInterval(interval);
  }, [cargarDatos]);

  const getSolUserId = (sol) => sol.usuario_id || sol.userId;
  const getSolUserName = (sol) => sol.Usuario?.nombre || sol.userName || 'Usuario';
  const getSolUserEmail = (sol) => sol.Usuario?.email || sol.userEmail || '';

  const handleAprobarSolicitud = async (sol) => {
    const res = await Swal.fire({
      title: 'Validar Postulación',
      text: `¿Deseas oficializar a ${getSolUserName(sol)} como miembro del equipo?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-primary)',
      confirmButtonText: 'Aprobar Ingreso',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      const userId = getSolUserId(sol);
      const allUsers = await services.getUsuarios();
      const userObj = allUsers.find(u => u.id === userId);

      if (userObj) {
          await services.putUsuarios({ ...userObj, rol: 'voluntario' }, userObj.id);
      }
      await services.putSolicitudVoluntariado({ estado: 'aprobada' }, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'aprobada' } : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire('¡Éxito!', 'Nuevo integrante incorporado correctamente.', 'success');
    } catch (err) { console.error(err);
      Swal.fire('Error', 'No se pudo procesar el cambio de rol.', 'error');
    }
  };

  const handleRechazarSolicitud = async (sol) => {
    const res = await Swal.fire({
      title: 'Descartar Postulación',
      text: `Se notificará al usuario sobre esta decisión.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-error)',
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'Volver'
    });
    if (!res.isConfirmed) return;

    try {
      await services.putSolicitudVoluntariado({ estado: 'rechazada' }, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'rechazada' } : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire('Información', 'La postulación ha sido rechazada.', 'info');
    } catch {
      Swal.fire('Error', 'No se pudo completar la acción.', 'error');
    }
  };

  const handleVistoSolicitud = async (sol) => {
    if (sol.visto) return;
    try {
      const updated = { ...sol, visto: true };
      await services.putSolicitudVoluntariado(updated, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? updated : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) { console.error(err);
      console.error("Error al marcar como visto:", err);
    }
  };

  const handleVistoReporteVoluntario = async (rep) => {
    if (rep.visto) return;
    try {
      const updated = { ...rep, visto: true };
      await services.putReporteVoluntariado(updated, rep.id);
      setReportesVoluntario(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) { console.error(err);
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
    } catch (err) { console.error(err);
      console.error("Error al marcar soporte como visto:", err);
    }
  };

  const handleAprobarSolicitudTarea = async (log) => {
    const { value: date } = await Swal.fire({
      title: 'Programar Labor',
      text: 'Indica la fecha de ejecución para esta tarea:',
      icon: 'calendar',
      input: 'date',
      inputAttributes: { min: new Date().toISOString().split('T')[0] },
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-primary)',
      confirmButtonText: 'Asignar Fecha',
      cancelButtonText: 'Volver'
    });

    if (date) {
      try {
        const reporteActualizado = { ...log, estado: 'asignado', fecha: date, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, log.id);
        setReportesVoluntario(prev => prev.map(r => r.id === log.id ? reporteActualizado : r));
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'success', title: 'Tarea Programada', timer: 2000, showConfirmButton: false });
      } catch (error) { console.error(error);
        Swal.fire('Error', 'No se pudo actualizar la programación.', 'error');
      }
    }
  };

  const handleRechazarSolicitudTarea = async (log) => {
    const { value: motivo } = await Swal.fire({
      title: 'Rechazar Labor',
      input: 'textarea',
      inputLabel: 'Razón técnica del rechazo',
      inputPlaceholder: 'Superposición de horarios...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar'
    });
    if (motivo !== undefined) {
      try {
        const reporteActualizado = { ...log, estado: 'rechazado_pre', motivoRechazo: motivo, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, log.id);
        setReportesVoluntario(prev => prev.map(r => r.id === log.id ? reporteActualizado : r));
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'info', title: 'Solicitud Denegada', timer: 2000, showConfirmButton: false });
      } catch (error) { console.error(error);
        Swal.fire('Error', 'No se pudo procesar el rechazo.', 'error');
      }
    }
  };

  const handleEstadoRobo = async (rep, nuevoEstado) => {
    // GUARDAR ESTADO PREVIO PARA ROLLBACK
    const previousState = [...reportesRobo];
    const updated = { ...rep, estado: nuevoEstado, visto: true };

    // ACTUALIZACIÓN OPTIMISTA
    setReportesRobo(prev => prev.map(r => r.id === rep.id ? updated : r));

    try {
      await services.putReportesRobados(updated, rep.id);
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) { console.error(err);
      // ROLLBACK EN CASO DE ERROR
      setReportesRobo(previousState);
      Swal.fire('Error de Conexión', 'No se pudo actualizar el estado en el servidor. El cambio ha sido revertido.', 'error');
    }
  };

  const handleEliminarRobo = async (id) => {
    const res = await Swal.fire({
      title: '¿Archivar Alerta?',
      text: 'Esta alerta dejará de ser visible en el centro de control.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-error)',
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    const previousState = [...reportesRobo];
    // ACTUALIZACIÓN OPTIMISTA
    setReportesRobo(prev => prev.filter(r => r.id !== id));

    try {
      await services.deleteReportesRobados(id);
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) { console.error(err);
      // ROLLBACK
      setReportesRobo(previousState);
      Swal.fire('Error', 'No se pudo archivar el registro. Intenta de nuevo.', 'error');
    }
  };

  const handleEliminarSoporte = async (id) => {
    const previousState = [...reportesSoporte];
    // ACTUALIZACIÓN OPTIMISTA
    setReportesSoporte(prev => prev.filter(r => r.id !== id));
    
    try {
      await services.deleteReportes(id);
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) { console.error(err);
      // ROLLBACK
      setReportesSoporte(previousState);
      Swal.fire('Error', 'No se pudo borrar el mensaje.', 'error');
    }
  };

  const solicitudesLabores = reportesVoluntario.filter(r => r.estado === 'solicitado');
  const laboresNormales = reportesVoluntario.filter(r => r.estado !== 'solicitado');

  const tabs = [
    { id: 'soporte', label: 'Mensajes', icon: <MessageSquare size={18} />, count: reportesSoporte.filter(r => !r.visto).length },
    { id: 'robos', label: 'Alertas', icon: <ShieldAlert size={18} />, count: reportesRobo.filter(r => !r.visto).length },
    { id: 'postulaciones', label: 'Ingresos', icon: <UserPlus size={18} />, count: solicitudesVol.filter(s => !s.visto).length },
    { id: 'solicitudes_labores', label: 'Tareas', icon: <ClipboardCheck size={18} />, count: solicitudesLabores.filter(r => !r.visto).length },
    { id: 'actividades', label: 'Historial', icon: <Activity size={18} />, count: reportesVoluntario.filter(r => r.estado === 'enviado' && !r.visto).length },
  ];

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0 }}>Centro de Notificaciones</h2>
            <p className="text-muted">Monitoreo y respuesta a la actividad global de BioMon</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="ui-btn ui-btn--ghost" 
              onClick={cargarDatos}
              disabled={cargando}
            >
              <RefreshCw size={18} className={cargando ? 'animate-spin' : ''} style={{ marginRight: '8px' }} />
              Sincronizar
            </button>
          </div>
        </div>

        <div className="buzon-tabs-navigation" style={{ marginTop: '2.5rem' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setSeccion(t.id)}
              className={`buzon-tab-pill ${seccion === t.id ? 'active' : ''}`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.count > 0 && (
                <span className="count-badge animate-pulse">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="buzon-content-area">
        {cargando ? (
          <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}>
             <Loader2 className="animate-spin text-primary" size={40} />
             <p className="text-muted">Actualizando bandeja de entrada...</p>
          </div>
        ) : (
          <div className="reportes-grid grid-auto">
            {/* SECCIÓN SOPORTE */}
            {seccion === 'soporte' && (
              <>
                <div className="sub-tabs-container" style={{ gridColumn: '1/-1' }}>
                  <div className="sub-tabs-pills">
                    <button className={`sub-pill ${subSoporte === 'usuarios' ? 'active' : ''}`} onClick={() => setSubSoporte('usuarios')}>
                      Comunidad ({reportesSoporte.filter(r => r.Rol?.nombre !== 'voluntario').length})
                    </button>
                    <button className={`sub-pill ${subSoporte === 'voluntarios' ? 'active' : ''}`} onClick={() => setSubSoporte('voluntarios')}>
                      Equipo Interno ({reportesSoporte.filter(r => r.Rol?.nombre === 'voluntario').length})
                    </button>
                  </div>
                </div>
                {reportesSoporte
                  .filter(r => subSoporte === 'voluntarios' ? r.Rol?.nombre === 'voluntario' : r.Rol?.nombre !== 'voluntario')
                  .map((rep, idx) => (
                    <div 
                      key={rep.id} 
                      className={`premium-card report-card fade-in ${!rep.visto ? 'unread' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s`, cursor: 'pointer' }}
                      onClick={() => handleVistoSoporte(rep)}
                    >
                      <div className="flex-between" style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                          <Clock size={14} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{rep.fecha}</span>
                        </div>
                        <StatusBadge estado={rep.estado || 'Recibido'} />
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900 }}>{rep.asunto}</h3>
                      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.2rem', fontWeight: 700 }}>
                        <Mail size={12} style={{ marginRight: '6px' }} />
                        {rep.Usuario?.nombre || rep.userName || 'Anónimo'}
                      </p>
                      <div className="report-content-box" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {rep.contenido || rep.mensaje}
                      </div>
                      <div className="flex-between" style={{ borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: '1.2rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ui-primary)' }}>ACTUALIZAR:</span>
                           <select 
                             className="ui-input"
                             style={{ padding: '4px 8px', fontSize: '0.75rem', height: 'auto', width: '120px' }}
                             value={rep.estado || 'Pendiente'}
                             onClick={(e) => e.stopPropagation()}
                             onChange={(e) => {
                               const prev = { ...rep };
                               const updated = { ...rep, estado: e.target.value, visto: true };
                               setReportesSoporte(list => list.map(r => r.id === rep.id ? updated : r));
                               services.putReportes(updated, rep.id).catch(() => {
                                 setReportesSoporte(list => list.map(r => r.id === rep.id ? prev : r));
                               });
                             }}
                           >
                             {ESTADOS_SOPORTE.map(est => <option key={est} value={est}>{est}</option>)}
                           </select>
                         </div>
                         <button 
                           className="ui-btn ui-btn--ghost" 
                           onClick={(e) => { e.stopPropagation(); handleEliminarSoporte(rep.id); }} 
                           style={{ padding: '8px', color: 'var(--ui-error)' }}
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                ))}
              </>
            )}

            {/* SECCIÓN ROBOS */}
            {seccion === 'robos' && reportesRobo.map((rep, idx) => (
              <div 
                key={rep.id} 
                className={`premium-card report-card type-robo fade-in ${!rep.visto ? 'unread' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s`, borderLeft: '4px solid var(--ui-error)' }}
                onClick={() => !rep.visto && handleEstadoRobo(rep, rep.estado || 'En Investigación')}
              >
                <div className="flex-between" style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ui-error)' }}>
                    <ShieldAlert size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{new Date(rep.fecha).toLocaleDateString()}</span>
                  </div>
                  <StatusBadge estado={rep.estado} />
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900 }}>Incidente: {rep.asunto}</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                  Informado por: <strong>{rep.Usuario?.nombre || 'Visitante'}</strong>
                </p>
                <div className="report-content-box" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', color: 'var(--color-tierra-sombra)' }}>
                  {rep.contenido || rep.descripcion}
                </div>
                <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                   <select 
                     className="ui-input"
                     style={{ padding: '4px 8px', fontSize: '0.75rem', height: 'auto', width: '140px' }}
                     value={rep.estado || 'Pendiente'}
                     onClick={(e) => e.stopPropagation()}
                     onChange={(e) => handleEstadoRobo(rep, e.target.value)}
                   >
                     {ESTADOS_ROBO.map(est => <option key={est} value={est}>{est}</option>)}
                   </select>
                   <button className="ui-btn ui-btn--ghost" style={{ color: 'var(--ui-error)' }} onClick={(e) => { e.stopPropagation(); handleEliminarRobo(rep.id); }}>
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}

            {/* SECCIÓN POSTULACIONES */}
            {seccion === 'postulaciones' && (
              <>
                <div className="sub-tabs-container" style={{ gridColumn: '1/-1' }}>
                  <div className="sub-tabs-pills">
                    {[
                      { value: 'pendiente', label: 'Pendientes' },
                      { value: 'aprobada',  label: 'Aprobadas'  },
                      { value: 'rechazada', label: 'Rechazadas' },
                    ].map(({ value, label }) => (
                      <button key={value} className={`sub-pill ${subPostulacion === value ? 'active' : ''}`} onClick={() => setSubPostulacion(value)}>
                        {label} ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === value).length})
                      </button>
                    ))}
                  </div>
                </div>
                {solicitudesVol
                  .filter(sol => (sol.estado || 'pendiente').toLowerCase() === subPostulacion)
                  .map((sol, idx) => (
                    <div 
                      key={sol.id} 
                      className={`premium-card report-card fade-in ${!sol.visto ? 'unread' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => handleVistoSolicitud(sol)}
                    >
                      <div className="flex-between" style={{ marginBottom: '1.2rem' }}>
                        <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                          {new Date(sol.fecha).toLocaleDateString()}
                        </span>
                        <StatusBadge estado={sol.estado} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                         <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--ui-primary-bg)', color: 'var(--ui-primary)', fontWeight: 900 }}>
                            {getSolUserName(sol).charAt(0)}
                         </div>
                         <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{getSolUserName(sol)}</h3>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{getSolUserEmail(sol)}</span>
                         </div>
                      </div>
                      <div className="report-content-box" style={{ fontStyle: 'italic', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        "{sol.mensaje}"
                      </div>
                      {subPostulacion === 'pendiente' && (
                        <div className="flex-center" style={{ gap: '10px' }}>
                           <button className="ui-btn ui-btn--ghost" style={{ flex: 1, color: 'var(--ui-error)' }} onClick={() => handleRechazarSolicitud(sol)}>Descartar</button>
                           <button className="ui-btn ui-btn--primary" onClick={() => handleAprobarSolicitud(sol)} style={{ flex: 1.5 }}>Aprobar Ingreso</button>
                        </div>
                      )}
                    </div>
                ))}
              </>
            )}

            {/* SECCIÓN TAREAS */}
            {seccion === 'solicitudes_labores' && solicitudesLabores.map((rep, idx) => (
              <div 
                key={rep.id} 
                className={`premium-card report-card fade-in ${!rep.visto ? 'unread' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => handleVistoReporteVoluntario(rep)}
              >
                <div className="flex-between" style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                    <Calendar size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{new Date(rep.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div style={{ background: 'var(--ui-primary-bg)', color: 'var(--ui-primary)', padding: '4px 10px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900 }}>
                    {rep.horas} HORAS
                  </div>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900 }}>{rep.voluntarioNombre}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.2rem' }}>
                   <ClipboardCheck size={14} className="text-primary" />
                   <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rep.tipoTarea}</span>
                </div>
                <div className="report-content-box" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                   {rep.tareas || 'Propuesta de labor sin descripción detallada'}
                </div>
                <div className="flex-center" style={{ gap: '10px' }}>
                   <button className="ui-btn ui-btn--ghost" style={{ flex: 1, color: 'var(--ui-error)' }} onClick={() => handleRechazarSolicitudTarea(rep)}>Rechazar</button>
                   <button className="ui-btn ui-btn--primary" onClick={() => handleAprobarSolicitudTarea(rep)} style={{ flex: 1.5 }}>Programar Fecha</button>
                </div>
              </div>
            ))}

            {/* SECCIÓN HISTORIAL (ACTIVIDADES) */}
            {seccion === 'actividades' && (
              <>
                <div className="sub-tabs-container" style={{ gridColumn: '1/-1' }}>
                  <div className="sub-tabs-pills">
                    <button className={`sub-pill ${subLabor === 'nuevas' ? 'active' : ''}`} onClick={() => setSubLabor('nuevas')}>
                      Pendientes ({reportesVoluntario.filter(r => r.estado === 'enviado' && !r.visto).length})
                    </button>
                    <button className={`sub-pill ${subLabor === 'revisadas' ? 'active' : ''}`} onClick={() => setSubLabor('revisadas')}>
                      Verificados ({reportesVoluntario.filter(r => r.visto || r.estado === 'aprobado').length})
                    </button>
                  </div>
                </div>
                {laboresNormales
                  .filter(rep => subLabor === 'nuevas' ? !rep.visto : rep.visto)
                  .map((rep, idx) => (
                    <div 
                      key={rep.id} 
                      className={`premium-card report-card fade-in ${!rep.visto ? 'unread' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => handleVistoReporteVoluntario(rep)}
                    >
                      <div className="flex-between" style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                          <Calendar size={14} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{rep.fecha}</span>
                        </div>
                        <div style={{ background: 'var(--color-ocre-silvestre)', color: '#fff', padding: '4px 10px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900 }}>
                          {rep.horas} HORAS
                        </div>
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900 }}>{rep.voluntarioNombre}</h3>
                      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.2rem', fontWeight: 700 }}>{rep.tipoTarea}</p>
                      <div className="report-content-box" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
                        {rep.tareas}
                      </div>
                      {rep.pruebas && (
                        <div className="evidence-preview" style={{ marginTop: '1.5rem' }}>
                          {rep.pruebas.startsWith('data:image') ? (
                            <img src={rep.pruebas} alt="Evidencia" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                          ) : (
                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                               <Eye size={16} />
                               <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Evidencia textual adjunta</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                ))}
              </>
            )}

            {/* ESTADO VACÍO GLOBAL */}
            {((seccion === 'soporte' && reportesSoporte.length === 0) || 
              (seccion === 'robos' && reportesRobo.length === 0) ||
              (seccion === 'postulaciones' && solicitudesVol.length === 0) ||
              (seccion === 'solicitudes_labores' && solicitudesLabores.length === 0)) && (
               <div className="premium-card flex-center fade-in" style={{ gridColumn: '1/-1', padding: '5rem', flexDirection: 'column', textAlign: 'center' }}>
                 <div className="flex-center" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.03)', marginBottom: '1.5rem', color: 'var(--ui-primary)' }}>
                    <Bell size={40} />
                 </div>
                 <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900 }}>Bandeja al día</h3>
                 <p className="text-muted" style={{ maxWidth: '300px' }}>No hay nuevas notificaciones o reportes en esta categoría por el momento.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuzonTab;

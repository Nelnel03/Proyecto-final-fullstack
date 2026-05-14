import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  Check,
  XCircle,
  Clock,
  CheckCircle2,
  CalendarDays,
  Hourglass,
  Eye,
  Briefcase,
  Camera,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import services from '../../services/services';
import ImageUploadField from '../ImageUploadField';
import '../../styles/MainPagesInicoAdmin.css';
import '../../styles/VoluntariadoPremium.css';

function VoluntariadosTab({
  refrescarNotificaciones,
  modoEdicionVoluntariado,
  handleVoluntariadoSubmit,
  formVoluntariado,
  setFormVoluntariado,
  resetFormVoluntariado,
  voluntariados,
  handleEditarVoluntariado,
  handleEliminarVoluntariado,
  handleConvertirVoluntariadoAUsuario,
  refrescarVoluntarios // Nueva prop
}) {
  const [subTab, setSubTab] = useState('lista');
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [actualizandoAvatarId, setActualizandoAvatarId] = useState(null);

  const handleAvatarClick = (volId) => {
    document.getElementById(`vol-avatar-input-${volId}`).click();
  };

  const handleAvatarChange = async (e, vol) => {
    const file = e.target.files[0];
    if (!file) return;

    setActualizandoAvatarId(vol.id);
    try {
      const url = await services.uploadImage(file);
      await services.putVoluntariados({ ...vol, fotoPerfil: url }, vol.id);
      
      if (refrescarVoluntarios) await refrescarVoluntarios();
      
      Swal.fire({
        title: '¡Actualizado!',
        text: 'Foto de perfil del voluntario cambiada',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar la foto', 'error');
    } finally {
      setActualizandoAvatarId(null);
    }
  };

  // Estados para Tareas Predeterminadas
  const [tareasDisponibles, setTareasDisponibles] = useState([]);
  const [formTarea, setFormTarea] = useState({ id: null, titulo: '', descripcion: '', horas: '', dias: '' });
  const [modoEdicionTarea, setModoEdicionTarea] = useState(false);
  const [isCustomTitulo, setIsCustomTitulo] = useState(false);

  useEffect(() => {
    cargarLogs();
    cargarTareasDisponibles();
  }, []);

  useEffect(() => {
    if (subTab === 'logs') {
      cargarLogs();
    } else if (subTab === 'tareas') {
      cargarTareasDisponibles();
    }
  }, [subTab]);

  const cargarTareasDisponibles = async () => {
    try {
      const data = await services.getTareasDisponibles();
      setTareasDisponibles(data);
    } catch (error) {
      console.error('Error al cargar tareas disponibles:', error);
    }
  };

  const resetFormTarea = () => {
    setFormTarea({ id: null, titulo: '', descripcion: '', horas: '', dias: '' });
    setModoEdicionTarea(false);
    setIsCustomTitulo(false);
  };

  const handleGuardarTarea = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicionTarea && formTarea.id) {
        await services.putTareaDisponible(formTarea, formTarea.id);
        setTareasDisponibles(tareasDisponibles.map(t => t.id === formTarea.id ? formTarea : t));
        Swal.fire('Actualizado', 'La tarea ha sido actualizada.', 'success');
      } else {
        const nuevaTarea = await services.postTareaDisponible({
          titulo: formTarea.titulo,
          descripcion: formTarea.descripcion,
          horas: parseFloat(formTarea.horas),
          dias: formTarea.dias || 'Cualquier día'
        });
        setTareasDisponibles([...tareasDisponibles, nuevaTarea.tarea || nuevaTarea]);
        Swal.fire('Registrada', 'Nueva tarea creada exitosamente.', 'success');
      }
      resetFormTarea();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la tarea.', 'error');
    }
  };

  const handleEliminarTarea = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar tarea?',
      text: 'Los voluntarios ya no podrán seleccionarla.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    });
    if (result.isConfirmed) {
      try {
        await services.deleteTareaDisponible(id);
        setTareasDisponibles(tareasDisponibles.filter(t => t.id !== id));
        Swal.fire('Eliminada', 'La tarea ha sido retirada.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar.', 'error');
      }
    }
  };

  const cargarLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await services.getReportesVoluntariado();
      const sorted = (data || []).sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      setLogs(sorted);
      if (sorted.length > 0) setSelectedLog(sorted[0]);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleAprobarHoras = async (log) => {
    if (log.estado === 'aprobado') {
      Swal.fire({ icon: 'info', title: 'Ya aprobado', text: 'Este reporte ya fue aprobado anteriormente.', timer: 2000, showConfirmButton: false });
      return;
    }

    // Validación de tiempo mínimo (menor a 1 hora)
    if (log.horas < 1) {
      const warningResult = await Swal.fire({
        title: '¡Tiempo Insuficiente!',
        html: `El voluntario <b>${log.voluntarioNombre}</b> registró solo <b>${log.horas}h</b>, lo cual no cumple el mínimo de 1 hora.<br><br>¿Qué deseas hacer con este reporte?`,
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#10b981',
        denyButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Evaluar de todos modos',
        denyButtonText: 'Rechazar reporte',
        cancelButtonText: 'Cancelar'
      });

      if (warningResult.isDenied) {
        // Secuencia de rechazo
        const { value: motivo } = await Swal.fire({
          title: 'Motivo del rechazo',
          input: 'textarea',
          inputPlaceholder: 'Ej: El tiempo mínimo requerido es de 1 hora...',
          inputValidator: (value) => !value && 'Debes explicar por qué se rechaza.'
        });

        if (motivo) {
          try {
            const reporteRechazado = { ...log, estado: 'rechazado', motivoRechazo: motivo, visto: true };
            await services.putReporteVoluntariado(reporteRechazado, log.id);
            const updated = logs.map(l => l.id === log.id ? reporteRechazado : l);
            setLogs(updated);
            if (selectedLog?.id === log.id) setSelectedLog(reporteRechazado);
            if (refrescarNotificaciones) refrescarNotificaciones();
            Swal.fire('Rechazado', 'El reporte de horas ha sido rechazado.', 'success');
          } catch (error) {
            Swal.fire('Error', 'No se pudo rechazar el reporte.', 'error');
          }
        }
        return; // Detenemos aquí si se rechazó
      } else if (!warningResult.isConfirmed) {
        return; // Detenemos aquí si se canceló
      }
    }
    
    // Si la validación pasó, o el admin decidió "Evaluar de todos modos":
    const result = await Swal.fire({
      title: 'Aprobar Horas',
      html: `
        <p style="margin-bottom: 10px;"><b>${log.voluntarioNombre}</b> reportó <b>${log.horas}h</b> en <b>${log.tipoTarea}</b>.</p>
        <p style="font-size: 0.85rem; color: #666;">Verifica la evidencia y ajusta las horas si es necesario:</p>
      `,
      input: 'number',
      inputValue: log.horas > 0 ? log.horas : 1, // Si es 0, sugerimos 1 mínimo
      inputAttributes: {
        min: 0,
        step: 'any'
      },
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Confirmar Horas',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed && result.value !== undefined) {
      const horasFinales = parseFloat(result.value);
      try {
        const reporteActualizado = { ...log, estado: 'aprobado', horas: horasFinales, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, log.id);
        const updated = logs.map(l => l.id === log.id ? reporteActualizado : l);
        setLogs(updated);
        if (selectedLog?.id === log.id) setSelectedLog(reporteActualizado);
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ 
          icon: 'success', 
          title: '¡Horas aprobadas!', 
          text: `Se validaron ${horasFinales}h para ${log.voluntarioNombre}. El voluntario ya puede verlo en su panel.`, 
          timer: 3000, 
          showConfirmButton: false 
        });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el estado del reporte.' });
      }
    }
  };

  const handleVerEvidencia = (log) => {
    if (!log.pruebas) {
      Swal.fire({ icon: 'info', title: 'Sin Evidencias', text: 'El voluntario no adjuntó un archivo de evidencia.' });
      handleMarcarComoVisto(log);
      return;
    }
    handleMarcarComoVisto(log);
    Swal.fire({
      title: 'Evidencia del Trabajo',
      text: log.tareas || 'Sin descripción adicional',
      imageUrl: log.pruebas,
      imageAlt: 'Evidencia fotográfica',
      imageHeight: 300,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Cerrar'
    });
  };

  const handleMarcarComoVisto = async (log) => {
    if (log.visto) return;
    try {
      const reporteActualizado = { ...log, visto: true };
      await services.putReporteVoluntariado(reporteActualizado, log.id);
      const updated = logs.map(l => l.id === log.id ? reporteActualizado : l);
      setLogs(updated);
      if (selectedLog?.id === log.id) setSelectedLog(reporteActualizado);
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (error) {
      console.error('Error al marcar como visto:', error);
    }
  };

  const handleSolicitarCorreccion = async (log) => {
    const result = await Swal.fire({
      title: 'Solicitar corrección',
      input: 'textarea',
      inputLabel: 'Motivo de la corrección',
      inputPlaceholder: 'Describe qué debe corregir el voluntario...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Enviar solicitud',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed && result.value) {
      Swal.fire({ icon: 'success', title: 'Solicitud enviada', text: 'El voluntario deberá corregir su reporte.', timer: 2000, showConfirmButton: false });
    }
  };

  const handleAprobarAsignacion = async (log) => {
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
        const updated = logs.map(l => l.id === log.id ? reporteActualizado : l);
        setLogs(updated);
        if (selectedLog?.id === log.id) setSelectedLog(reporteActualizado);
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'success', title: 'Asignación Aprobada', text: 'Se ha asignado la labor al voluntario exitosamente.', timer: 2500, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'No se pudo aprobar la asignación.', 'error');
      }
    }
  };

  const handleRechazarAsignacion = async (log) => {
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
        const updated = logs.map(l => l.id === log.id ? reporteActualizado : l);
        setLogs(updated);
        if (selectedLog?.id === log.id) setSelectedLog(reporteActualizado);
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'success', title: 'Asignación Rechazada', text: 'El voluntario no podrá realizar esta labor.', timer: 2500, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'No se pudo rechazar la asignación.', 'error');
      }
    }
  };

  const getTaskColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return 'bg-fauna';
    if (t.includes('suelo') || t.includes('siembra')) return 'bg-soil';
    return 'bg-trail';
  };

  const logsFiltrados = filtroEstado === 'todos' ? logs 
                      : filtroEstado === 'pendientes_accion' ? logs.filter(l => l.estado === 'enviado' || l.estado === 'solicitado')
                      : filtroEstado === 'solicitados' ? logs.filter(l => l.estado === 'solicitado')
                      : filtroEstado === 'en_curso' ? logs.filter(l => l.estado === 'asignado' || l.estado === 'en_curso')
                      : filtroEstado === 'evidencias' ? logs.filter(l => l.estado === 'enviado')
                      : filtroEstado === 'aprobados' ? logs.filter(l => l.estado === 'aprobado')
                      : filtroEstado === 'rechazados' ? logs.filter(l => l.estado.startsWith('rechazado'))
                      : logs;
  const totalHoras = logs.reduce((acc, l) => acc + (Number(l.horas) || 0), 0);
  const totalAprobados = logs.filter(l => l.estado === 'aprobado').length;
  const totalPendientes = logs.filter(l => l.estado === 'enviado' || l.estado === 'solicitado').length;

  return (
    <div className="premium-tab-container">
      {/* Sub-navegación */}
      <div className="admin-subtab-nav" style={{ marginBottom: '2rem', display: 'flex', gap: '15px' }}>
        <button
          onClick={() => setSubTab('lista')}
          className={`admin-subtab-btn ${subTab === 'lista' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <Users size={18} /> Personal Activo
        </button>
        <button
          onClick={() => setSubTab('logs')}
          className={`admin-subtab-btn ${subTab === 'logs' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <ClipboardList size={18} /> Bitácora de Labores
        </button>
        <button
          onClick={() => setSubTab('tareas')}
          className={`admin-subtab-btn ${subTab === 'tareas' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <Briefcase size={18} /> Gestión de Tareas
        </button>
      </div>

      {subTab === 'lista' ? (
        <>
          <div className="admin-section-header">
            <h2 className="admin-section-title-white">Registro de Voluntariados</h2>
            <p className="admin-section-subtitle-green">Administrar la base de datos oficial de voluntarios y sus asignaciones</p>
          </div>

          <div id="voluntariado-form-container" className="admin-form-card admin-user-form-container">
            <h3 className="admin-user-form-title">
              {modoEdicionVoluntariado ? 'Editar Ficha de Voluntario' : 'Registrar Nuevo Voluntario'}
            </h3>
            <form onSubmit={handleVoluntariadoSubmit} className="admin-user-form">
              <div className="admin-form-group">
                <label className="admin-user-input-label">Nombre Completo</label>
                <input type="text" required value={formVoluntariado.nombre}
                  onChange={(e) => setFormVoluntariado({ ...formVoluntariado, nombre: e.target.value })}
                  placeholder="Ej: Carlos Rodríguez" className="admin-user-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-user-input-label">Área de Interés / Cargo</label>
                <input type="text" required value={formVoluntariado.area}
                  onChange={(e) => setFormVoluntariado({ ...formVoluntariado, area: e.target.value })}
                  placeholder="Ej: Siembra, Mantenimiento, Educación..." className="admin-user-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-user-input-label">Correo Electrónico</label>
                <input type="email" required value={formVoluntariado.email}
                  onChange={(e) => setFormVoluntariado({ ...formVoluntariado, email: e.target.value })}
                  placeholder="voluntario@bosque.com" className="admin-user-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-user-input-label">Teléfono</label>
                <input type="text" required maxLength={8} value={formVoluntariado.telefono}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormVoluntariado({ ...formVoluntariado, telefono: value });
                  }}
                  className="admin-user-input" />
              </div>
              <ImageUploadField 
                label="Foto del Voluntario" 
                value={formVoluntariado.fotoPerfil || ''} 
                onChange={(url) => setFormVoluntariado({...formVoluntariado, fotoPerfil: url})} 
                placeholder="Subir foto de identificación"
                circular={true}
              />
              <div className="admin-user-form-footer">
                <button type="submit" className="admin-btn-user-submit">
                  {modoEdicionVoluntariado ? 'Actualizar Ficha' : 'Registrar Voluntario'}
                </button>
                {modoEdicionVoluntariado && (
                  <button type="button" onClick={resetFormVoluntariado} className="admin-btn-user-cancel">Cancelar</button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-arboles-lista admin-user-list">
            {voluntariados.filter(vol => vol.rol === 'voluntario').map(vol => (
              <div key={vol.id} className="admin-arbol-card admin-user-card">
                <div className="admin-user-card-header">
                  <div 
                    className={`admin-user-avatar admin-vol-avatar interactive-avatar ${actualizandoAvatarId === vol.id ? 'loading' : ''}`}
                    onClick={() => handleAvatarClick(vol.id)}
                    title="Click para cambiar foto"
                  >
                    {actualizandoAvatarId === vol.id ? (
                      <Loader2 className="animate-spin" size={24} color="#fff" />
                    ) : vol.fotoPerfil ? (
                      <img src={vol.fotoPerfil} alt={vol.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span className="avatar-initials">{vol.nombre?.charAt(0).toUpperCase()}</span>
                    )}
                    <div className="avatar-overlay">
                      <Camera size={18} color="#fff" />
                    </div>
                    <input 
                      type="file" 
                      id={`vol-avatar-input-${vol.id}`}
                      accept="image/*"
                      onChange={(e) => handleAvatarChange(e, vol)}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <div className="admin-user-info-text">
                    <h3>{vol.nombre}</h3>
                    <p className="admin-vol-area">{vol.area}</p>
                  </div>
                </div>
                <div className="admin-vol-contact-box">
                  <p><strong>Email:</strong> {vol.email}</p>
                  <p><strong>Tel:</strong> {vol.telefono}</p>
                </div>
                <div className="admin-user-card-footer">
                  <button onClick={() => handleEditarVoluntariado(vol)} className="admin-btn-user-edit">Editar</button>
                  <button onClick={() => handleEliminarVoluntariado(vol.id, vol.nombre)} className="admin-btn-user-delete">Baja</button>
                  <button onClick={() => handleConvertirVoluntariadoAUsuario(vol)} className="admin-vol-btn-convert">Convertir a Usuario</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="premium-logs-view-wrapper" style={{ display: 'block' }}>
          {/* Columna principal */}
          <div className="logs-main-column">

            {/* Estadísticas rápidas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
              <div className="premium-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
                <Hourglass size={20} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--premium-text-muted)' }}>Horas Totales</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{totalHoras}h</div>
                </div>
              </div>
              <div className="premium-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--premium-text-muted)' }}>Aprobados</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{totalAprobados}</div>
                </div>
              </div>
              <div className="premium-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
                <Clock size={20} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--premium-text-muted)' }}>Pendientes</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{totalPendientes}</div>
                </div>
              </div>
            </div>

            {/* Encabezado y filtros */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                Bitácora de Labores
                {totalPendientes > 0 && (
                  <span className="premium-badge-pending" style={{ marginLeft: '12px', fontSize: '0.75rem' }}>
                    {totalPendientes} pendiente{totalPendientes !== 1 ? 's' : ''}
                  </span>
                )}
              </h1>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['todos', 'pendientes_accion', 'solicitados', 'en_curso', 'evidencias', 'aprobados', 'rechazados'].map(f => (
                  <button key={f} onClick={() => setFiltroEstado(f)} style={{
                    padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--premium-border)',
                    background: filtroEstado === f ? 'var(--premium-forest-dark)' : 'transparent',
                    color: filtroEstado === f ? '#fff' : 'var(--premium-text-muted)',
                    fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {f === 'todos' ? 'Todos' : f === 'pendientes_accion' ? 'Requiere Atención' : f === 'solicitados' ? 'Solicitudes' : f === 'en_curso' ? 'En Curso / Asignados' : f === 'evidencias' ? 'Evidencias' : f === 'rechazados' ? 'Rechazados' : 'Aprobados'}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de logs */}
            <div className="premium-logs-list">
              <div className="premium-log-row-header" style={{ padding: '10px 20px', fontSize: '0.7rem' }}>
                <span>Voluntario</span>
                <span>Fecha</span>
                <span>Actividad</span>
                <span>Horas</span>
                <span>Estado</span>
                <span>Acción</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loadingLogs ? (
                  <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--premium-text-muted)' }}>Cargando bitácora...</p>
                ) : logsFiltrados.length > 0 ? (
                  logsFiltrados.map(log => (
                    <div key={log.id}
                      className={`premium-log-item ${!log.visto ? 'unread-card' : ''}`}
                      onClick={() => !log.visto && handleMarcarComoVisto(log)}
                      style={{ padding: '14px 20px', cursor: 'pointer' }}
                    >
                      <div className="premium-vol-profile title-with-badge">
                        {!log.visto && <span className="unread-dot-mini" title="No visto"></span>}
                        <div className="premium-avatar" style={{ width: '35px', height: '35px' }}>
                          {log.voluntarioNombre?.charAt(0)}
                        </div>
                        <div className="premium-vol-name">
                          <h4 style={{ fontSize: '0.9rem' }}>{log.voluntarioNombre}</h4>
                          <span style={{ fontSize: '0.7rem' }}>{log.tareas?.substring(0, 30) || 'Sin descripción'}...</span>
                        </div>
                      </div>
                      <div data-label="Fecha" style={{ fontSize: '0.85rem', color: 'var(--premium-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CalendarDays size={13} /> {log.fecha}
                      </div>
                      <div data-label="Actividad">
                        <span className={`premium-task-badge ${getTaskColor(log.tipoTarea)}`}>{log.tipoTarea}</span>
                      </div>
                      <div data-label="Horas" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{log.horas}h</div>
                      <div data-label="Estado" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.estado === 'enviado' ? '#0f766e' : log.estado.startsWith('rechazado') ? '#ef4444' : log.estado === 'solicitado' ? '#3b82f6' : log.estado === 'en_curso' ? '#8b5cf6' : log.estado === 'asignado' ? '#a855f7' : '#10b981', flexShrink: 0 }}></div>
                        <span>{log.estado === 'enviado' ? 'Terminada' : log.estado.startsWith('rechazado') ? 'Rechazado' : log.estado === 'solicitado' ? 'Solicitado' : log.estado === 'en_curso' ? 'En Curso' : log.estado === 'asignado' ? 'Por Iniciar' : 'Aprobado'}</span>
                      </div>
                      <div className="premium-actions-cell" data-label="Acciones">
                        {log.estado === 'aprobado' ? (
                          <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: '#d1fae5', color: '#065f46', whiteSpace: 'nowrap' }}>
                            ✓ Aprobado
                          </span>
                        ) : log.estado.startsWith('rechazado') ? (
                          <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: '#fee2e2', color: '#991b1b', whiteSpace: 'nowrap' }}>
                            × Rechazado
                          </span>
                        ) : log.estado === 'solicitado' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAprobarAsignacion(log); }}
                              style={{ padding: '6px 10px', borderRadius: '20px', border: 'none', background: '#3b82f6', color: '#fff', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              <Check size={12} /> Asignar
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRechazarAsignacion(log); }}
                              style={{ padding: '6px 10px', borderRadius: '20px', border: 'none', background: '#fee2e2', color: '#991b1b', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              <XCircle size={12} /> Rechazar
                            </button>
                          </div>
                        ) : log.estado === 'asignado' ? (
                          <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: '#e0e7ff', color: '#4338ca', whiteSpace: 'nowrap' }}>
                            Por Iniciar
                          </span>
                        ) : log.estado === 'en_curso' ? (
                          <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: '#f3e8ff', color: '#7e22ce', whiteSpace: 'nowrap' }}>
                            En Curso...
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleVerEvidencia(log); }}
                              style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #10b981', color: '#10b981', background: 'transparent', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                              title="Ver Evidencia"
                            >
                              <Eye size={13} /> Ver
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAprobarHoras(log); }}
                              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: 'var(--premium-forest-dark)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                            >
                              <Check size={13} /> Aprobar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--premium-text-muted)' }}>
                    <ClipboardList size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
                    <p>No hay labores en esta categoría.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {subTab === 'tareas' && (
        <div className="admin-tab-content">
          <div className="admin-section-header">
            <h2 className="admin-section-title-white">Catálogo de Tareas Disponibles</h2>
            <p className="admin-section-subtitle-green">Administra las labores predeterminadas que los voluntarios podrán seleccionar en su panel.</p>
          </div>

          <div className="admin-form-card" style={{ marginBottom: '2rem' }}>
            <h3 className="admin-user-form-title">{modoEdicionTarea ? 'Editar Tarea' : 'Registrar Nueva Tarea Predeterminada'}</h3>
            <form onSubmit={handleGuardarTarea} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) minmax(200px, 1fr) 100px 200px', gap: '15px', alignItems: 'flex-end' }}>
              <div>
                <label className="admin-user-input-label">Título y Descripción</label>
                <select 
                  className="admin-user-input" 
                  value={isCustomTitulo ? 'Otro' : formTarea.titulo} 
                  onChange={e => {
                    if (e.target.value === 'Otro') {
                      setIsCustomTitulo(true);
                      setFormTarea({...formTarea, titulo: ''});
                    } else {
                      setIsCustomTitulo(false);
                      setFormTarea({...formTarea, titulo: e.target.value});
                    }
                  }} 
                  required={!isCustomTitulo}
                >
                  <option value="">-- Selecciona un título base --</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Plantación">Plantación</option>
                  <option value="Recolección de plásticos y basura">Recolección de plásticos y basura</option>
                  <option value="Colocación de abonos">Colocación de abonos</option>
                  <option value="Otro">Otro (Escribir título nuevo)</option>
                </select>
                {isCustomTitulo && (
                  <input type="text" value={formTarea.titulo} onChange={e => setFormTarea({...formTarea, titulo: e.target.value})} placeholder="Escribe el nuevo título de tarea..." className="admin-user-input" style={{ marginTop: '8px' }} required autoFocus />
                )}
                <input type="text" value={formTarea.descripcion} onChange={e => setFormTarea({...formTarea, descripcion: e.target.value})} placeholder="Breve instrucción o descripción..." className="admin-user-input" style={{ marginTop: '8px' }} required />
              </div>
              <div>
                <label className="admin-user-input-label">Días Asignados</label>
                <input type="text" value={formTarea.dias} onChange={e => setFormTarea({...formTarea, dias: e.target.value})} placeholder="Ej: Lunes a Viernes" className="admin-user-input" required />
              </div>
              <div>
                <label className="admin-user-input-label">Horas Fijas</label>
                <input type="number" step="0.5" value={formTarea.horas} onChange={e => setFormTarea({...formTarea, horas: e.target.value})} placeholder="4.5" className="admin-user-input" required />
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button type="submit" className="admin-btn-save" style={{ flex: 1, padding: '10px 0' }}>{modoEdicionTarea ? 'Validar Edición' : 'Crear Tarea'}</button>
                {modoEdicionTarea && <button type="button" onClick={resetFormTarea} className="admin-btn-cancel" style={{ flex: 1, padding: '10px 0' }}>Cancelar</button>}
              </div>
            </form>
          </div>

          <div className="premium-logs-list">
            <div className="premium-log-row-header" style={{ padding: '10px 20px', fontSize: '0.7rem', gridTemplateColumns: '1fr 150px 80px 120px' }}>
              <span>Detalles de la Tarea</span>
              <span>Días</span>
              <span>Horas</span>
              <span>Acciones</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tareasDisponibles.length > 0 ? (
                tareasDisponibles.map(t => (
                  <div key={t.id} className="premium-log-item" style={{ padding: '14px 20px', gridTemplateColumns: '1fr 150px 80px 120px', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primario)' }}>{t.titulo}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--premium-text-muted)' }}>{t.descripcion}</p>
                    </div>
                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={13}/> {t.dias}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.horas}h</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => { setFormTarea(t); setModoEdicionTarea(true); setIsCustomTitulo(!['Mantenimiento', 'Plantación', 'Recolección de plásticos y basura', 'Colocación de abonos'].includes(t.titulo)); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ padding: '6px 14px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => handleEliminarTarea(t.id)} style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Borrar</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--premium-text-muted)' }}>
                  <Briefcase size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
                  <p>Aún no has creado tareas predeterminadas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoluntariadosTab;

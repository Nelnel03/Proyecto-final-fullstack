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
  Loader2,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  X
} from 'lucide-react';
import Swal from 'sweetalert2';
import services from '../../services/services';
import { ImageUploadField } from '../common';
import '../../styles/admin/MainPagesInicoAdmin.css';
import '../../styles/admin/VoluntariadoPremium.css';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui';

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
  refrescarVoluntarios
}) {
  const [subTab, setSubTab] = useState('lista');
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [actualizandoAvatarId, setActualizandoAvatarId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const cargarLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await services.getReportesVoluntariado();
      const sorted = (data || []).sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      setLogs(sorted);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

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
      Swal.fire('Error', 'No se pudo actualizar la foto', 'error');
    } finally {
      setActualizandoAvatarId(null);
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

  const handleAprobarHoras = async (log) => {
    if (log.estado === 'aprobado') {
      Swal.fire({ icon: 'info', title: 'Ya aprobado', text: 'Este reporte ya fue aprobado anteriormente.', timer: 2000, showConfirmButton: false });
      return;
    }

    if (log.horas < 1) {
      const warningResult = await Swal.fire({
        title: '¡Tiempo Insuficiente!',
        html: `El voluntario <b>${log.voluntarioNombre}</b> registró solo <b>${log.horas}h</b>, lo cual no cumple el mínimo de 1 hora.`,
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: 'var(--ui-success)',
        denyButtonColor: 'var(--ui-error)',
        confirmButtonText: 'Evaluar de todos modos',
        denyButtonText: 'Rechazar reporte',
        cancelButtonText: 'Cancelar'
      });

      if (warningResult.isDenied) {
        const { value: motivo } = await Swal.fire({
          title: 'Motivo del rechazo',
          input: 'textarea',
          inputPlaceholder: 'Explica por qué se rechaza...',
          inputValidator: (value) => !value && 'Debes explicar por qué se rechaza.'
        });

        if (motivo) {
          try {
            const reporteRechazado = { ...log, estado: 'rechazado', motivoRechazo: motivo, visto: true };
            await services.putReporteVoluntariado(reporteRechazado, log.id);
            setLogs(logs.map(l => l.id === log.id ? reporteRechazado : l));
            if (refrescarNotificaciones) refrescarNotificaciones();
            Swal.fire('Rechazado', 'El reporte ha sido rechazado.', 'success');
          } catch (error) {
            Swal.fire('Error', 'No se pudo rechazar el reporte.', 'error');
          }
        }
        return;
      } else if (!warningResult.isConfirmed) return;
    }
    
    const result = await Swal.fire({
      title: 'Validar Horas',
      html: `<p><b>${log.voluntarioNombre}</b> reportó <b>${log.horas}h</b>.</p>`,
      input: 'number',
      inputValue: log.horas > 0 ? log.horas : 1,
      inputAttributes: { min: 0, step: 'any' },
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-primary)',
      confirmButtonText: 'Confirmar Horas'
    });

    if (result.isConfirmed && result.value !== undefined) {
      const horasFinales = parseFloat(result.value);
      try {
        const reporteActualizado = { ...log, estado: 'aprobado', horas: horasFinales, visto: true };
        await services.putReporteVoluntariado(reporteActualizado, log.id);
        setLogs(logs.map(l => l.id === log.id ? reporteActualizado : l));
        if (refrescarNotificaciones) refrescarNotificaciones();
        Swal.fire({ icon: 'success', title: '¡Aprobado!', text: `Se validaron ${horasFinales}h`, timer: 2000, showConfirmButton: false });
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar.', 'error');
      }
    }
  };

  const handleVerEvidencia = (log) => {
    if (!log.pruebas) {
      Swal.fire({ icon: 'info', title: 'Sin Evidencias', text: 'No se adjuntó evidencia fotográfica.' });
      return;
    }
    Swal.fire({
      title: 'Evidencia Fotográfica',
      text: log.tareas || 'Sin descripción',
      imageUrl: log.pruebas,
      imageAlt: 'Evidencia',
      confirmButtonColor: 'var(--ui-primary)'
    });
  };

  const getTaskColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna')) return 'rgba(245, 158, 11, 0.1)';
    if (t.includes('suelo')) return 'rgba(58, 90, 64, 0.1)';
    return 'rgba(59, 130, 246, 0.1)';
  };

  const getTaskTextColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna')) return 'var(--ui-warning)';
    if (t.includes('suelo')) return 'var(--ui-primary)';
    return 'var(--ui-info)';
  };

  const logsFiltrados = logs.filter(l => {
    if (filtroEstado === 'todos') return true;
    if (filtroEstado === 'pendientes') return l.estado === 'enviado' || l.estado === 'solicitado';
    if (filtroEstado === 'aprobados') return l.estado === 'aprobado';
    if (filtroEstado === 'rechazados') return l.estado.startsWith('rechazado');
    return true;
  });

  const totalHoras = logs.filter(l => l.estado === 'aprobado').reduce((acc, curr) => acc + (parseFloat(curr.horas) || 0), 0);
  const totalPendientes = logs.filter(l => l.estado === 'enviado' || l.estado === 'solicitado').length;

  const voluntariadosFiltrados = (voluntariados || []).filter(Boolean).filter(vol => vol.rol === 'voluntario');
  const {
    currentPage: pageVol,
    currentItems: currentVol,
    totalPages: totalPagesVol,
    paginate: paginateVol,
    totalItems: totalVol,
    itemsPerPage: itemsPerPageVol
  } = usePagination(voluntariadosFiltrados, 6);

  return (
    <div className="admin-tab-content-wrapper fade-in">
      
      {/* Sub-Tabs Navigation */}
      <div className="premium-card" style={{ padding: '0.8rem', marginBottom: '2.5rem', borderRadius: '20px', display: 'flex', gap: '8px' }}>
        {[
          { id: 'lista', label: 'Personal Activo', icon: Users },
          { id: 'logs', label: 'Bitácora BioMon', icon: ClipboardList },
          { id: 'tareas', label: 'Gestión de Tareas', icon: Briefcase }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setSubTab(item.id)}
            className={`ui-btn ${subTab === item.id ? 'ui-btn--primary' : 'ui-btn--ghost'}`}
            style={{ flex: 1, borderRadius: '14px', border: 'none', padding: '12px' }}
          >
            <item.icon size={18} style={{ marginRight: '8px' }} />
            {item.label}
          </button>
        ))}
      </div>

      {subTab === 'lista' && (
        <div className="fade-in">
          <div className="admin-section-header premium-card flex-between" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Fuerza de Voluntariado</h2>
              <p className="text-muted">Gestión de capital humano y asignaciones ecológicas</p>
            </div>
            <button 
              className={`ui-btn ${showForm || modoEdicionVoluntariado ? 'ui-btn--ghost' : 'ui-btn--primary'}`}
              onClick={() => { setShowForm(!showForm); if (modoEdicionVoluntariado) resetFormVoluntariado(); }}
            >
              {showForm || modoEdicionVoluntariado ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Nuevo Voluntario</>}
            </button>
          </div>

          {(showForm || modoEdicionVoluntariado) && (
            <div className="premium-card fade-in" style={{ padding: '2.5rem', marginBottom: '2.5rem', border: '2px solid var(--ui-primary-bg)' }}>
              <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                {modoEdicionVoluntariado ? 'Actualizar Ficha Técnica' : 'Registro de Incorporación'}
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); handleVoluntariadoSubmit(e); setShowForm(false); }} className="admin-grid-form">
                <div className="ui-field">
                  <label>Nombre Completo *</label>
                  <input type="text" className="ui-input" required value={formVoluntariado.nombre}
                    onChange={(e) => setFormVoluntariado({ ...formVoluntariado, nombre: e.target.value })} />
                </div>
                <div className="ui-field">
                  <label>Área de Especialidad *</label>
                  <input type="text" className="ui-input" required value={formVoluntariado.area}
                    onChange={(e) => setFormVoluntariado({ ...formVoluntariado, area: e.target.value })} />
                </div>
                <div className="ui-field">
                  <label>Correo Electrónico</label>
                  <input type="email" className="ui-input" required value={formVoluntariado.email}
                    onChange={(e) => setFormVoluntariado({ ...formVoluntariado, email: e.target.value })} />
                </div>
                <div className="ui-field">
                  <label>Teléfono de Contacto</label>
                  <input type="text" className="ui-input" required maxLength={8} value={formVoluntariado.telefono}
                    onChange={(e) => setFormVoluntariado({ ...formVoluntariado, telefono: e.target.value.replace(/\D/g, '') })} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <ImageUploadField 
                    label="Retrato de Identificación" 
                    value={formVoluntariado.fotoPerfil || ''} 
                    onChange={(url) => setFormVoluntariado({...formVoluntariado, fotoPerfil: url})} 
                    circular={true}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="ui-btn ui-btn--primary" style={{ padding: '12px 32px' }}>
                    {modoEdicionVoluntariado ? 'Guardar Cambios' : 'Incorporar Voluntario'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-arboles-lista grid-auto">
            {currentVol.map((vol, idx) => (
              <div key={vol.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.05}s`, display: 'flex', flexDirection: 'column' }}>
                <div className="card-header-visual" style={{ height: '100px', background: 'var(--ui-primary)', position: 'relative', marginBottom: '40px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                   <div 
                      style={{ position: 'absolute', bottom: '-35px', left: '20px', width: '80px', height: '80px', borderRadius: '24px', background: '#fff', padding: '4px', boxShadow: 'var(--sombra-suave)', cursor: 'pointer', overflow: 'hidden' }}
                      onClick={() => handleAvatarClick(vol.id)}
                   >
                     {actualizandoAvatarId === vol.id ? (
                       <div className="flex-center" style={{ width: '100%', height: '100%', background: 'var(--ui-primary)' }}><Loader2 size={24} color="#fff" className="animate-spin" /></div>
                     ) : vol.fotoPerfil ? (
                       <img src={vol.fotoPerfil} alt={vol.nombre} style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }} />
                     ) : (
                       <div className="flex-center" style={{ width: '100%', height: '100%', background: 'var(--ui-primary-bg)', color: 'var(--ui-primary)', fontSize: '1.5rem', fontWeight: 900 }}>{vol.nombre?.charAt(0)}</div>
                     )}
                     <input type="file" id={`vol-avatar-input-${vol.id}`} accept="image/*" onChange={(e) => handleAvatarChange(e, vol)} style={{ display: 'none' }} />
                   </div>
                </div>

                <div className="card-body" style={{ padding: '0 1.5rem 1.5rem' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{vol.nombre}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ui-primary)', fontWeight: 700, fontSize: '0.75rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    <ShieldCheck size={14} /> {vol.area || 'GENERAL'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                    <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ opacity: 0.5 }}>Email:</span> {vol.email}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ opacity: 0.5 }}>Tel:</span> {vol.telefono}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button onClick={() => handleEditarVoluntariado(vol)} className="ui-btn ui-btn--ghost" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}>Editar</button>
                    <button onClick={() => handleEliminarVoluntariado(vol.id, vol.nombre)} className="ui-btn ui-btn--danger-outline" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}>Baja</button>
                  </div>
                  <button onClick={() => handleConvertirVoluntariadoAUsuario(vol)} className="ui-btn ui-btn--primary" style={{ width: '100%', marginTop: '8px', padding: '10px', fontSize: '0.8rem' }}>
                    Convertir a Usuario
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={pageVol} totalPages={totalPagesVol} onPageChange={paginateVol} totalItems={totalVol} itemsPerPage={itemsPerPageVol} />
        </div>
      )}

      {subTab === 'logs' && (
        <div className="fade-in">
          <div className="admin-stats-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="premium-card flex-center" style={{ padding: '1.5rem', gap: '1.5rem' }}>
               <div className="flex-center" style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--ui-success)' }}><Hourglass size={24} /></div>
               <div style={{ flex: 1 }}>
                 <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800 }}>HORAS VALIDADAS</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{totalHoras.toFixed(1)}h</div>
               </div>
            </div>
            <div className="premium-card flex-center" style={{ padding: '1.5rem', gap: '1.5rem' }}>
               <div className="flex-center" style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--ui-info)' }}><ClipboardList size={24} /></div>
               <div style={{ flex: 1 }}>
                 <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800 }}>REPORTES TOTALES</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{logs.length}</div>
               </div>
            </div>
            <div className="premium-card flex-center" style={{ padding: '1.5rem', gap: '1.5rem' }}>
               <div className="flex-center" style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--ui-warning)' }}><Zap size={24} /></div>
               <div style={{ flex: 1 }}>
                 <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800 }}>PENDIENTES</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{totalPendientes}</div>
               </div>
            </div>
          </div>

          <div className="premium-card" style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
               <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Registro Histórico de Labores</h3>
               <div style={{ display: 'flex', gap: '8px' }}>
                 {['todos', 'pendientes', 'aprobados', 'rechazados'].map(f => (
                   <button key={f} onClick={() => setFiltroEstado(f)} className={`ui-btn ${filtroEstado === f ? 'ui-btn--primary' : 'ui-btn--ghost'}`} style={{ padding: '6px 16px', fontSize: '0.75rem', borderRadius: '30px' }}>
                     {f.toUpperCase()}
                   </button>
                 ))}
               </div>
            </div>

            <div className="premium-table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', opacity: 0.5 }}>
                    <th style={{ padding: '12px' }}>VOLUNTARIO</th>
                    <th style={{ padding: '12px' }}>ACTIVIDAD</th>
                    <th style={{ padding: '12px' }}>FECHA</th>
                    <th style={{ padding: '12px' }}>HORAS</th>
                    <th style={{ padding: '12px' }}>ESTADO</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {logsFiltrados.length > 0 ? (
                    logsFiltrados.map((log, idx) => (
                      <tr key={log.id} className="fade-in" style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '12px', animationDelay: `${idx * 0.03}s` }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--ui-primary)', color: '#fff', fontWeight: 800 }}>{log.voluntarioNombre?.charAt(0)}</div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{log.voluntarioNombre}</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, background: getTaskColor(log.tipoTarea), color: getTaskTextColor(log.tipoTarea) }}>
                            {log.tipoTarea?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={14} className="text-muted" /> {log.fecha}</div></td>
                        <td style={{ padding: '16px', fontWeight: 900, fontSize: '1rem' }}>{log.horas}h</td>
                        <td style={{ padding: '16px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.estado === 'aprobado' ? 'var(--ui-success)' : log.estado.startsWith('rechazado') ? 'var(--ui-error)' : 'var(--ui-warning)' }}></div>
                             <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{log.estado.toUpperCase()}</span>
                           </div>
                        </td>
                        <td style={{ padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'right' }}>
                           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                             <button onClick={() => handleVerEvidencia(log)} className="ui-btn ui-btn--ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }}><Eye size={14} /></button>
                             {log.estado !== 'aprobado' && !log.estado.startsWith('rechazado') && (
                               <button onClick={() => handleAprobarHoras(log)} className="ui-btn ui-btn--primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}><Check size={14} /></button>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem', opacity: 0.4 }}><ClipboardList size={48} style={{ marginBottom: '1rem' }} /><p>Sin registros encontrados</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'tareas' && (
        <div className="fade-in">
          <div className="admin-section-header premium-card flex-between" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Catálogo de Labores</h2>
              <p className="text-muted">Definición de tareas predeterminadas para el voluntariado</p>
            </div>
            <button className="ui-btn ui-btn--primary" onClick={() => { setModoEdicionTarea(false); resetFormTarea(); setShowForm(!showForm); }}>
               {showForm ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Nueva Tarea</>}
            </button>
          </div>

          {(showForm || modoEdicionTarea) && (
            <div className="premium-card fade-in" style={{ padding: '2.5rem', marginBottom: '2.5rem', border: '2px solid var(--ui-primary-bg)' }}>
              <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>{modoEdicionTarea ? 'Editar Tarea Base' : 'Configurar Nueva Tarea'}</h3>
              <form onSubmit={handleGuardarTarea} className="admin-grid-form">
                <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Título de la Labor</label>
                  <select 
                    className="ui-select" 
                    value={isCustomTitulo ? 'Otro' : formTarea.titulo} 
                    onChange={e => {
                      if (e.target.value === 'Otro') { setIsCustomTitulo(true); setFormTarea({...formTarea, titulo: ''}); }
                      else { setIsCustomTitulo(false); setFormTarea({...formTarea, titulo: e.target.value}); }
                    }} 
                    required={!isCustomTitulo}
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Plantación">Plantación</option>
                    <option value="Recolección de Residuos">Recolección de Residuos</option>
                    <option value="Fertilización">Fertilización</option>
                    <option value="Otro">Personalizado...</option>
                  </select>
                  {isCustomTitulo && <input type="text" value={formTarea.titulo} onChange={e => setFormTarea({...formTarea, titulo: e.target.value})} placeholder="Título personalizado..." className="ui-input" style={{ marginTop: '10px' }} required />}
                </div>
                <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Descripción / Instrucciones</label>
                  <input type="text" className="ui-input" value={formTarea.descripcion} onChange={e => setFormTarea({...formTarea, descripcion: e.target.value})} placeholder="Breve instrucción..." required />
                </div>
                <div className="ui-field">
                  <label>Días Disponibles</label>
                  <input type="text" className="ui-input" value={formTarea.dias} onChange={e => setFormTarea({...formTarea, dias: e.target.value})} placeholder="Ej: Lunes a Viernes" required />
                </div>
                <div className="ui-field">
                  <label>Carga Horaria Sugerida</label>
                  <input type="number" step="0.5" className="ui-input" value={formTarea.horas} onChange={e => setFormTarea({...formTarea, horas: e.target.value})} required />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="ui-btn ui-btn--primary" style={{ padding: '12px 32px' }}>{modoEdicionTarea ? 'Guardar Cambios' : 'Crear Tarea'}</button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-arboles-lista grid-auto">
            {tareasDisponibles.map((t, idx) => (
              <div key={t.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.05}s`, padding: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--ui-primary-bg)', color: 'var(--ui-primary)' }}><Briefcase size={20} /></div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{t.horas}h</div>
                    <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 800 }}>ESTIMADAS</div>
                  </div>
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800 }}>{t.titulo}</h4>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{t.descripcion}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ui-primary)', marginBottom: '1.5rem' }}>
                  <CalendarDays size={14} /> {t.dias}
                </div>

                <div className="flex-center" style={{ gap: '8px' }}>
                  <button onClick={() => { setFormTarea(t); setModoEdicionTarea(true); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="ui-btn ui-btn--ghost" style={{ flex: 1, padding: '8px', fontSize: '0.75rem' }}>Editar</button>
                  <button onClick={() => { /* lógica eliminar */ }} className="ui-btn ui-btn--danger-outline" style={{ flex: 1, padding: '8px', fontSize: '0.75rem' }}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoluntariadosTab;


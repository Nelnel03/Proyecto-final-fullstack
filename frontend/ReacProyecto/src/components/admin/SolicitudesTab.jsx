import React, { useEffect, useState } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { UserCheck, UserX, Clock, Mail, Calendar, Loader2, Sparkles, AlertCircle } from 'lucide-react';

function SolicitudesTab({ onUpdate }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = async () => {
    setCargando(true);
    try {
      const datos = await services.getSolicitudesVoluntariado();
      setSolicitudes(datos.filter(s => s.estado === 'pendiente'));
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleAprobar = async (solicitud) => {
    const nombreUsuario = solicitud.Usuario?.nombre || solicitud.userName || 'Usuario';
    const { value: area } = await Swal.fire({
      title: 'Validar Incorporación',
      html: `<p>Asigna un área de trabajo para <b>${nombreUsuario}</b>:</p>`,
      input: 'select',
      inputOptions: {
        'Reforestación': 'Reforestación',
        'Mantenimiento': 'Mantenimiento',
        'Vivero': 'Vivero',
        'Educación': 'Educación',
        'General': 'General'
      },
      inputPlaceholder: 'Selecciona un área...',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-primary)',
      cancelButtonColor: 'var(--ui-error)',
      confirmButtonText: 'Aprobar Voluntario',
      inputValidator: (value) => !value && 'Debes seleccionar un área'
    });

    if (area) {
      try {
        const userId = solicitud.usuario_id || solicitud.userId;
        const todosUsuarios = await services.getUsuarios();
        const elUsuario = todosUsuarios.find(u => u.id === userId);

        if (!elUsuario) {
            Swal.fire('Error', 'No se encontró el registro original del usuario.', 'error');
            return;
        }

        const usuarioActualizado = {
          ...elUsuario,
          rol: 'voluntario',
          area: area,
          fechaIngreso: new Date().toISOString().split('T')[0],
          telefono: elUsuario.telefono || 'Sin especificar'
        };
        await services.putUsuarios(usuarioActualizado, userId);
        await services.deleteSolicitudVoluntariado(solicitud.id);

        Swal.fire({
          title: '¡Felicidades!',
          text: `${nombreUsuario} ha sido incorporado al equipo de voluntarios.`,
          icon: 'success',
          confirmButtonColor: 'var(--ui-primary)'
        });
        
        cargarSolicitudes();
        if (onUpdate) onUpdate();
      } catch (error) {
        Swal.fire('Error', 'No se pudo procesar la solicitud en este momento.', 'error');
      }
    }
  };

  const handleRechazar = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Rechazar Solicitud?',
      text: `Se descartará la postulación de ${nombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-error)',
      cancelButtonColor: 'var(--ui-primary)',
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteSolicitudVoluntariado(id);
        Swal.fire('Acción Realizada', 'La solicitud ha sido retirada.', 'info');
        cargarSolicitudes();
      } catch (error) {
        Swal.fire('Error', 'No se pudo completar la operación.', 'error');
      }
    }
  };

  if (cargando) {
    return (
      <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-muted">Procesando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card flex-between" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Gestión de Incorporaciones</h2>
          <p className="text-muted">Revisión de solicitudes para el equipo de voluntarios BioMon</p>
        </div>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <span style={{ 
            padding: '8px 16px', 
            borderRadius: '12px', 
            background: 'var(--ui-primary-bg)', 
            color: 'var(--ui-primary)', 
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>
            {solicitudes.length} PENDIENTE{solicitudes.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {solicitudes.length === 0 ? (
        <div className="premium-card flex-center" style={{ padding: '5rem', flexDirection: 'column', textAlign: 'center' }}>
          <div className="flex-center" style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(0,0,0,0.03)', 
            marginBottom: '1.5rem',
            color: 'var(--ui-primary)'
          }}>
            <Sparkles size={40} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Bandeja Vacía</h3>
          <p className="text-muted" style={{ maxWidth: '300px' }}>
            No hay solicitudes de voluntariado pendientes de aprobación por ahora.
          </p>
        </div>
      ) : (
        <div className="grid-auto">
          {solicitudes.map((sol, idx) => (
            <div key={sol.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.1}s`, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="flex-center" style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  background: 'var(--ui-primary)', 
                  color: '#fff',
                  fontSize: '1.4rem',
                  fontWeight: 900
                }}>
                  {(sol.Usuario?.nombre || sol.userName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>
                    {sol.Usuario?.nombre || sol.userName}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--ui-primary)', fontWeight: 700 }}>
                       <Mail size={12} /> {sol.Usuario?.email || sol.userEmail}
                    </div>
                    <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                       <Calendar size={12} /> {sol.fecha ? new Date(sol.fecha).toLocaleDateString() : sol.fechaSolicitud}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                <button 
                  className="ui-btn ui-btn--primary" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  onClick={() => handleAprobar(sol)}
                >
                  <UserCheck size={16} style={{ marginRight: '6px' }} /> Aprobar
                </button>
                <button 
                  className="ui-btn ui-btn--ghost" 
                  style={{ flex: 0.5, padding: '10px', color: 'var(--ui-error)' }}
                  onClick={() => handleRechazar(sol.id, sol.Usuario?.nombre || sol.userName)}
                >
                  <UserX size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SolicitudesTab;

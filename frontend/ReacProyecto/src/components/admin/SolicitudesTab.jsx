import React, { useEffect, useState } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { UserCheck, UserX, Clock, Mail, Calendar } from 'lucide-react';

function SolicitudesTab({ onUpdate }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = async () => {
    setCargando(true);
    try {
      const datos = await services.getSolicitudesVoluntariado();
      // Solo mostrar las pendientes
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
    const { value: area } = await Swal.fire({
      title: 'Aprobar Voluntario',
      text: `Asigna un área de trabajo para ${solicitud.userName}:`,
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
      confirmButtonColor: '#1a4d2e',
      inputValidator: (value) => {
        if (!value) return 'Debes seleccionar un área';
      }
    });

    if (area) {
      try {
        // 1. Obtener datos completos del usuario
        const todosUsuarios = await services.getUsuarios();
        const elUsuario = todosUsuarios.find(u => u.id === solicitud.userId);

        if (!elUsuario) {
            Swal.fire('Error', 'No se encontró al usuario original.', 'error');
            return;
        }

        // 2. Actualizar rol del usuario
        const usuarioActualizado = {
          ...elUsuario,
          rol: 'voluntario',
          area: area,
          fechaIngreso: new Date().toISOString().split('T')[0],
          telefono: elUsuario.telefono || 'Sin especificar'
        };
        await services.putUsuarios(usuarioActualizado, solicitud.userId);

        // 3. Eliminar la solicitud (o marcar como aprobada)
        await services.deleteSolicitudVoluntariado(solicitud.id);

        Swal.fire('Aprobado', `${solicitud.userName} ahora es voluntario.`, 'success');
        cargarSolicitudes();
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo procesar la aprobación.', 'error');
      }
    }
  };

  const handleRechazar = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Rechazar solicitud?',
      text: `Se eliminará la solicitud de voluntariado de ${nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteSolicitudVoluntariado(id);
        Swal.fire('Rechazada', 'La solicitud ha sido eliminada.', 'success');
        cargarSolicitudes();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
      }
    }
  };

  if (cargando) return <div className="admin-loading">Cargando solicitudes...</div>;

  return (
    <div className="solicitudes-container">
      <div className="tab-header-flex">
        <h2 className="admin-tab-title">Solicitudes de Voluntariado</h2>
        <span className="badge-count">{solicitudes.length} Pendientes</span>
      </div>

      {solicitudes.length === 0 ? (
        <div className="empty-state-card">
          <Clock size={48} opacity={0.3} />
          <p>No hay solicitudes pendientes en este momento.</p>
        </div>
      ) : (
        <div className="solicitudes-grid">
          {solicitudes.map(sol => (
            <div key={sol.id} className="solicitud-card glass-card">
              <div className="solicitud-info">
                <div className="user-avatar-placeholder">
                  {sol.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{sol.userName}</h3>
                  <p className="sol-email"><Mail size={14} /> {sol.userEmail}</p>
                  <p className="sol-date"><Calendar size={14} /> Solicitado el: {sol.fechaSolicitud}</p>
                </div>
              </div>
              
              <div className="solicitud-actions">
                <button 
                  className="btn-approve" 
                  onClick={() => handleAprobar(sol)}
                  title="Aprobar Solicitud"
                >
                  <UserCheck size={18} /> Aprobar
                </button>
                <button 
                  className="btn-reject" 
                  onClick={() => handleRechazar(sol.id, sol.userName)}
                  title="Rechazar Solicitud"
                >
                  <UserX size={18} /> Rechazar
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

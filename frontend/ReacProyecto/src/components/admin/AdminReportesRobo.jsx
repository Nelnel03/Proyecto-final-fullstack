import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { 
  AlertTriangle, 
  Trash2, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  RefreshCw,
  Loader2,
  ShieldAlert,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import '../../styles/admin/AdminReports.css';

function AdminReportesRobo() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const datos = await services.getReportesRobados();
      setReportes(datos || []);
    } catch (error) { console.error(error);
      console.error("Error al cargar reportes de robos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Archivar Reporte?',
      text: "Esta acción retirará la alerta de la bandeja principal. Los datos serán archivados permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--ui-error)',
      cancelButtonColor: 'var(--ui-primary)',
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteReportesRobados(id);
        cargarReportes();
        Swal.fire({
          title: 'Reporte Archivado',
          icon: 'success',
          confirmButtonColor: 'var(--ui-primary)'
        });
      } catch (error) { console.error(error);
        Swal.fire('Error', 'No se pudo completar la operación.', 'error');
      }
    }
  };

  const handleCambiarEstado = async (reporte, nuevoEstado) => {
    try {
      const reporteActualizado = { ...reporte, estado: nuevoEstado };
      await services.putReportesRobados(reporteActualizado, reporte.id);
      setReportes(prev => prev.map(r => r.id === reporte.id ? reporteActualizado : r));
      
      Swal.fire({
        title: 'Estado Actualizado',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) { console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card flex-between" style={{ padding: '2rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--ui-error)' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0, color: 'var(--ui-error)' }}>Alertas de Sustracción</h2>
          <p className="text-muted">Reportes de robo, tala ilegal o daños malintencionados al corredor biológico</p>
        </div>
        <button 
          onClick={cargarReportes}
          className="ui-btn ui-btn--ghost"
          style={{ gap: '8px' }}
          disabled={cargando}
        >
          <RefreshCw size={18} className={cargando ? 'animate-spin' : ''} />
          {cargando ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {cargando ? (
        <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={40} className="animate-spin text-error" style={{ color: 'var(--ui-error)' }} />
          <p className="text-muted">Escaneando base de alertas...</p>
        </div>
      ) : reportes.length === 0 ? (
        <div className="premium-card flex-center" style={{ padding: '5rem', flexDirection: 'column', textAlign: 'center' }}>
          <div className="flex-center" style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.05)', 
            marginBottom: '1.5rem',
            color: 'var(--ui-success)'
          }}>
            <ShieldAlert size={40} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Zona Segura</h3>
          <p className="text-muted" style={{ maxWidth: '300px' }}>
            No hay reportes de robo o tala ilegal pendientes de procesar.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reportes.slice().reverse().map((reporte, idx) => (
            <div key={reporte.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.05}s`, padding: '0', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
              <div style={{ padding: '2rem' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="flex-center" style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: 'rgba(220, 38, 38, 0.1)', 
                      color: 'var(--ui-error)' 
                    }}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>{reporte.asunto || reporte.tipo_arbol}</h3>
                      <div className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} /> {new Date(reporte.fecha).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <span style={{ 
                       padding: '6px 14px', 
                       borderRadius: '30px', 
                       fontSize: '0.75rem', 
                       fontWeight: 900,
                       background: 'var(--ui-error)',
                       color: '#fff'
                     }}>
                       ALERTA CRÍTICA
                     </span>
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(0,0,0,0.02)', 
                  padding: '1.5rem', 
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  borderLeft: '4px solid var(--ui-error)'
                }}>
                  <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>
                    {reporte.contenido || reporte.descripcion}
                  </p>
                </div>

                <div className="flex-between" style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <User size={16} className="text-muted" />
                       <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{reporte.Usuario?.nombre || reporte.userName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Mail size={16} className="text-muted" />
                       <span className="text-muted" style={{ fontSize: '0.9rem' }}>{reporte.Usuario?.email || reporte.userEmail}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                     <button 
                       className="ui-btn ui-btn--ghost" 
                       style={{ color: 'var(--ui-success)', gap: '6px' }}
                       onClick={() => handleCambiarEstado(reporte, 'Verificado')}
                     >
                       <CheckCircle2 size={16} /> Marcar como Atendido
                     </button>
                     <button 
                       className="ui-btn ui-btn--ghost" 
                       style={{ color: 'var(--ui-error)', gap: '6px' }}
                       onClick={() => handleEliminar(reporte.id)}
                     >
                       <Trash2 size={16} /> Archivar
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReportesRobo;

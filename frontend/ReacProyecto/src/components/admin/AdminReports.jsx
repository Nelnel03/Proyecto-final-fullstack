import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import { 
  Inbox, 
  MessageSquare, 
  User, 
  Mail, 
  Clock, 
  RefreshCw,
  Loader2,
  Tag,
  ChevronRight
} from 'lucide-react';
import '../../styles/admin/AdminReports.css';

function AdminReports() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const datos = await services.getReportes();
      setReportes(datos || []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card flex-between" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Bandeja de Incidencias</h2>
          <p className="text-muted">Mensajes, consultas y reportes de soporte enviados por la comunidad</p>
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
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-muted">Recuperando mensajes...</p>
        </div>
      ) : reportes.length === 0 ? (
        <div className="premium-card flex-center" style={{ padding: '5rem', flexDirection: 'column', textAlign: 'center' }}>
          <div className="flex-center" style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(0,0,0,0.03)', 
            marginBottom: '1.5rem',
            color: 'var(--ui-primary)'
          }}>
            <Inbox size={40} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Bandeja Vacía</h3>
          <p className="text-muted" style={{ maxWidth: '300px' }}>
            No hay reportes ni mensajes pendientes de revisión en este momento.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reportes.slice().reverse().map((reporte, idx) => (
            <div key={reporte.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.05}s`, padding: '0', overflow: 'hidden' }}>
              <div style={{ display: 'flex', minHeight: '180px' }}>
                <div style={{ 
                  width: '6px', 
                  background: reporte.estado === 'Resuelto' ? 'var(--ui-success)' : 'var(--ui-warning)' 
                }}></div>
                
                <div style={{ flex: 1, padding: '2rem' }}>
                  <div className="flex-between" style={{ marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                         <Tag size={14} className="text-primary" />
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ui-primary)' }}>
                           ASUNTO: {reporte.asunto}
                         </span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>{reporte.asunto}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <span style={{ 
                         padding: '6px 14px', 
                         borderRadius: '30px', 
                         fontSize: '0.7rem', 
                         fontWeight: 800,
                         background: reporte.estado === 'Resuelto' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                         color: reporte.estado === 'Resuelto' ? 'var(--ui-success)' : 'var(--ui-warning)',
                         border: '1px solid currentColor'
                       }}>
                         {reporte.estado?.toUpperCase() || 'RECIBIDO'}
                       </span>
                       <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <Clock size={12} /> {new Date(reporte.fecha).toLocaleString()}
                       </div>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(0,0,0,0.02)', 
                    padding: '1.5rem', 
                    borderRadius: '16px',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-tierra-sombra)' }}>
                      {reporte.contenido || reporte.mensaje}
                    </p>
                  </div>

                  <div className="flex-between" style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="flex-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--ui-primary-bg)', color: 'var(--ui-primary)' }}>
                          <User size={16} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{reporte.Usuario?.nombre || reporte.userName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} className="text-muted" />
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>{reporte.Usuario?.email || reporte.userEmail}</span>
                      </div>
                    </div>
                    <button className="ui-btn ui-btn--ghost" style={{ gap: '8px', fontSize: '0.85rem' }}>
                      Gestionar Reporte <ChevronRight size={16} />
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

export default AdminReports;

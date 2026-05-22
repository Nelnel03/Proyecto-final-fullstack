import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import { 
  ClipboardCheck, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink, 
  RefreshCw,
  Loader2,
  Filter,
  User
} from 'lucide-react';
import '../../styles/admin/ReportesTab.css';

function ReportesTab() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const datos = await services.getReportesVoluntariado();
      const sorted = (datos || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReportes(sorted);
    } catch (error) { console.error(error);
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  const getTaskColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna')) return 'var(--ui-warning)';
    if (t.includes('suelo') || t.includes('siembra')) return 'var(--ui-primary)';
    return 'var(--ui-info)';
  };

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card flex-between" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Historial de Actividades</h2>
          <p className="text-muted">Registro detallado de labores realizadas por el equipo de voluntarios</p>
        </div>
        <button 
          onClick={cargarReportes}
          className="ui-btn ui-btn--ghost"
          style={{ gap: '8px' }}
          disabled={cargando}
        >
          <RefreshCw size={18} className={cargando ? 'animate-spin' : ''} />
          {cargando ? 'Sincronizando...' : 'Actualizar'}
        </button>
      </div>

      {cargando ? (
        <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-muted">Obteniendo reportes de campo...</p>
        </div>
      ) : reportes.length === 0 ? (
        <div className="premium-card flex-center" style={{ padding: '5rem', flexDirection: 'column' }}>
          <ClipboardCheck size={64} className="text-muted" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
          <h3 style={{ margin: 0, fontWeight: 800 }}>Sin Reportes</h3>
          <p className="text-muted">Aún no se han registrado actividades de campo.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {reportes.map((reporte, idx) => (
            <div key={reporte.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.05}s`, padding: '0' }}>
              <div style={{ 
                padding: '1.5rem', 
                borderBottom: '1px solid rgba(0,0,0,0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="flex-center" style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    background: 'var(--ui-primary-bg)', 
                    color: 'var(--ui-primary)' 
                  }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{reporte.voluntarioNombre}</h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      padding: '2px 8px', 
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.05)',
                      color: getTaskColor(reporte.tipoTarea),
                      textTransform: 'uppercase'
                    }}>
                      {reporte.tipoTarea || 'GENERAL'}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--ui-primary)' }}>{reporte.horas}h</div>
                   <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 800 }}>DURACIÓN</div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                  <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <Calendar size={14} /> {reporte.fecha}
                  </div>
                  <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <Clock size={14} /> {reporte.horaInicio} - {reporte.horaFin}
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(0,0,0,0.02)', 
                  padding: '1rem', 
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5 }}>
                    <FileText size={12} /> OBSERVACIONES
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{reporte.tareas}</p>
                </div>

                {reporte.pruebas && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {reporte.pruebas.startsWith('http') ? (
                      <a 
                        href={reporte.pruebas} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ui-btn ui-btn--ghost"
                        style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '8px' }}
                      >
                        <ExternalLink size={14} /> Ver Evidencia
                      </a>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{reporte.pruebas}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportesTab;

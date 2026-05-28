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

// Utility to parse content that might serialize Location and Description together
const parseContenido = (contenido) => {
  if (!contenido) {
    return { ubicacion: 'No especificada', descripcion: 'No especificada' };
  }
  
  // Standard format with double newlines: Ubicación: [ubi]\n\n[desc]
  const matchDouble = contenido.match(/^Ubicación:\s*([\s\S]*?)(?:\n\n|\r\n\r\n)([\s\S]*)$/i);
  if (matchDouble) {
    return {
      ubicacion: matchDouble[1].trim(),
      descripcion: matchDouble[2].trim()
    };
  }

  // Single newline: Ubicación: [ubi]\n[desc]
  const matchSingle = contenido.match(/^Ubicación:\s*([^\n]+)\n+([\s\S]*)$/i);
  if (matchSingle) {
    return {
      ubicacion: matchSingle[1].trim(),
      descripcion: matchSingle[2].trim()
    };
  }

  // Starts with Ubicación: but has no newlines
  if (contenido.toLowerCase().startsWith('ubicación:')) {
    const ubi = contenido.substring(10).trim();
    return {
      ubicacion: ubi || 'No especificada',
      descripcion: 'No especificada'
    };
  }

  // Default fallback
  return {
    ubicacion: 'No especificada',
    descripcion: contenido.trim()
  };
};

// Format date as DD/MM/YYYY
const formatReportDate = (dateStr) => {
  if (!dateStr) return 'No especificada';
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateStr;
  }
};

// Dynamic style based on status
const getStatusBadgeStyle = (estado) => {
  const est = (estado || 'Pendiente').toLowerCase();
  if (est === 'pendiente') {
    return {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#d97706',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      borderLeft: '5px solid #f59e0b'
    };
  }
  if (est === 'en proceso' || est === 'en investigación' || est === 'en revision' || est === 'en revisión') {
    return {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#2563eb',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      borderLeft: '5px solid #3b82f6'
    };
  }
  if (est === 'resuelto' || est === 'solucionado' || est === 'verificado' || est === 'atendido') {
    return {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#059669',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      borderLeft: '5px solid #10b981'
    };
  }
  return {
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#4b5563',
    border: '1px solid rgba(107, 114, 128, 0.25)',
    borderLeft: '5px solid var(--ui-error)'
  };
};

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reportes.slice().reverse().map((reporte, idx) => {
            const parsed = parseContenido(reporte.contenido || reporte.descripcion);
            const ubicacionVal = reporte.ubicacion || parsed.ubicacion;
            const descripcionVal = reporte.descripcion || parsed.descripcion;
            const fechaVal = formatReportDate(reporte.fecha);
            const statusColor = getStatusBadgeStyle(reporte.estado);

            return (
              <div 
                key={reporte.id} 
                className="premium-card fade-in robo-report-card" 
                style={{ 
                  animationDelay: `${idx * 0.05}s`, 
                  padding: '0', 
                  borderLeft: statusColor.borderLeft 
                }}
              >
                <div style={{ padding: '2rem' }}>
                  {/* HEADER SECTION */}
                  <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div className="flex-center robo-alert-icon-container">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <span className="robo-label-tag">Reporte de Sustracción</span>
                        <h3 className="robo-report-title">
                          Reporte: {reporte.asunto || reporte.tipo_arbol || 'Alerta de Robo'}
                        </h3>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="robo-status-label">Estado:</span>
                      <span 
                        className="status-pill-badge" 
                        style={{ 
                          background: statusColor.background,
                          color: statusColor.color,
                          border: statusColor.border,
                        }}
                      >
                        {reporte.estado || 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  {/* SECTIONS GRID */}
                  <div className="robo-sections-grid">
                    {/* UBICACION */}
                    <div className="robo-section-card location-card">
                      <div className="robo-section-header">
                        <MapPin size={18} className="robo-icon-orange" />
                        <span className="robo-section-title">📍 Ubicación</span>
                      </div>
                      <div className="robo-section-content">
                        {ubicacionVal}
                      </div>
                    </div>

                    {/* DESCRIPCION */}
                    <div className="robo-section-card description-card">
                      <div className="robo-section-header">
                        <span className="robo-section-title">📝 Descripción</span>
                      </div>
                      <div className="robo-section-content description-text">
                        “{descripcionVal}”
                      </div>
                    </div>

                    {/* FECHA DE ENVIO */}
                    <div className="robo-section-card date-card">
                      <div className="robo-section-header">
                        <Calendar size={18} className="robo-icon-blue" />
                        <span className="robo-section-title">📅 Fecha de envío</span>
                      </div>
                      <div className="robo-section-content">
                        {fechaVal}
                      </div>
                    </div>

                    {/* DATOS ADICIONALES (SI EXISTEN) */}
                    {(reporte.Usuario?.nombre || reporte.userName || reporte.Usuario?.email || reporte.userEmail || reporte.tipo_arbol) && (
                      <div className="robo-section-card additional-card">
                        <div className="robo-section-header">
                          <User size={18} className="robo-icon-green" />
                          <span className="robo-section-title">👤 Datos Adicionales</span>
                        </div>
                        <div className="robo-additional-grid">
                          {(reporte.Usuario?.nombre || reporte.userName) && (
                            <div className="additional-field">
                              <span className="additional-label">Reportado por</span>
                              <span className="additional-value">{reporte.Usuario?.nombre || reporte.userName}</span>
                            </div>
                          )}
                          {(reporte.Usuario?.email || reporte.userEmail) && (
                            <div className="additional-field">
                              <span className="additional-label">Email</span>
                              <span className="additional-value">{reporte.Usuario?.email || reporte.userEmail}</span>
                            </div>
                          )}
                          {reporte.tipo_arbol && (
                            <div className="additional-field">
                              <span className="additional-label">Especie</span>
                              <span className="additional-value">{reporte.tipo_arbol}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="flex-between robo-footer-actions">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="change-status-text">Cambiar estado:</span>
                      <select 
                        className="ui-input select-status-custom"
                        style={{ padding: '6px 12px', fontSize: '0.85rem', height: '36px', width: '170px', borderRadius: '10px' }}
                        value={reporte.estado || 'Pendiente'}
                        onChange={(e) => handleCambiarEstado(reporte, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Investigación</option>
                        <option value="Resuelto">Resuelto</option>
                      </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {reporte.estado !== 'Resuelto' && (
                        <button 
                          className="ui-btn ui-btn--ghost btn-resolve-custom" 
                          style={{ color: 'var(--ui-success)', gap: '8px' }}
                          onClick={() => handleCambiarEstado(reporte, 'Resuelto')}
                        >
                          <CheckCircle2 size={16} /> Marcar como Atendido
                        </button>
                      )}
                      <button 
                        className="ui-btn ui-btn--ghost btn-archive-custom" 
                        style={{ color: 'var(--ui-error)', gap: '8px' }}
                        onClick={() => handleEliminar(reporte.id)}
                      >
                        <Trash2 size={16} /> Archivar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminReportesRobo;

import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import '../../styles/ReportesTab.css';

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
      // Sort by date/timestamp descending
      const sorted = (datos || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReportes(sorted);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="reportes-header">
        <h2 className="reportes-title">Reportes de Actividad de Voluntarios</h2>
        <button 
          onClick={cargarReportes}
          className="update-btn"
        >
          Actualizar
        </button>
      </div>

      {cargando ? (
        <p className="loading-text">Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <div className="empty-reportes">
          <p className="empty-text">No hay reportes de voluntariado registrados aún.</p>
        </div>
      ) : (
        <div className="reportes-grid">
          {reportes.map((reporte) => (
            <div key={reporte.id} className="reporte-card">
              <div className="reporte-top-row">
                <div>
                  <h3 className="voluntario-name">{reporte.voluntarioNombre}</h3>
                  <div className="voluntario-meta">
                    <span className="task-type-badge">
                      {reporte.tipoTarea || 'Tarea General'}
                    </span>
                    <span className="voluntario-id">ID: {reporte.voluntarioId}</span>
                  </div>
                </div>
                <div className="reporte-timing">
                  <div className="hours-badge">
                    {reporte.horas} Horas
                  </div>
                  <div className="time-range">
                     {reporte.horaInicio} - {reporte.horaFin}
                  </div>
                  <div className="reporte-date">
                     {reporte.fecha}
                  </div>
                </div>
              </div>
              
              <div className="reporte-observations">
                <strong className="obs-label">Observaciones:</strong>
                {reporte.tareas}
              </div>

              {reporte.pruebas && (
                <div className="reporte-evidence">
                  <strong className="evidence-label">Evidencia / Pruebas:</strong>
                  {reporte.pruebas.startsWith('http') ? (
                    <a href={reporte.pruebas} target="_blank" rel="noopener noreferrer" className="evidence-link">
                      Ver Evidencia Adjunta
                    </a>
                  ) : (
                    reporte.pruebas
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportesTab;

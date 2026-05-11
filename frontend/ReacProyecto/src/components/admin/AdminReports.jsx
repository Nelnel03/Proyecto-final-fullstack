import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import '../../styles/AdminReports.css';

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
    <div>
      <div className="admin-section-header">
        <h2>Reportes y Soporte</h2>
        <p className="admin-reports-header-subtitle">Mensajes y reportes enviados por los usuarios</p>
      </div>

      {cargando ? (
        <div className="admin-reports-loading">
          Cargando reportes...
        </div>
      ) : reportes.length === 0 ? (
        <div className="admin-reports-empty">
          <div className="admin-reports-empty-icon"></div>
          <p>La bandeja está vacía. No hay reportes nuevos.</p>
        </div>
      ) : (
        <div className="admin-reports-list">
          {reportes.slice().reverse().map((reporte) => (
            <div key={reporte.id} className="admin-report-card">
              <div className="admin-report-card-header">
                <div>
                  <h3 className="admin-report-card-title">{reporte.asunto}</h3>
                  <div className="admin-report-card-meta">
                    <span>{reporte.userName}</span>
                    <span>{reporte.userEmail}</span>
                  </div>
                </div>
                <div className="admin-report-card-status-wrap">
                  <span className="admin-report-card-status">
                    {reporte.estado || 'Recibido'}
                  </span>
                  <div className="admin-report-card-date">
                    {new Date(reporte.fecha).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="admin-report-card-message">
                {reporte.mensaje}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReports;

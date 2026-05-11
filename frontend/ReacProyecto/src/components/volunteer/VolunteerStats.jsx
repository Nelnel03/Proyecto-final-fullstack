import React from 'react';

const VolunteerStats = ({ stats }) => {
  return (
    <div className="volunteer-stats-grid">
      <div className="volunteer-stat-card">
        <span className="volunteer-stat-value" style={{ color: '#10b981' }}>{stats.totalHoras}h</span>
        <p className="volunteer-stat-label">Horas Aprobadas</p>
      </div>
      <div className="volunteer-stat-card">
        <span className="volunteer-stat-value" style={{ color: '#10b981' }}>{stats.totalTareas}</span>
        <p className="volunteer-stat-label">Labores Validadas</p>
      </div>
      {stats.totalEnviadas !== undefined && (
        <div className="volunteer-stat-card">
          <span className="volunteer-stat-value" style={{ color: '#f59e0b' }}>
            {stats.totalEnviadas - stats.totalTareas}
          </span>
          <p className="volunteer-stat-label">En Revisión</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerStats;

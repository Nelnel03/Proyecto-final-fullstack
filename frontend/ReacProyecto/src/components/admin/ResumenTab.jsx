import React from 'react';
import { Users, List, FileText, AlertTriangle } from 'lucide-react';

const ResumenTab = ({ 
  usuarios, 
  arboles, 
  setTab, 
  setUserSubTab 
}) => {
  return (
    <div className="overview-dashboard">
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card clickable" onClick={() => { setTab('usuarios'); setUserSubTab('activos'); }}>
          <div className="admin-stat-header">
            <div className="admin-stat-icon-box green"><Users size={20} /></div>
          </div>
          <div className="admin-stat-label">Usuarios Totales</div>
          <div className="admin-stat-value">{usuarios.length}</div>
          <div className="admin-stat-subtitle">{usuarios.filter(u => u.rol === 'voluntario').length} Voluntarios</div>
        </div>

        <div className="admin-stat-card clickable" onClick={() => setTab('lista')}>
          <div className="admin-stat-header">
            <div className="admin-stat-icon-box green"><List size={20} /></div>
          </div>
          <div className="admin-stat-label">Árboles Registrados</div>
          <div className="admin-stat-value">{arboles.length}</div>
          <div className="admin-stat-subtitle">Especies en conservación</div>
        </div>

        <div className="admin-stat-card clickable" onClick={() => { setTab('usuarios'); setUserSubTab('cancelados'); }}>
          <div className="admin-stat-header">
            <div className="admin-stat-icon-box blue"><FileText size={20} /></div>
          </div>
          <div className="admin-stat-label">Cuentas Inactivas</div>
          <div className="admin-stat-value">{usuarios.filter(u => u.status === 'banned').length}</div>
          <div className="admin-stat-subtitle">Usuarios restringidos</div>
        </div>

        <div className="admin-stat-card clickable" onClick={() => setTab('bajas')}>
          <div className="admin-stat-header">
            <div className="admin-stat-icon-box red"><AlertTriangle size={20} /></div>
          </div>
          <div className="admin-stat-label">Bajas Reportadas</div>
          <div className="admin-stat-value">{arboles.filter(a => a.estado === 'muerto').length}</div>
          <div className="admin-stat-subtitle">Incidencias críticas</div>
        </div>
      </div>

      {/* Middle Section GRID */}
      <div className="admin-middle-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Últimas Especies Registradas</h3>
            <button className="admin-v-all-btn" style={{ width: 'auto', marginTop: 0 }} onClick={() => setTab('lista')}>Ver catálogo completo</button>
          </div>
          <div className="admin-v-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {arboles.slice(-8).reverse().map((arbol, idx) => (
              <div className="admin-v-item" key={idx}>
                <img src={arbol.imagenUrl || 'https://via.placeholder.com/50'} className="admin-v-img" alt="Specimen" />
                <div className="admin-v-info">
                  <p className="admin-v-name">{arbol.nombre}</p>
                  <p className="admin-v-meta">{arbol.tipo || 'Sin tipo'} • {arbol.familia || 'Sin familia'}</p>
                </div>
                <span className={`admin-v-badge ${arbol.estado === 'vivo' ? 'verified' : 'flagged'}`}>
                  {arbol.estado ? arbol.estado.toUpperCase() : 'PENDIENTE'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenTab;

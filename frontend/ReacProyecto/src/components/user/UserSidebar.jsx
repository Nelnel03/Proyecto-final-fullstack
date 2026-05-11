import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  ShieldAlert, 
  Map as MapIcon, 
  BookOpen, 
  Trophy, 
  UserCheck, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';

const UserSidebar = ({ currentTab, setCurrentTab, user, isOpen, onClose }) => {
  return (
    <aside className={`modern-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="sidebar-logo-icon">
            <img src="/src/assets/logo.png" alt="Logo de BioMon" className="sidebar-logo-img" />
          </div>
          <div className="logo-text">
            <h2>Biomon ADI</h2>
            <span>Portal de Conservación</span>
          </div>
        </div>
        <button className="mobile-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
        >
          <LayoutDashboard className="nav-icon" size={18} />
          Panel Principal
        </button>
        <button 
          className={`nav-item ${currentTab === 'coleccion' ? 'active' : ''}`}
          onClick={() => {
              setCurrentTab('coleccion');
              window.scrollTo({top: 0, behavior: 'smooth'});
          }}
        >
          <Search className="nav-icon" size={18} />
          Guía de Árboles
        </button>

        <button 
          className={`nav-item ${currentTab === 'mis_reportes' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mis_reportes')}
        >
          <Bookmark className="nav-icon" size={18} />
          Mis Solicitudes
        </button>
        <button 
          className={`nav-item ${currentTab === 'reporte_robo' ? 'active' : ''}`}
          onClick={() => setCurrentTab('reporte_robo')}
        >
          <ShieldAlert className="nav-icon" size={18} />
          Reportar Robo
        </button>
        <button 
          className={`nav-item ${currentTab === 'mapa' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mapa')}
        >
          <MapIcon className="nav-icon" size={18} />
          Mapas de Campo
        </button>
        <button 
          className={`nav-item ${currentTab === 'historia' ? 'active' : ''}`}
          onClick={() => setCurrentTab('historia')}
        >
          <BookOpen className="nav-icon" size={18} />
          Historia
        </button>
        <button 
          className={`nav-item ${currentTab === 'dashboard' ? '' : ''}`} 
          onClick={() => {
              setCurrentTab('dashboard');
              setTimeout(() => {
                  const impactEl = document.querySelector('.impact-banner');
                  impactEl?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
          }}
        >
          <Trophy className="nav-icon" size={18} />
          Impacto
        </button>

        {user.rol !== 'voluntario' && (
          <button 
            className={`nav-item ${currentTab === 'solicitud_voluntariado' ? 'active' : ''}`}
            onClick={() => setCurrentTab('solicitud_voluntariado')}
          >
            <UserCheck className="nav-icon" size={18} />
            Ser Voluntariado
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => setCurrentTab('perfil')}>
          <Settings size={18} />
          Configuración
        </button>
        <button className="nav-item" onClick={() => setCurrentTab('reportes')}>
          <HelpCircle size={18} />
          Soporte
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;

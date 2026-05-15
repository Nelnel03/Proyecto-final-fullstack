import React from 'react';
import { 
  MapPin, 
  Edit3, 
  LayoutDashboard, 
  Compass, 
  ChevronRight, 
  Sprout, 
  Droplets, 
  Heart, 
  Moon,
  TrendingUp,
  Map as MapIcon,
  Award,
  Zap
} from 'lucide-react';
import { CorridorMap } from '../common';

const UserDashboardTab = ({ 
  user, 
  stats, 
  arboles, 
  setCurrentTab 
}) => {
  return (
    <div className="user-dashboard-tab-premium fade-in">
      {/* Hero Header Section */}
      <div className="user-hero-banner mb-8">
        <div className="hero-content-wrapper">
          <div className="user-profile-summary">
            <div className="user-avatar-premium">
              {user.fotoPerfil ? (
                <img src={user.fotoPerfil} alt={user.nombre} />
              ) : (
                <div className="avatar-fallback">{user.nombre.charAt(0)}</div>
              )}
              <div className="online-indicator"></div>
            </div>
            <div className="user-text-details">
              <h1 className="welcome-text">¡Hola, {user.nombre.split(' ')[0]}! 👋</h1>
              <p className="welcome-subtext">Tu impacto en el corredor biológico hoy.</p>
            </div>
          </div>
          <button className="ui-btn ui-btn--primary-glass" onClick={() => setCurrentTab('perfil')}>
            <Edit3 size={18} className="mr-2" />
            Configurar Perfil
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="user-metrics-grid mb-8">
        {[
          { label: 'Observaciones', value: stats.observations, icon: MapIcon, trend: '+3', color: 'var(--ui-info)' },
          { label: 'Impacto', value: `${(stats.impactPoints / 1000).toFixed(1)}k`, icon: Zap, trend: '+12%', color: 'var(--ui-primary)' },
          { label: 'Contribuciones', value: stats.contributions, icon: Heart, trend: 'Nuevo Rango', color: 'var(--ui-error)' },
          { label: 'Expediciones', value: stats.expeditions, icon: Compass, trend: 'Activo', color: 'var(--ui-warning)' }
        ].map((m, i) => (
          <div key={i} className="metric-card-premium premium-card">
            <div className="metric-icon" style={{ color: m.color, background: `${m.color}10` }}>
              <m.icon size={20} />
            </div>
            <div className="metric-info">
              <p className="metric-label">{m.label}</p>
              <h3 className="metric-value">{m.value}</h3>
              <span className="metric-trend"><TrendingUp size={12} /> {m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="user-dashboard-main-layout">
        {/* Left: Map Integration */}
        <div className="premium-card map-section-saas">
          <div className="flex-between p-6 pb-2">
            <div>
              <h3 className="card-title-saas">Mi Corredor Biológico</h3>
              <p className="text-muted text-xs">Monitoreo de especies en tiempo real</p>
            </div>
            <button className="ui-btn ui-btn--ghost text-xs" onClick={() => setCurrentTab('mapa')}>
              <Compass size={16} className="mr-2" /> Pantalla Completa
            </button>
          </div>
          <div className="map-view-container">
            <CorridorMap />
          </div>
        </div>

        {/* Right: Species & Badges */}
        <div className="user-sidebar-content">
          <div className="premium-card p-6 mb-6">
            <div className="flex-between mb-4">
              <h3 className="card-title-saas">Especies Cercanas</h3>
              <button className="text-link-small" onClick={() => setCurrentTab('coleccion')}>Ver Todo</button>
            </div>
            <div className="mini-species-list">
              {arboles.slice(0, 3).map((a, i) => (
                <div key={i} className="mini-species-item">
                  <div className="species-img-thumb">
                    <img src={a.imagenUrl || 'https://via.placeholder.com/50'} alt={a.nombre} />
                  </div>
                  <div className="species-info">
                    <p className="name">{a.nombre}</p>
                    <p className="meta">{a.familia}</p>
                  </div>
                  <ChevronRight size={14} className="opacity-30" />
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-6 bg-gradient-premium text-white border-none">
            <div className="flex-between mb-4">
              <h3 className="text-white font-black">Mis Logros</h3>
              <Award size={20} className="opacity-80" />
            </div>
            <div className="badges-row-mini">
              {[Sprout, Droplets, Heart, Moon].map((Icon, i) => (
                <div key={i} className="badge-icon-pill">
                  <Icon size={20} />
                </div>
              ))}
            </div>
            <p className="text-xs opacity-90 mt-4 font-bold">Has desbloqueado el rango "Guardián del Bosque".</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .user-dashboard-tab-premium { padding: 1rem 0; }
        
        .user-hero-banner {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 2rem;
          border-radius: 24px;
          backdrop-filter: blur(10px);
        }

        .hero-content-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-avatar-premium {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .user-avatar-premium img, .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: var(--sombra-suave);
        }

        .avatar-fallback {
          background: var(--ui-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 900;
        }

        .online-indicator {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: var(--ui-success);
          border: 3px solid #fff;
          border-radius: 50%;
        }

        .welcome-text { font-size: 2rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
        .welcome-subtext { font-size: 1rem; color: var(--color-tierra-sombra); opacity: 0.7; font-weight: 700; margin: 4px 0 0; }

        .user-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .metric-card-premium {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .metric-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-label { font-size: 0.75rem; font-weight: 800; opacity: 0.5; margin-bottom: 2px; }
        .metric-value { font-size: 1.5rem; font-weight: 900; margin: 0; }
        .metric-trend { font-size: 0.65rem; font-weight: 800; color: var(--ui-primary); display: flex; align-items: center; gap: 4px; }

        .user-dashboard-main-layout {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 1.5rem;
        }

        .map-section-saas { overflow: hidden; padding-bottom: 0; }
        .map-view-container { height: 400px; border-top: 1px solid rgba(0,0,0,0.05); }

        .mini-species-list { display: flex; flex-direction: column; gap: 12px; }
        .mini-species-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
          transition: 0.2s;
          cursor: pointer;
        }

        .mini-species-item:hover { background: rgba(0,0,0,0.04); }
        .species-img-thumb { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; }
        .species-img-thumb img { width: 100%; height: 100%; object-fit: cover; }
        
        .species-info .name { font-size: 0.85rem; font-weight: 800; margin: 0; }
        .species-info .meta { font-size: 0.7rem; opacity: 0.5; font-weight: 700; }

        .bg-gradient-premium { background: linear-gradient(135deg, var(--ui-primary), var(--color-bosque-pino)); }
        .badges-row-mini { display: flex; gap: 10px; margin-top: 1rem; }
        .badge-icon-pill {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media screen and (max-width: 900px) {
          .user-dashboard-main-layout { grid-template-columns: 1fr; }
          .welcome-text { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default UserDashboardTab;


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
  Moon 
} from 'lucide-react';
import CorridorMap from '../CorridorMap';

const UserDashboardTab = ({ 
  user, 
  stats, 
  arboles, 
  setCurrentTab 
}) => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-profile">
        <img 
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.WOCihXnOixa4FlibByvm2QHaFj%3Fpid%3DApi&f=1&ipt=103e1e53151ec1cbeb28de530419906dfee31a9062d9a709260fc735469e76aa&ipo=images" 
          alt="Bosque" 
          className="hero-bg" 
        />

        <div className="hero-overlay">
          <div className="profile-info-main">
            <div className="profile-img-container">
              {user.fotoPerfil ? (
                <img src={user.fotoPerfil} alt={user.nombre} className="profile-img-large" />
              ) : (
                <div className="profile-fallback">{user.nombre.charAt(0)}</div>
              )}
            </div>
            <div className="profile-details">
              <h1>{user.nombre}</h1>
              <div className="profile-meta">
                <span className="badge-role">{user.rol === 'voluntariado' ? 'Guardián del Bosque' : 'Ciudadano Protector'}</span>

                <div className="location-meta">
                  <MapPin size={14} />
                  <span>La Angostura, Sector Sur</span>
                </div>
              </div>
            </div>
          </div>
          <button className="btn-edit-profile" onClick={() => setCurrentTab('perfil')}>
            <Edit3 size={18} />
            <span>Editar Perfil</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Observaciones</span>
          <div className="stat-value-container">
            <span className="stat-value">{stats.observations}</span>
            <span className="stat-change positive">↑ 12%</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Contribuciones</span>
          <div className="stat-value-container">
            <span className="stat-value">{stats.contributions}</span>
            <span className="stat-change positive">¡Nuevo rango!</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Puntos de Impacto</span>
          <div className="stat-value-container">
            <span className="stat-value">{(stats.impactPoints / 1000).toFixed(1)}k</span>
              <div className="impact-progress-container">
                <div className="impact-progress-bar" style={{width: '70%'}}></div>
              </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Corridor View */}
        <div className="main-section-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>Mi Corredor</h3>
              <p>Cuenca Baja de La Angostura • Monitoreo en Tiempo Real</p>
            </div>
            <div className="header-actions">
              <button className="icon-btn"><LayoutDashboard size={20} /></button>
              <a 
                href="https://www.google.com/maps/@9.9875,-84.795,15z/data=!3m1!1e3" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="icon-btn"
                title="Abrir en Google Maps"
              >
                <Compass size={20} />
              </a>
            </div>
          </div>
          <div className="map-placeholder" style={{padding: 0, height: '480px', overflow: 'hidden'}}>
            <CorridorMap />
          </div>
        </div>

        {/* Right Column: Sidebar Sections */}
        <div className="sidebar-grid-column">
          <div className="habitats-card">
            <div className="card-header">
              <h3>Especies Populares</h3>
              <button className="icon-btn" onClick={() => setCurrentTab('coleccion')} style={{fontSize: '0.8rem'}}>Ver Todo</button>
            </div>
            <div className="habitats-list">
              {arboles.length > 0 ? Array.from(new Set(arboles.map(a => a.nombre)))
                .slice(0, 3)
                .map(nombreUnico => {
                  const arbol = arboles.find(a => a.nombre === nombreUnico);
                  return (
                    <div className="habitat-item" key={arbol.id}>
                      <img 
                        src={arbol.imagenUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop"} 
                        className="habitat-img" 
                        alt={arbol.nombre}
                      />
                      <div className="habitat-info">
                        <p className="habitat-name">{arbol.nombre}</p>
                        <p className="habitat-desc">{arbol.nombreCientifico}</p>
                        <div className="habitat-tags">
                            <span className="tag green">{arbol.familia || 'Nativo'}</span>
                            <span className="tag orange">{arbol.clima || 'Tropical'}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#cbd5e1" />
                    </div>
                  );
                }) : (
                <p style={{fontSize: '0.8rem', color: '#64748b'}}>No hay especies registradas.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Impact Banner */}
      <div className="impact-banner">
        <div className="impact-text-content">
          <h2>Impacto de Conservación</h2>
          <div className="impact-value-big">
            <span>{stats.observations}</span>
            <span>hectáreas</span>
          </div>
          <p>
            A través de las observaciones de {user.nombre.split(' ')[0]} y sus esfuerzos de restauración directa, 
            {stats.observations} hectáreas de bosque seco tropical han sido protegidas y registradas con éxito.
          </p>
        </div>
        <div className="impact-badges">
          <div className="impact-badge-card">
            <div className="badge-icon-container">
              <Sprout size={24} />
            </div>
            <p className="badge-name">Plantador de Árboles</p>
            <span className="badge-label gold">Rango Oro</span>
          </div>
          <div className="impact-badge-card">
            <div className="badge-icon-container water">
              <Droplets size={24} />
            </div>
            <p className="badge-name">Guardián del Agua</p>
            <span className="badge-label">Experto</span>
          </div>
          <div className="impact-badge-card">
            <div className="badge-icon-container seed">
              <Heart size={24} />
            </div>
            <p className="badge-name">Fundador de Semillas</p>
            <span className="badge-label">Legado</span>
          </div>
          <div className="impact-badge-card">
            <div className="badge-icon-container night">
              <Moon size={24} />
            </div>
            <p className="badge-name">Vigilante Nocturno</p>
            <span className="badge-label">Colaborador</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardTab;

import { Search, Settings, User, LogOut, Menu } from 'lucide-react';
import DarkModeToggle from '../DarkModeToggle';

const UserTopbar = ({ 
  currentTab, 
  setCurrentTab, 
  searchTerm, 
  setSearchTerm, 
  user, 
  handleLogout,
  onOpenSidebar,
  isMobile
}) => {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {isMobile && (
          <button className="user-mobile-menu-btn" onClick={onOpenSidebar}>
            <Menu size={22} />
          </button>
        )}

        {!isMobile && (
          <div className="top-bar-nav">
            <button 
              className={`top-bar-nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              Panel
            </button>
            <button 
              className={`top-bar-nav-link ${currentTab === 'mapa' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mapa')}
            >
              Mapas de Campo
            </button>
            <button 
              className={`top-bar-nav-link ${currentTab === 'historia' ? 'active' : ''}`}
              onClick={() => setCurrentTab('historia')}
            >
              Historia
            </button>
            <button 
              className={`top-bar-nav-link ${currentTab === 'conocenos' ? 'active' : ''}`}
              onClick={() => setCurrentTab('conocenos')}
            >
              Conócenos
            </button>
            <button 
              className={`top-bar-nav-link ${currentTab === 'juego' ? 'active' : ''}`}
              onClick={() => setCurrentTab('juego')}
            >
              Mini Juego
            </button>
          </div>
        )}
      </div>

      <div className="top-actions">
        {!isMobile && (
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar especies de árboles en el corredor..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentTab !== 'coleccion' && e.target.value.trim() !== '') {
                  setCurrentTab('coleccion');
                }
              }}
            />
          </div>
        )}
        <div style={{ marginRight: '0.5rem' }}>
          <DarkModeToggle />
        </div>
        {!isMobile && (
          <button className="icon-btn" onClick={() => setCurrentTab('perfil')}>
            <Settings size={20} />
          </button>
        )}

        <div className="avatar-group" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          {user?.fotoPerfil ? (
            <img src={user.fotoPerfil} alt="Avatar de Usuario" className="user-avatar-small" />
          ) : (
            <div className="user-avatar-placeholder">
              <User size={20} />
            </div>
          )}
          <button 
            className="icon-btn logout-top" 
            onClick={handleLogout} 
            style={{color: '#ef4444', marginLeft: '0.25rem'}}
            title="Cerrar Sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserTopbar;

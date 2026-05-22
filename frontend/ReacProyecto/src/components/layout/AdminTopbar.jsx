import React from 'react';
import { Users, Bell, Menu, ShieldCheck, Search, ChevronDown, LogOut } from 'lucide-react';
import { DarkModeToggle } from '../common';

const AdminTopbar = ({ totalNotificaciones, setTab, isMobile, onOpenSidebar, handleLogout }) => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {isMobile && (
          <button className="admin-mobile-menu-btn" onClick={onOpenSidebar}>
            <Menu size={22} />
          </button>
        )}
        <div className="admin-topbar-search">
           <Search size={18} className="search-icon" />
           <input type="text" placeholder="Buscar en BioMon..." className="topbar-search-input" />
         </div>
      </div>
      
      <div className="admin-topbar-right">
        <div className="admin-topbar-icons">
           <DarkModeToggle />
           <div className="action-divider"></div>
           <button 
             className="admin-notification-btn" 
             onClick={() => setTab('buzon')}
             title="Ver Buzón de Notificaciones"
           >
             <Bell size={20} />
             {totalNotificaciones > 0 && (
                <span className="admin-notification-badge">
                  {totalNotificaciones}
                </span>
             )}
           </button>
           <div className="action-divider"></div>
           <button 
             className="admin-topbar-logout-btn" 
             onClick={handleLogout}
             title="Cerrar Sesión"
             aria-label="Cerrar Sesión"
           >
             <LogOut size={20} />
           </button>
        </div>

        {!isMobile && (
          <div className="admin-profile-pill">
            <span>Panel Administrativo</span>
            <div className="admin-avatar-placeholder">
              <Users size={16} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminTopbar;

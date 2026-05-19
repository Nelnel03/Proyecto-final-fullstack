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
        <div className="admin-topbar-actions">
           <DarkModeToggle />
           <div className="action-divider"></div>
           <button 
             className="admin-notification-btn" 
             onClick={() => setTab('buzon')}
             title="Ver Buzón de Notificaciones"
           >
             <Bell size={20} />
             {totalNotificaciones > 0 && (
               <span className="notification-badge animate-pulse">
                 {totalNotificaciones > 99 ? '99+' : totalNotificaciones}
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

        <div className="admin-profile-pill">
          <div className="profile-info">
            <span className="profile-name">Administrador</span>
            {!isMobile && <span className="profile-role">Master Access</span>}
          </div>
          <div className="profile-avatar">
            <div className="avatar-glow"></div>
            <Users size={16} color="#fff" />
          </div>
          <ChevronDown size={14} className="profile-chevron" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

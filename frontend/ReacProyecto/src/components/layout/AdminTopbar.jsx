import React from 'react';
<<<<<<< HEAD
import { Users, Bell, Menu } from 'lucide-react';
import DarkModeToggle from '../common/DarkModeToggle';
=======
import { Users, Bell, Menu, ShieldCheck, Search, ChevronDown, LogOut } from 'lucide-react';
import { DarkModeToggle } from '../common';
>>>>>>> e3c854b5c73ee5b1201b3260e81cf39cfe5dc91e

const AdminTopbar = ({ totalNotificaciones, setTab, isMobile, onOpenSidebar, handleLogout }) => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {isMobile && (
          <button className="admin-mobile-menu-btn" onClick={onOpenSidebar}>
            <Menu size={22} />
          </button>
        )}
<<<<<<< HEAD
        <h1>{isMobile ? 'Admin' : 'Centro de Control Administrativo'}</h1>
=======
        <div className="admin-topbar-search">
           <Search size={18} className="search-icon" />
           <input type="text" placeholder="Buscar en BioMon..." className="topbar-search-input" />
         </div>
>>>>>>> e3c854b5c73ee5b1201b3260e81cf39cfe5dc91e
      </div>
      
      <div className="admin-topbar-right">
        <div className="admin-topbar-icons">
           <DarkModeToggle />
<<<<<<< HEAD
           <div className="admin-notification-bell-wrapper" onClick={() => setTab('buzon')}>
             <Bell size={20} className="admin-icon-btn" />
=======
           <div className="action-divider"></div>
           <button 
             className="admin-notification-btn" 
             onClick={() => setTab('buzon')}
             title="Ver Buzón de Notificaciones"
           >
             <Bell size={20} />
>>>>>>> e3c854b5c73ee5b1201b3260e81cf39cfe5dc91e
             {totalNotificaciones > 0 && (
               <span className="admin-notification-badge">
                 {totalNotificaciones}
               </span>
             )}
<<<<<<< HEAD
           </div>
=======
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
>>>>>>> e3c854b5c73ee5b1201b3260e81cf39cfe5dc91e
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

import React from 'react';
import { Users, Bell, Menu } from 'lucide-react';
import DarkModeToggle from '../DarkModeToggle';

const AdminTopbar = ({ totalNotificaciones, setTab, isMobile, onOpenSidebar }) => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {isMobile && (
          <button className="admin-mobile-menu-btn" onClick={onOpenSidebar}>
            <Menu size={22} />
          </button>
        )}
        <h1>{isMobile ? 'Admin' : 'Centro de Control Administrativo'}</h1>
      </div>
      
      <div className="admin-topbar-right">
        <div className="admin-topbar-icons">
           <DarkModeToggle />
           <div className="admin-notification-bell-wrapper" onClick={() => setTab('buzon')}>
             <Bell size={20} className="admin-icon-btn" />
             {totalNotificaciones > 0 && (
               <span className="admin-notification-badge">
                 {totalNotificaciones}
               </span>
             )}
           </div>
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

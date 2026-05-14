import React from 'react';
import { Users, Bell, Menu, ShieldCheck } from 'lucide-react';
import { DarkModeToggle } from '../common';

const AdminTopbar = ({ totalNotificaciones, setTab, isMobile, onOpenSidebar }) => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {isMobile && (
          <button className="admin-mobile-menu-btn" onClick={onOpenSidebar} aria-label="Abrir menú lateral">
            <Menu size={24} />
          </button>
        )}
        <div className="admin-topbar-title">
          <ShieldCheck size={24} className="title-icon" />
          <h1>{isMobile ? 'Admin' : 'Centro de Control'}</h1>
        </div>
      </div>
      
      <div className="admin-topbar-right">
        <div className="admin-topbar-actions">
           <DarkModeToggle />
           <button 
             className="admin-notification-btn" 
             onClick={() => setTab('buzon')}
             aria-label={`${totalNotificaciones} notificaciones nuevas`}
           >
             <Bell size={22} />
             {totalNotificaciones > 0 && (
               <span className="notification-dot">
                 {totalNotificaciones > 9 ? '9+' : totalNotificaciones}
               </span>
             )}
           </button>
        </div>

        <div className="admin-user-pill">
          {!isMobile && <span className="user-role">Super Admin</span>}
          <div className="user-avatar-circle">
            <Users size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

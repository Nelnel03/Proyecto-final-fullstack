import React, { useState, useRef, useEffect } from 'react';
import { Users, Bell, Menu, Search, LogOut, CheckCheck, ChevronDown } from 'lucide-react';
import { DarkModeToggle } from '../common';
import { useNotificaciones } from '../../context/NotificacionesContext.jsx';

const AdminTopbar = ({ setTab, isMobile, onOpenSidebar, handleLogout }) => {
  const { total, summary, markAllRead } = useNotificaciones();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleBellClick = () => {
    if (total > 0) {
      setDropdownOpen(prev => !prev);
    } else {
      setTab('buzon');
    }
  };

  const handleIrBuzon = () => {
    setDropdownOpen(false);
    setTab('buzon');
  };

  const handleMarkAll = async () => {
    setDropdownOpen(false);
    await markAllRead();
  };

  const categorias = [
    { key: 'soporte',     label: 'Mensajes de soporte',   color: '#3b82f6' },
    { key: 'robos',       label: 'Alertas de robo',        color: '#ef4444' },
    { key: 'solicitudes', label: 'Solicitudes voluntariado', color: '#f59e0b' },
    { key: 'labores',     label: 'Reportes de labores',    color: '#10b981' },
  ];

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

           {/* Bell con dropdown de categorías */}
           <div className="notif-bell-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
             <button
               id="admin-notification-btn"
               className="admin-notification-btn"
               onClick={handleBellClick}
               title={total > 0 ? `${total} notificaciones sin leer` : 'Ver Buzón'}
               aria-haspopup="true"
               aria-expanded={dropdownOpen}
             >
               <Bell size={20} />
               {total > 0 && (
                 <span className="admin-notification-badge" key={total}>
                   {total > 99 ? '99+' : total}
                 </span>
               )}
             </button>

             {/* Dropdown de resumen */}
             {dropdownOpen && (
               <div
                 className="notif-dropdown"
                 style={{
                   position: 'absolute',
                   top: 'calc(100% + 10px)',
                   right: 0,
                   width: '280px',
                   background: 'var(--card-bg, #fff)',
                   border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                   borderRadius: '16px',
                   boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                   zIndex: 9999,
                   overflow: 'hidden',
                   animation: 'fadeInDown 0.18s ease'
                 }}
               >
                 {/* Header del dropdown */}
                 <div style={{
                   padding: '16px 20px 12px',
                   borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'space-between'
                 }}>
                   <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                     Notificaciones
                   </span>
                   <span style={{
                     background: 'var(--ui-primary, #10b981)',
                     color: '#fff',
                     borderRadius: '20px',
                     padding: '2px 10px',
                     fontSize: '0.72rem',
                     fontWeight: 900
                   }}>
                     {total} sin leer
                   </span>
                 </div>

                 {/* Breakdown por categoría */}
                 <div style={{ padding: '8px 0' }}>
                   {categorias.map(cat => {
                     const count = summary[cat.key] || 0;
                     if (count === 0) return null;
                     return (
                       <div
                         key={cat.key}
                         style={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'space-between',
                           padding: '8px 20px',
                           cursor: 'pointer',
                           transition: 'background 0.15s'
                         }}
                         onClick={handleIrBuzon}
                         onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                         onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                       >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <span style={{
                             width: '8px', height: '8px',
                             borderRadius: '50%',
                             background: cat.color,
                             flexShrink: 0
                           }} />
                           <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{cat.label}</span>
                         </div>
                         <span style={{
                           background: cat.color + '20',
                           color: cat.color,
                           borderRadius: '20px',
                           padding: '1px 8px',
                           fontSize: '0.72rem',
                           fontWeight: 800
                         }}>
                           {count}
                         </span>
                       </div>
                     );
                   })}
                 </div>

                 {/* Acciones */}
                 <div style={{
                   padding: '12px 16px',
                   borderTop: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                   display: 'flex',
                   gap: '8px'
                 }}>
                   <button
                     id="notif-mark-all-btn"
                     onClick={handleMarkAll}
                     style={{
                       flex: 1,
                       padding: '8px 12px',
                       borderRadius: '10px',
                       border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                       background: 'transparent',
                       cursor: 'pointer',
                       fontSize: '0.78rem',
                       fontWeight: 700,
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '6px',
                       color: 'var(--text-secondary, #6b7280)',
                       transition: 'all 0.15s'
                     }}
                     onMouseEnter={e => {
                       e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
                       e.currentTarget.style.color = '#10b981';
                       e.currentTarget.style.borderColor = '#10b981';
                     }}
                     onMouseLeave={e => {
                       e.currentTarget.style.background = 'transparent';
                       e.currentTarget.style.color = 'var(--text-secondary, #6b7280)';
                       e.currentTarget.style.borderColor = 'var(--border-color, rgba(0,0,0,0.08))';
                     }}
                   >
                     <CheckCheck size={14} />
                     Marcar todas
                   </button>
                   <button
                     id="notif-go-buzon-btn"
                     onClick={handleIrBuzon}
                     style={{
                       flex: 1,
                       padding: '8px 12px',
                       borderRadius: '10px',
                       background: 'var(--ui-primary, #10b981)',
                       border: 'none',
                       cursor: 'pointer',
                       fontSize: '0.78rem',
                       fontWeight: 700,
                       color: '#fff',
                       transition: 'opacity 0.15s'
                     }}
                     onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                     onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                   >
                     Ver Buzón
                   </button>
                 </div>
               </div>
             )}
           </div>

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

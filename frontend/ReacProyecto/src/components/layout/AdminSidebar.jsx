import React from 'react';
import {
  LayoutDashboard,
  Users,
  List,
  History,
  CheckCircle,
  FileText,
  HelpCircle,
  LogOut,
  X,
  Compass,
  ChevronRight
} from 'lucide-react';
import logoImg from '../../assets/logo_no_bg.png';

const AdminSidebar = ({ tab, setTab, resetForm, resetFormUsuario, handleLogout, isOpen, onClose, isMobile }) => {
  const sidebarLinks = [
    { id: 'resumen', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'usuarios', label: 'Comunidad', icon: Users },
    { id: 'lista', label: 'Especies', icon: List },
    { id: 'voluntariados', label: 'Gestión Equipo', icon: CheckCircle },
    { id: 'bajas', label: 'Archivo Histórico', icon: History },
    { id: 'ayuda', label: 'Centro de Ayuda', icon: HelpCircle },
    { id: 'buzon', label: 'Buzón Global', icon: FileText },
  ];

  const handleLinkClick = (linkId) => {
    setTab(linkId);
    if (resetForm) resetForm();
    if (resetFormUsuario) resetFormUsuario();
    if (isMobile && onClose) onClose();
  };

  return (
    <aside className={`admin-sidebar ${isMobile ? (isOpen ? 'mobile-open' : 'mobile-hidden') : ''}`}>

      <div className="admin-logo-section">
        <div className="admin-logo-icon">
          <img src={logoImg} alt="Logo BioMon" className="admin-logo-img" />
        </div>
        <div className="admin-logo-text">
          <h2>BioMon ADI</h2>
          <span>Plano de Control Administrativo</span>
        </div>
        {isMobile && (
          <button className="admin-sidebar-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="admin-sidebar-content">
        <div className="admin-nav-label">
           <Compass size={12} style={{ marginRight: '6px' }} />
           Navegación Principal
        </div>
        <nav className="admin-nav">
          {sidebarLinks.map((link, idx) => (
            <button 
              key={link.id}
              className={`admin-nav-item ${tab === link.id ? 'active' : ''}`}
              onClick={() => handleLinkClick(link.id)}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="active-indicator-bar"></div>
              <div className="nav-icon-wrapper">
                <link.icon size={20} strokeWidth={tab === link.id ? 2.5 : 2} />
              </div>
              <span className="nav-label">{link.label}</span>
              {tab === link.id && <ChevronRight size={14} className="active-chevron" />}
            </button>
          ))}

          {/* Separator and Spacing for Logout */}
          <div className="sidebar-logout-separator"></div>

          <button 
            className="admin-nav-item sidebar-logout-btn" 
            onClick={handleLogout}
            style={{ animationDelay: `${(sidebarLinks.length + 1) * 0.05}s` }}
          >
            <div className="nav-icon-wrapper logout">
              <LogOut size={20} strokeWidth={2} />
            </div>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;

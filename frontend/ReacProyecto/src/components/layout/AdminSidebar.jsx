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
  PlusCircle
} from 'lucide-react';

const AdminSidebar = ({ tab, setTab, resetForm, resetFormUsuario, handleLogout, isOpen, onClose, isMobile }) => {
  const sidebarLinks = [
    { id: 'resumen', label: 'Resumen Global', icon: LayoutDashboard },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'lista', label: 'Especies', icon: List },
    { id: 'voluntariados', label: 'Voluntariados', icon: CheckCircle },
    { id: 'bajas', label: 'Historial', icon: History },
    { id: 'buzon', label: 'Buzón', icon: FileText },
  ];

  const handleLinkClick = (id) => {
    setTab(id);
    resetForm();
    resetFormUsuario();
    if (isMobile) onClose();
  };

  return (
    <aside className={`admin-sidebar ${isMobile ? (isOpen ? 'mobile-open' : 'mobile-hidden') : ''}`}>
      <div className="admin-logo-section">
        <div className="admin-logo-icon">
          <img src="/src/assets/logo.png" alt="Logo" className="admin-logo-img" />
        </div>
        <div className="admin-logo-text">
          <h2>BioMon</h2>
          <span>Admin Center</span>
        </div>
        {isMobile && (
          <button className="admin-sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="admin-sidebar-content">
        <div className="admin-nav-label">Menú Principal</div>
        <nav className="admin-nav">
          {sidebarLinks.map(link => (
            <button 
              key={link.id}
              className={`admin-nav-item ${tab === link.id ? 'active' : ''}`}
              onClick={() => handleLinkClick(link.id)}
              aria-label={link.label}
            >
              <link.icon size={20} strokeWidth={tab === link.id ? 2.5 : 2} />
              <span className="nav-label">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-nav-label" style={{ marginTop: '2rem' }}>Soporte</div>
        <div className="admin-sidebar-footer">
          <button 
            className={`admin-footer-link ${tab === 'ayuda' ? 'active' : ''}`} 
            onClick={() => handleLinkClick('ayuda')}
            aria-label="Centro de Ayuda"
          >
            <HelpCircle size={20} />
            <span>Ayuda</span>
          </button>
          <button 
            className="admin-footer-link logout-btn" 
            onClick={handleLogout}
            aria-label="Cerrar Sesión"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

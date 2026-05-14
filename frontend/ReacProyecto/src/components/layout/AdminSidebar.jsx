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
  X
} from 'lucide-react';

const AdminSidebar = ({ tab, setTab, resetForm, resetFormUsuario, handleLogout, isOpen, onClose, isMobile }) => {
  const sidebarLinks = [
    { id: 'resumen', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users },
    { id: 'lista', label: 'Catálogo de Especies', icon: List },
    { id: 'bajas', label: 'Historial de Bajas', icon: History },
    { id: 'voluntariados', label: 'Registro de Voluntariados', icon: CheckCircle },
    { id: 'buzon', label: 'Buzón / Reportes', icon: FileText },
  ];

  return (
    <aside className={`admin-sidebar ${isMobile ? (isOpen ? 'mobile-open' : 'mobile-hidden') : ''}`}>

      <div className="admin-logo-section">
        <div className="admin-logo-icon">
          <img src="/src/assets/logo.png" alt="Logo BioMon" className="admin-logo-img" />
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

      <nav className="admin-nav">
        {sidebarLinks.map(link => (
          <button 
            key={link.id}
            className={`admin-nav-item ${tab === link.id ? 'active' : ''}`}
            onClick={() => { setTab(link.id); resetForm(); resetFormUsuario(); }}
          >
            <link.icon size={18} />
            <span className="nav-label">{link.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className={`admin-footer-link ${tab === 'ayuda' ? 'active-text' : ''}`} onClick={() => setTab('ayuda')}>
          <HelpCircle size={16} />
          <span>Centro de Ayuda</span>
        </div>
        <div className="admin-footer-link" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

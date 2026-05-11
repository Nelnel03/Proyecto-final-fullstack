import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import '../styles/Nav.css';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(sessionStorage.getItem('isAuthenticated') === 'true');

  // Sincronizar el estado de autenticación cuando cambie la ruta
  useEffect(() => {
    setAuth(sessionStorage.getItem('isAuthenticated') === 'true');
  }, [location]);

  // Ocultamos el Nav global SÓLO para el admin, ya que usuario y visitante sí lo usan.
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute && auth) {
    return null;
  }

  return (
    <nav className="visitor-nav">
      <div className="visitor-nav-container">
        <NavLink to={auth ? (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).rol === 'admin' ? '/admin' : '/user') : '/'} className="visitor-logo">
          <div className="visitor-logo-icon">
            <img src="/src/assets/logo.png" alt="Logo" className="visitor-logo-img" />
          </div>
          <span className="visitor-logo-text">BioMon ADI</span>
        </NavLink>
        
        <div className="visitor-nav-links">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DarkModeToggle />
          </div>
          {!auth && (
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive && location.pathname === '/' ? "visitor-link active" : "visitor-link")}
            >
              Inicio
            </NavLink>
          )}
          <NavLink 
            to="/historia" 
            className={({ isActive }) => (isActive ? "visitor-link active" : "visitor-link")}
          >
            Historia
          </NavLink>

          {!auth ? (
            <NavLink 
              to="/login" 
              className="visitor-login-btn"
            >
              Iniciar Sesión / Registro
            </NavLink>
          ) : (
            <div className="visitor-auth-actions">
              {location.pathname !== '/user' && location.pathname !== '/admin' && (
                <NavLink 
                  to={sessionStorage.getItem('user') ? (JSON.parse(sessionStorage.getItem('user')).rol === 'admin' ? '/admin' : '/user') : '/user'}
                  className="visitor-login-btn visitor-btn-panel"
                >
                  Panel
                </NavLink>
              )}
              <button 
                onClick={() => {
                  sessionStorage.removeItem('isAuthenticated');
                  sessionStorage.removeItem('user');
                  setAuth(false);
                  window.location.href = '/';
                }}
                className="visitor-login-btn visitor-btn-logout"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
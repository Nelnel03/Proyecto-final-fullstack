

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/config.jsx';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdmin from '../pages/InicioAdmin';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import LandingPage from '../pages/LandingPage';
import HistoryForm from '../pages/HistoryForm';
import Mapa from '../pages/Mapa';
import Unauthorized from '../pages/Unauthorized';

import { Nav, Navbar, Footer } from '../components/layout';
import PrivateRoutes from './PrivateRoutes';
import UserDashboard from '../components/user/UserDashboardV2';
import ModernUserDashboard from '../components/user/ModernUserDashboard';

import VolunteerDashboard from '../components/volunteer/VolunteerDashboard';
import '../styles/layout/Layout.css';

const rolToDashboard = (rol) => {
  if (rol === 'admin') return '/admin';
  if (rol === 'voluntario') return '/dashboard-voluntario';
  return '/dashboard-user';
};

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';

  // Sincroniza el rol del usuario con la DB cada vez que carga la app o cambia de ruta.
  // Esto garantiza que si el admin cambió el rol, el usuario sea redirigido al panel correcto.
  useEffect(() => {
    const syncRole = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          sessionStorage.clear();
          navigate('/login', { replace: true });
          return;
        }

        if (!res.ok) return;

        const freshUser = await res.json();
        const stored = JSON.parse(sessionStorage.getItem('user') || '{}');

        // Si el rol cambió, actualizar sessionStorage y redirigir al panel correcto
        if (stored.rol !== freshUser.rol) {
          sessionStorage.setItem('user', JSON.stringify({ ...stored, ...freshUser }));
          navigate(rolToDashboard(freshUser.rol), { replace: true });
        } else {
          // Aunque no cambió el rol, mantener el objeto fresco (foto, nombre, etc.)
          sessionStorage.setItem('user', JSON.stringify({ ...stored, ...freshUser }));
        }
      } catch (error) {
        // Error de red — no interrumpir la navegación
      }
    };

    if (isAuth) syncRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAuth, navigate]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPremiumRoute = 
    location.pathname.startsWith('/user') || 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/dashboard-user') || 
    location.pathname.startsWith('/dashboard-voluntario');

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/reset-password';



  return (
    <div className="app-main-layout-container">
      {/* 
          Condicional para el Nav/Navbar:

          Si es una ruta tipo dashboard/admin, mostramos el Navbar.
          Si es visitante normal, mostramos el Nav global.
          Si es login o reset, no mostramos nada (form minimal).
      */}
      {!isAuthRoute && 
       !isAdminRoute && 
       !location.pathname.startsWith('/dashboard-user') &&
       !location.pathname.startsWith('/dashboard-voluntario') && 
       (isPremiumRoute ? <Navbar /> : <Nav />)}

      <div className={`main-content-layout ${isPremiumRoute ? '' : isAuthRoute ? '' : 'visitor-layout'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/historia" element={<HistoryForm />} />
          <Route path="/visitante" element={<InicioVisitantes />} />

          <Route path="/mapa" element={<Mapa />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          
          {/* Redirección para la ruta antigua /user a los nuevos dashboards */}
          <Route 
            path="/user" 
            element={
              isAuth ? (
                (() => {
                  const u = JSON.parse(sessionStorage.getItem('user') || '{}');
                  if (u.rol === 'voluntario') return <Navigate to="/dashboard-voluntario" replace />;
                  if (u.rol === 'admin') return <Navigate to="/admin" replace />;
                  return <Navigate to="/dashboard-user" replace />;
                })()
              ) : <Navigate to="/login" replace />
            } 
          />

          <Route
            path="/dashboard-user"
            element={
              <PrivateRoutes rolesAllowed={['user', 'usuario']}>
                <ModernUserDashboard />
              </PrivateRoutes>
            }
          />

          <Route 
            path="/dashboard-voluntario" 
            element={
              <PrivateRoutes rolesAllowed={['voluntario']}>
                <VolunteerDashboard />
              </PrivateRoutes>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <PrivateRoutes roleRequired="admin">
                <InicioAdmin />
              </PrivateRoutes>
            } 
          />
        </Routes>
      </div>
      {location.pathname !== '/mapa' && !isAdminRoute && !location.pathname.startsWith('/dashboard-user') && !location.pathname.startsWith('/dashboard-voluntario') && <Footer />}


    </div>
  );
}

function Rooting() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default Rooting;



import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdmin from '../pages/InicioAdmin';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import LandingPage from '../pages/LandingPage';
import HistoryForm from '../pages/HistoryForm';
import Mapa from '../pages/Mapa';

import Nav from '../components/Nav';
import Navbar from '../components/Navbar';
import PrivateRoutes from './PrivateRoutes';
import UserDashboard from '../components/user/UserDashboardV2';
import ModernUserDashboard from '../components/user/ModernUserDashboard';

import VolunteerDashboard from '../components/volunteer/VolunteerDashboard';
import '../styles/Layout.css';
import Footer from '../components/Footer';

function MainLayout() {
  const location = useLocation();
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPremiumRoute = 
    location.pathname.startsWith('/user') || 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/dashboard-user') || 
    location.pathname.startsWith('/dashboard-voluntario');

  const isUserDashboard = 
    location.pathname.startsWith('/user') || 
    location.pathname.startsWith('/dashboard-user');

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
       !location.pathname.startsWith('/dashboard-voluntario') && 
       !location.pathname.startsWith('/dashboard-user') && 
       (isPremiumRoute ? <Navbar /> : <Nav />)}

      <div className={`main-content-layout ${isPremiumRoute ? '' : isAuthRoute ? '' : 'visitor-layout'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/historia" element={<HistoryForm />} />
          <Route path="/visitante" element={<InicioVisitantes />} />

          <Route path="/mapa" element={<Mapa />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Redirección para la ruta antigua /user a los nuevos dashboards */}
          <Route 
            path="/user" 
            element={
              isAuth ? (
                (() => {
                  const u = JSON.parse(sessionStorage.getItem('user') || '{}');
                  return u.rol === 'voluntario' ? <Navigate to="/dashboard-voluntario" replace /> : <Navigate to="/dashboard-user" replace />;
                })()
              ) : <Navigate to="/login" replace />
            } 
          />

          <Route 
            path="/dashboard-user" 
            element={
              <PrivateRoutes rolesAllowed={['user']}>
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
      {location.pathname !== '/mapa' && location.pathname !== '/dashboard-voluntario' && !isAdminRoute && <Footer />}


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

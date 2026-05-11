
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../services/services';
import ArbolesSection from '../ArbolesSection';
import '../../styles/PremiumDashboard.css';

function MainPagesInicoUser() {
  const [userName, setUserName] = useState('');
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nombre);
    }

    cargarArboles();
  }, [navigate]);

  const cargarArboles = async () => {
    setCargando(true);
    try {
      const datos = await services.getArboles();
      setArboles(datos || []);
    } catch (err) {
      console.error('Error al cargar árboles:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-premium">
      <div className="premium-header">
        <div className="user-premium-header-flex">
            <div>
                <h2 className="user-premium-subtitle">BioMon ADI</h2>
                <h1>¡Hola! {userName}</h1>
                <p className="user-premium-greeting">
                    Tu portal personal de monitoreo forestal. Explora y protege la biodiversidad local.
                </p>
                {sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).rol === 'voluntario' && (
                    <div className="badge">Voluntario Activo</div>
                )}
            </div>
            <button
                onClick={handleLogout}
                className="btn-logout-premium user-btn-logout-margin"
            >
                Cerrar Sesión
            </button>
        </div>
      </div>

      <main className="glass-card user-glass-main">
        <section className="user-section-title">
          <h2 className="user-collection-heading">Tu Colección Forestal</h2>
          <p className="user-collection-desc">
            Explora las especies registradas en el sistema. Puedes ver detalles técnicos, estados de salud y progresos de crecimiento.
          </p>
        </section>

        {cargando ? (
          <div className="user-loading-container">
            <div className="loading-spinner user-loading-spinner"></div>
            <p className="user-loading-text">Sincronizando datos del bosque...</p>
          </div>
        ) : (
          <ArbolesSection arboles={arboles} />
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoUser;


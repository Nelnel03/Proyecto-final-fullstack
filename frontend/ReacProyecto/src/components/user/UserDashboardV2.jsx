import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import services from '../../services/services';
import ArbolesSection from '../ArbolesSection';
import UserProfile from './UserProfile';
import UserReports from './UserReports';
import UserReportesRobo from './UserReportesRobo';
import MisReportesTab from './MisReportesTab';
import '../../styles/MainPagesInicoVisitante.css';
import '../../styles/UserDashboard.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentTab, setCurrentTab] = useState('coleccion');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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


  useEffect(() => {
    // Sincronizar tab con la URL si existe
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    }

    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.rol !== 'user') {
        navigate('/login'); // Protection
        return;
      }
      setUser(parsedUser);
    }
    cargarArboles();
  }, [navigate, searchParams, setCurrentTab]);

  if (!user) {
    return (
      <div className="dashboard-loading">
        <h2>Cargando sesión...</h2>
      </div>
    );
  }

  return (
    <div className="visitante-container">
      <header className="visitante-header dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user?.fotoPerfil ? (
          <img 
            src={user.fotoPerfil} 
            alt="Avatar" 
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} 
          />
        ) : (
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff', border: '2px solid white' }}>
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <div style={{ textAlign: 'left' }}>
          <h1 className="dashboard-header-title" style={{ margin: 0 }}>Panel de Usuario</h1>
          <p className="dashboard-header-greeting" style={{ margin: 0 }}>¡Hola {user?.nombre}! Explora nuestra colección forestal.</p>
        </div>
      </header>

      <main className="visitante-content dashboard-main-content">
        <section className="visitante-nav-pills dashboard-tabs">
          <button 
            onClick={() => setCurrentTab('coleccion')}
            className={`tab-btn ${currentTab === 'coleccion' ? 'active' : ''}`}
          >
            Colección
          </button>
          <button 
            onClick={() => setCurrentTab('mis_reportes')}
            className={`tab-btn ${currentTab === 'mis_reportes' ? 'active' : ''}`}
          >
            Mis Solicitudes
          </button>
          <button 
            onClick={() => setCurrentTab('reporte_robo')}
            className={`tab-btn tab-btn-danger ${currentTab === 'reporte_robo' ? 'active' : ''}`}
          >
            Reportar Robo
          </button>
          <button 
            onClick={() => setCurrentTab('reportes')}
            className={`tab-btn ${currentTab === 'reportes' ? 'active' : ''}`}
          >
            Contacto/Soporte
          </button>
          <button 
            onClick={() => setCurrentTab('perfil')}
            className={`tab-btn ${currentTab === 'perfil' ? 'active' : ''}`}
          >
            Mi Perfil
          </button>
        </section>

        <div className="dashboard-view-container">
          {currentTab === 'coleccion' && (
            <div>
              <h2 className="dashboard-section-title">Explorar el Bosque</h2>
              {cargando ? <p>Cargando especies...</p> : <ArbolesSection arboles={arboles} />}
            </div>
          )}
          {currentTab === 'mis_reportes' && <MisReportesTab user={user} />}
          {currentTab === 'reporte_robo' && <UserReportesRobo user={user} onDone={() => setCurrentTab('mis_reportes')} />}
          {currentTab === 'reportes' && <UserReports user={user} onDone={() => setCurrentTab('mis_reportes')} />}
          {currentTab === 'perfil' && <UserProfile user={user} onUpdateUser={setUser} />}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;

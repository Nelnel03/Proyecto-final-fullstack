import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Edit3, 
  Trees, 
  FileText, 
  Trophy, 
  Compass,
  Map as MapIcon,
  Search,
  Bookmark,
  BookOpen,
  ChevronRight,

  Droplets,
  Sprout,
  Moon,
  LogOut,
  Settings,
  HelpCircle,
  Eye,
  Heart,
  PlusCircle,
  Bell,
  LayoutDashboard,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import Swal from 'sweetalert2';
import services from '../../services/services';

import ArbolesSection from '../ArbolesSection';
import ConocenosTab from '../ConocenosTab';
import UserProfile from './UserProfile';

import UserReports from './UserReports';
import UserReportesRobo from './UserReportesRobo';
import MisReportesTab from './MisReportesTab';
import CorridorMap from '../CorridorMap';
import History from '../History';
import HistoryQuiz from '../HistoryQuiz';
import DarkModeToggle from '../DarkModeToggle';
import SolicitudVoluntariadoTab from './SolicitudVoluntariadoTab';

import UserSidebar from './UserSidebar';
import UserTopbar from './UserTopbar';
import UserDashboardTab from './UserDashboardTab';

import '../../styles/ModernUserDashboard.css';

function ModernUserDashboard() {
  const [user, setUser] = useState(null);
  const [arboles, setArboles] = useState([]);
  const [viewMode, setViewMode] = useState('individual'); // 'individual' o 'especies'
  const [searchTerm, setSearchTerm] = useState('');

  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
        navigate('/login'); 
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
    
    fetchData();

    // POLLEO EN TIEMPO REAL (Simulación con Intervalo de 30s)
    const intervalId = setInterval(() => {
        fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [navigate, searchParams]);

  const fetchData = async () => {
    setCargando(true);
    try {
      const [arbolesData, reportesData] = await Promise.all([
        services.getArboles(),
        services.getReportes()
      ]);
      setArboles(arbolesData || []);
      setReportes(reportesData || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que quieres salir?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#064e3b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, Salir',
      cancelButtonText: 'Cancelar',
      background: isDark ? '#1e1e1e' : '#fff',
      color: isDark ? '#fff' : '#545454'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('user');
        navigate('/');
      }
    });
  };


  if (!user) return <div className="modern-loading">Cargando...</div>;

  // Filtrado de árboles
  const filteredArboles = arboles.filter(arbol => 
    arbol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arbol.nombreCientifico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arbol.familia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arbol.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculos para el Dashboard
  const userReports = reportes.filter(r => r.userId === user.id);
  const stats = {
    observations: arboles.length,
    contributions: userReports.length,
    impactPoints: arboles.length * 12, // Ejemplo dinámico
    expeditions: Math.floor(userReports.length / 2) + 1
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <UserDashboardTab 
            user={user} 
            stats={stats} 
            arboles={arboles} 
            setCurrentTab={setCurrentTab} 
          />
        );
      case 'mapa':
        return (
          <div className="main-section-card" style={{padding: 0, height: '70vh', overflow: 'hidden'}}>
            <CorridorMap />
          </div>
        );
      case 'historia':
        return (
          <div className="main-section-card" style={{padding: 0, height: '70vh', overflowX: 'hidden', overflowY: 'auto'}}>
            <History user={user} />
          </div>
        );

      case 'coleccion':
        const displayArboles = filteredArboles;

        return (
          <div className="main-section-card">
            <div className="section-header-flex" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{margin: 0}}>Guía de Árboles</h2>

              <div className="view-mode-toggle">
                <button 
                  onClick={() => setViewMode('individual')}
                  className={`view-mode-btn ${viewMode === 'individual' ? 'active' : ''}`}
                >
                  Individual
                </button>
                <button 
                  onClick={() => setViewMode('especies')}
                  className={`view-mode-btn ${viewMode === 'especies' ? 'active' : ''}`}
                >
                  Por Especie
                </button>
              </div>
            </div>
            {cargando ? <p>Cargando especies...</p> : <ArbolesSection arboles={displayArboles} viewMode={viewMode} />}

          </div>
        );

      case 'mis_reportes':
        return <MisReportesTab user={user} />;
      case 'reporte_robo':
        return <UserReportesRobo user={user} onDone={() => setCurrentTab('mis_reportes')} />;
      case 'reportes':
        return <UserReports user={user} onDone={() => setCurrentTab('mis_reportes')} />;
      case 'perfil':
        return <UserProfile user={user} onUpdateUser={setUser} onTabChange={setCurrentTab} />;
      case 'conocenos':
        return <ConocenosTab />;
      case 'solicitud_voluntariado':
        return <SolicitudVoluntariadoTab user={user} onDone={() => setCurrentTab('mis_reportes')} />;
      case 'juego':
        return <div className="main-section-card"><HistoryQuiz /></div>;

      default:


        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className={`modern-dashboard-container ${isMobile ? 'is-mobile' : ''}`}>
      <UserSidebar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSidebarOpen(false); // Auto-close on tab selection
        }} 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="modern-main-content">
        <UserTopbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          user={user} 
          handleLogout={handleLogout} 
          onOpenSidebar={() => setSidebarOpen(true)}
          isMobile={isMobile}
        />

        {/* Content Area */}
        <div className="dynamic-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default ModernUserDashboard;

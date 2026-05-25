import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  User,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Settings,
  Check,
  XCircle,
  CalendarDays,
  Download,
  Hourglass,
  CheckCircle2,
  PlayCircle,
  StopCircle,
  Menu,
  Activity,
  Award,
  ChevronRight,
  FileText
} from 'lucide-react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import UserProfile from '../user/UserProfile';
import ReporteForm from './ReporteForm';
import { DarkModeToggle } from '../common';
import { Pagination } from '../ui';

function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.rol !== 'voluntario') {
        if (parsed.rol === 'admin') navigate('/admin', { replace: true });
        else navigate('/dashboard-user', { replace: true });
        return;
      }
      setUser(parsed);
      cargarLogs(parsed.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const cargarLogs = async (volId) => {
    setLoading(true);
    try {
      const all = await services.getReportesVoluntariado();
      const mis = (all || [])
        .filter(r => r.voluntario_id === volId || r.voluntarioId === volId)
        .sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      setLogs(mis);
      if (mis.length > 0) setSelectedLog(mis[0]);
    } catch (err) { console.error(err);
      console.error('Error al cargar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que volver a ingresar tus credenciales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#14532d',
      cancelButtonColor: '#991b1b',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate('/login');
      }
    });
  };

  const getTaskBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return { color: 'text-[#e65100]', bg: 'bg-[#fff3e0]' };
    if (t.includes('suelo') || t.includes('siembra') || t.includes('plant')) return { color: 'text-[#2e7d32]', bg: 'bg-[#e8f5e9]' };
    return { color: 'text-[#0277bd]', bg: 'bg-[#e3f2fd]' };
  };

  const getStatusLabel = (estado) => {
    const map = { aprobado: 'Aprobado', rechazado: 'Rechazado', rechazado_pre: 'Rechazado', solicitado: 'Solicitado', en_curso: 'En Curso', asignado: 'Asignado', enviado: 'Enviado' };
    return map[estado] || estado;
  };

  const aprobados = logs.filter(l => l.estado === 'aprobado');
  const _rechazados = logs.filter(l => l.estado.startsWith('rechazado'));
  const pendientes = logs.filter(l => ['enviado', 'solicitado', 'asignado', 'en_curso'].includes(l.estado));
  const horasAprobadas = aprobados.reduce((acc, l) => acc + (Number(l.horas) || 0), 0);
  const logsFiltrados = busqueda
    ? logs.filter(l => 
        l.tipoTarea?.toLowerCase().includes(busqueda.toLowerCase()) || 
        l.fecha?.includes(busqueda) ||
        l.tareas?.toLowerCase().includes(busqueda.toLowerCase()) ||
        l.estado?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : logs;

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { key: 'logs', icon: <ClipboardList size={18} />, label: 'Mis Labores', badge: pendientes.length },
    { key: 'nueva_tarea', icon: <PlayCircle size={18} />, label: 'Nueva Tarea' },
    { key: 'ayuda', icon: <HelpCircle size={18} />, label: 'Centro de Ayuda' },
    { key: 'perfil', icon: <User size={18} />, label: 'Mi Perfil' },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full mx-auto mb-3 animate-spin" />
          <p className="text-on-background font-['Montserrat']">Iniciando entorno científico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background font-['Manrope'] w-full transition-colors duration-300">
      
      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] lg:w-[260px] bg-surface-container text-on-surface flex flex-col transition-transform duration-300 z-[9999] border-r border-premium-border ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 pb-5 border-b border-premium-border flex items-center justify-between">
          <div>
            <h2 className="text-[0.8rem] font-bold uppercase tracking-wider text-on-surface font-['Montserrat'] m-0">Terminal</h2>
            <span className="text-xs text-on-surface opacity-70 font-bold tracking-widest uppercase">Voluntariado</span>
          </div>
          {isMobile && (
            <button className="bg-surface-container-low hover:bg-premium-border p-1.5 rounded-lg text-on-surface transition-colors cursor-pointer" onClick={() => setSidebarOpen(false)}>
              <XCircle size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-2">
          {navItems.map(item => (
            <div
              key={item.key}
              onClick={() => {
                setCurrentTab(item.key);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all text-sm font-semibold border ${currentTab === item.key ? 'bg-primary-container text-on-primary-container border-transparent shadow-sm' : 'bg-transparent text-on-surface border-transparent hover:bg-surface-container-low'}`}
            >
              <div>{item.icon}</div>
              <span>{item.label}</span>
              {item.badge > 0 && <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${currentTab === item.key ? 'bg-on-primary-container text-primary-container' : 'bg-error-container text-on-error-container'}`}>{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 px-3 border-t border-premium-border">
          <div className="flex items-center gap-3 py-3 px-4 text-on-error-container bg-error-container/20 text-sm font-bold cursor-pointer rounded-xl transition-all hover:bg-error-container" onClick={handleLogout}>
            <LogOut size={16} /> <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto flex flex-col w-full h-screen">
        
        {/* HEADER */}
        <header className="flex items-center justify-between p-4 lg:py-5 lg:px-8 border-b border-premium-border bg-surface-container sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            {isMobile && (
              <button className="bg-surface-container-low text-on-surface border-none p-2 rounded-lg cursor-pointer" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <div className="hidden md:flex items-center gap-2 bg-surface-container-low rounded-full py-2 px-4 border border-premium-border max-w-sm w-full transition-all focus-within:ring-2 focus-within:ring-on-primary-container/20">
              <Search size={16} className="text-on-surface opacity-50" />
              <input
                type="text"
                placeholder="Buscar registros..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="border-none bg-transparent outline-none text-sm text-on-surface w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <div className="flex items-center gap-3 bg-surface-container-low rounded-full py-1.5 pr-4 pl-1.5 border border-premium-border">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold overflow-hidden">
                {user?.fotoPerfil ? <img src={user.fotoPerfil} alt="" className="w-full h-full object-cover" /> : user?.nombre?.charAt(0) || 'V'}
              </div>
              {!isMobile && <span className="text-sm font-bold text-on-surface">{user?.nombre?.split(' ')[0]}</span>}
            </div>
          </div>
        </header>

        {/* ── TAB: DASHBOARD ── */}
        {currentTab === 'dashboard' && (
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto w-full animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-2 text-on-background font-['Montserrat']">Resumen de Actividades</h1>
                <p className="text-on-background opacity-70 text-sm">Monitor de esfuerzo y rendimiento en el Eco-Corredor La Angostura.</p>
            </div>
            
            {/* GRID CIENTÍFICA (Izquierda: Contenido principal, Derecha: Widgets) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* COLUMNA PRINCIPAL */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tarjetas de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: <Hourglass size={24} />, val: `${horasAprobadas}h`, label: 'Esfuerzo Validado', color: "text-on-primary-container", bg: "bg-primary-container", border: "border-on-primary-container/10" },
                            { icon: <CheckCircle2 size={24} />, val: aprobados.length, label: 'Registros Aprobados', color: "text-on-primary-container", bg: "bg-primary-container", border: "border-on-primary-container/10" },
                            { icon: <Activity size={24} />, val: pendientes.length, label: 'En Revisión (Activo)', color: "text-on-error-container", bg: "bg-error-container", border: "border-on-error-container/10" },
                        ].map((s, i) => (
                            <div key={i} className={`rounded-2xl p-6 border ${s.bg} ${s.border} flex flex-col transition-all hover:-translate-y-1 hover:shadow-md`}>
                                <div className={`mb-4 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center ${s.color}`}>{s.icon}</div>
                                <div className={`text-4xl font-black mb-1 font-['Montserrat'] ${s.color}`}>{s.val}</div>
                                <div className={`text-xs font-bold uppercase tracking-wider opacity-80 ${s.color}`}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="bg-surface-container rounded-2xl p-8 border border-premium-border">
                        <h2 className="text-lg font-bold mb-4 font-['Montserrat']">Acciones Operativas</h2>
                        <div className="flex gap-4 flex-wrap">
                            <button onClick={() => setCurrentTab('nueva_tarea')} className="py-3 px-6 rounded-xl bg-primary-container text-on-primary-container font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-sm">
                                <PlayCircle size={18} /> Registrar Nueva Labor
                            </button>
                            <button onClick={() => setCurrentTab('logs')} className="py-3 px-6 rounded-xl bg-surface-container-low text-on-surface border border-premium-border font-bold text-sm hover:bg-premium-border transition-all flex items-center gap-2 shadow-sm">
                                <ClipboardList size={18} /> Ver Bitácora Completa
                            </button>
                        </div>
                    </div>
                </div>

                {/* BARRA LATERAL (WIDGETS) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Widget Rendimiento */}
                    <div className="bg-surface-container rounded-2xl p-6 border border-premium-border shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold font-['Montserrat'] flex items-center gap-2">
                                <Award size={18} className="text-on-primary-container" /> Rendimiento Global
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Nivel Actual</span>
                                    <span className="text-on-primary-container">{horasAprobadas < 20 ? 'Principiante' : horasAprobadas < 50 ? 'Intermedio' : 'Experto'}</span>
                                </div>
                                <div className="w-full bg-surface-container-low rounded-full h-2">
                                    <div className="bg-on-primary-container h-2 rounded-full" style={{ width: `${Math.min(100, (horasAprobadas / 50) * 100)}%` }}></div>
                                </div>
                                <p className="text-[0.65rem] opacity-70 mt-1 uppercase tracking-wide">Progreso al siguiente nivel</p>
                            </div>
                        </div>
                    </div>

                    {/* Widget Próximas Labores */}
                    <div className="bg-surface-container rounded-2xl p-6 border border-premium-border shadow-sm">
                        <h3 className="font-bold font-['Montserrat'] mb-4 flex items-center gap-2">
                            <CalendarDays size={18} className="text-on-primary-container" /> En Curso
                        </h3>
                        {pendientes.length > 0 ? (
                            <div className="space-y-3">
                                {pendientes.slice(0,3).map(p => (
                                    <div key={p.id} onClick={() => { setCurrentTab('logs'); setSelectedLog(p); }} className="p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-premium-border transition-colors">
                                        <div className="text-sm font-bold truncate">{p.tipoTarea}</div>
                                        <div className="text-xs opacity-70 flex justify-between mt-1">
                                            <span>{p.fecha}</span>
                                            <span className="font-bold text-on-error-container uppercase">{p.estado}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-surface-container-low rounded-xl border border-premium-border border-dashed">
                                <p className="text-sm opacity-60">No hay labores pendientes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* ── TAB: LOGS ── */}
        {currentTab === 'logs' && (
          <div className={`grid h-full overflow-hidden ${selectedLog && !isMobile ? 'grid-cols-[1fr_350px]' : 'grid-cols-1'} animate-in fade-in duration-500`}>
            {/* Lista de Registros */}
            <div className="overflow-y-auto p-6 lg:p-10">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-black m-0 text-on-background font-['Montserrat']">Bitácora Científica</h1>
                  <p className="m-0 mt-2 text-sm text-on-background opacity-70">Historial de registros y evaluaciones operativas.</p>
                </div>
                {pendientes.length > 0 && (
                  <span className="px-4 py-1.5 rounded-full bg-error-container text-on-error-container text-xs font-bold border border-on-error-container/20">
                    {pendientes.length} REGISTRO(S) EN REVISIÓN
                  </span>
                )}
              </div>

              {/* Refactor: Ajuste de layout de grid para evitar colapso/overlap en pantallas desktop y zooms. Uso de fracciones y gap para mantener spacing uniforme */}
              <div className="grid grid-cols-[1fr_70px_110px] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-4 px-4 py-3 text-xs font-bold text-on-surface opacity-60 uppercase tracking-widest border-b-2 border-premium-border mb-3 font-['Montserrat']">
                <span>Actividad</span>
                <span className="hidden lg:block">Fecha</span>
                <span className="hidden lg:block">Tipo</span>
                <span>Esfuerzo</span>
                <span>Estado</span>
              </div>

              <div className="flex flex-col gap-3 pb-8">
                {loading ? (
                  <div className="text-center p-12 text-on-surface opacity-50">
                    <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                    <p>Cargando registros...</p>
                  </div>
                ) : logsFiltrados.length === 0 ? (
                  <div className="text-center p-16 bg-surface-container rounded-2xl border border-premium-border border-dashed">
                    <ClipboardList size={48} className="opacity-20 mx-auto mb-4" />
                    <p className="font-bold opacity-60">{busqueda ? 'No se encontraron coincidencias.' : 'Aún no existen registros en la bitácora.'}</p>
                    {!busqueda && (
                      <button onClick={() => setCurrentTab('nueva_tarea')} className="mt-6 px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold cursor-pointer text-sm hover:opacity-90">
                        Iniciar Registro Operativo
                      </button>
                    )}
                  </div>
                ) : logsFiltrados.map(log => {
                  const badge = getTaskBadge(log.tipoTarea);
                  const isSelected = selectedLog?.id === log.id;
                  
                  let statusColor = '', statusBg = '';
                  if(log.estado === 'aprobado') { statusColor = 'text-on-primary-container'; statusBg = 'bg-primary-container'; }
                  else if(log.estado === 'rechazado' || log.estado === 'rechazado_pre') { statusColor = 'text-on-error-container'; statusBg = 'bg-error-container'; }
                  else if(log.estado === 'en_curso') { statusColor = 'text-[#6b21a8]'; statusBg = 'bg-[#f3e8ff]'; } // Purple M3 equivalent approx
                  else if(log.estado === 'asignado') { statusColor = 'text-[#1e3a8a]'; statusBg = 'bg-[#dbeafe]'; } // Blue approx
                  else if(log.estado === 'enviado' || log.estado === 'solicitado') { statusColor = 'text-on-error-container'; statusBg = 'bg-error-container'; } // Using error/amber container

                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`grid grid-cols-[1fr_70px_110px] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-4 items-center px-4 py-4 rounded-2xl cursor-pointer transition-all bg-surface-container border ${isSelected ? 'border-on-primary-container ring-1 ring-on-primary-container shadow-sm' : 'border-premium-border hover:-translate-y-0.5 hover:shadow-md'}`}
                    >
                      <div>
                        <div className="font-bold text-sm text-on-surface mb-1">{log.tipoTarea}</div>
                        <div className="text-xs text-on-surface opacity-60 truncate max-w-[200px]">{log.tareas?.substring(0, 40) || '—'}</div>
                      </div>
                      <div className="hidden lg:flex items-center gap-2 text-xs text-on-surface opacity-70">
                        <CalendarDays size={14} className="opacity-50" /> {log.fecha}
                      </div>
                      <div className="hidden lg:block">
                        <span className={`px-2 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider ${badge.bg} ${badge.color}`}>
                          {log.tipoTarea?.split(' ')[0]}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-on-surface">{log.horas}h</div>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {getStatusLabel(log.estado)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel de Detalles */}
            {(!isMobile || selectedLog) && (
              <div className={`bg-surface-container border-l border-premium-border overflow-y-auto p-6 ${isMobile ? 'fixed inset-0 z-[10000]' : ''}`}>
                <div className="sticky top-0 bg-surface-container pb-4 mb-4 border-b border-premium-border z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-on-surface m-0 font-['Montserrat'] flex items-center gap-2">
                        <FileText size={20} className="text-on-primary-container" /> Detalles
                    </h3>
                    {isMobile && (
                      <button className="bg-surface-container-low border-none cursor-pointer text-on-surface p-2 rounded-lg" onClick={() => setSelectedLog(null)}>
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {selectedLog ? (
                  <div className="flex flex-col gap-6">
                    {selectedLog.pruebas && (
                      <div className="rounded-xl overflow-hidden border border-premium-border shadow-sm">
                        <img src={selectedLog.pruebas} alt="Evidencia" className="w-full h-48 object-cover block" />
                      </div>
                    )}
                    <div>
                      <label className="block text-[0.65rem] font-bold text-on-surface opacity-50 uppercase tracking-widest mb-1.5">Observación Reportada</label>
                      <p className="m-0 text-sm text-on-surface bg-surface-container-low p-4 rounded-xl leading-relaxed">{selectedLog.tareas || 'Sin observación registrada.'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-low rounded-xl p-4">
                        <label className="block text-[0.65rem] font-bold text-on-surface opacity-50 uppercase tracking-widest mb-1">Categoría</label>
                        <span className="text-sm font-bold text-on-surface">{selectedLog.tipoTarea}</span>
                      </div>
                      <div className="bg-surface-container-low rounded-xl p-4">
                        <label className="block text-[0.65rem] font-bold text-on-surface opacity-50 uppercase tracking-widest mb-1">Esfuerzo</label>
                        <span className="text-sm font-bold text-on-surface">{selectedLog.horas}h</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      {selectedLog.estado === 'asignado' ? (
                        <div className="p-4 rounded-xl flex flex-col gap-3 text-sm font-bold bg-[#dbeafe] border border-[#93c5fd] text-[#1e3a8a]">
                          <div className="flex items-center gap-2">
                              <PlayCircle size={18} /> Labor Asignada (Pendiente Ejecución)
                          </div>
                          <button onClick={() => setCurrentTab('subir_evidencia')} className="px-4 py-2.5 bg-[#1d4ed8] text-white border-none rounded-lg font-bold cursor-pointer text-sm hover:opacity-90 transition-opacity">
                            Subir Evidencia Científica
                          </button>
                        </div>
                      ) : selectedLog.estado === 'solicitado' ? (
                        <div className="p-4 rounded-xl flex items-center gap-2 text-sm font-bold bg-error-container border border-error-container text-on-error-container">
                          <Clock size={18} /> <span>A la espera de validación administrativa.</span>
                        </div>
                      ) : selectedLog.estado === 'enviado' ? (
                        <div className="p-4 rounded-xl flex items-center gap-2 text-sm font-bold bg-error-container border border-error-container text-on-error-container">
                          <CheckCircle2 size={18} /> <span>Evidencia sometida a revisión.</span>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${selectedLog.estado === 'aprobado' ? 'bg-primary-container border-on-primary-container/20 text-on-primary-container' : 'bg-error-container border-on-error-container/20 text-on-error-container'}`}>
                          {selectedLog.estado === 'aprobado' ? <Check size={18} /> : <XCircle size={18} />}
                          <span>
                            {selectedLog.estado === 'aprobado'
                              ? 'Esfuerzo aprobado y contabilizado.'
                              : `Rechazado: ${selectedLog.motivoRechazo || 'Revisar lineamientos.'}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center pt-20 text-on-surface opacity-40">
                    <ClipboardList size={48} className="mx-auto mb-4" />
                    <p className="font-bold">Seleccione un registro para visualizar los detalles técnicos.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: NUEVA TAREA ── */}
        {currentTab === 'nueva_tarea' && (
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black mb-2 text-on-background font-['Montserrat']">Registrar Labor</h1>
            <p className="text-on-background opacity-70 text-sm mb-8">Catálogo de necesidades operativas del ecosistema.</p>
            <div className="bg-surface-container rounded-2xl border border-premium-border p-6 shadow-sm">
                <ReporteForm
                user={user}
                busqueda={busqueda}
                onReportSubmitted={() => {
                    setCurrentTab('logs');
                    cargarLogs(user.id);
                }}
                />
            </div>
          </div>
        )}

        {/* ── TAB: AYUDA ── */}
        {currentTab === 'ayuda' && (
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black mb-2 text-on-background font-['Montserrat']">Centro de Soporte Operativo</h1>
            <p className="text-on-background opacity-70 text-sm mb-8">Documentación y asistencia para voluntarios de campo.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface-container p-8 rounded-2xl border border-premium-border shadow-sm">
                <h2 className="text-lg font-black text-on-surface mb-6 font-['Montserrat']">Flujo de Trabajo (SOP)</h2>
                <div className="space-y-6">
                {[
                  { t: '1. Selección', d: 'Identifica una necesidad en "Nueva Tarea" y envía la solicitud formal.' },
                  { t: '2. Asignación', d: 'El sistema registrará tu labor como "Asignada" tras la validación.' },
                  { t: '3. Ejecución', d: 'Despliegue en el Eco-Corredor siguiendo los estándares de seguridad.' },
                  { t: '4. Verificación', d: 'Sube la evidencia fotográfica del trabajo realizado para auditar las horas.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-black text-sm flex-shrink-0">{i + 1}</div>
                    <div>
                      <div className="font-bold text-sm text-on-surface mb-1">{step.t}</div>
                      <div className="text-sm text-on-surface opacity-70 leading-relaxed">{step.d}</div>
                    </div>
                  </div>
                ))}
                </div>
              </div>

              <div className="bg-surface-container p-8 rounded-2xl border border-premium-border shadow-sm flex flex-col">
                <h2 className="text-lg font-black text-on-surface mb-2 font-['Montserrat']">Contacto Directo</h2>
                <p className="text-sm text-on-surface opacity-70 mb-6">Reporte de incidencias o dudas operativas al coordinador.</p>
                <textarea
                  placeholder="Describa la situación detalladamente..."
                  id="soporte-msg"
                  className="w-full flex-1 min-h-[150px] p-4 rounded-xl border border-premium-border bg-surface-container-low text-sm resize-y box-border text-on-surface focus:outline-none focus:ring-2 focus:ring-on-primary-container/20 mb-4"
                />
                <button
                  className="w-full py-3 rounded-xl bg-on-primary-container text-primary-container font-bold text-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
                  onClick={async () => {
                    const msg = document.getElementById('soporte-msg').value;
                    if (!msg) return Swal.fire('Error', 'Debe incluir un mensaje descriptivo.', 'warning');
                    try {
                      await services.postReportes({
                        tipo: 'soporte',
                        usuarioId: `vol-${user.id}`,
                        usuarioNombre: user.nombre,
                        asunto: 'Incidencia Operativa - Voluntariado',
                        contenido: msg,
                        fecha: new Date().toLocaleDateString(),
                        visto: false
                      });
                      Swal.fire('Transmisión Exitosa', 'El coordinador ha recibido su mensaje.', 'success');
                      document.getElementById('soporte-msg').value = '';
                    } catch (e) { console.error(e);
                      Swal.fire('Error', 'No se pudo enviar.', 'error');
                    }
                  }}
                >
                  Transmitir Mensaje
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SUBIR EVIDENCIA ── */}
        {currentTab === 'subir_evidencia' && selectedLog && (
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black mb-2 text-on-background font-['Montserrat']">Auditoría de Tarea</h1>
            <p className="text-on-background opacity-70 text-sm mb-8">Anexe el comprobante visual del esfuerzo realizado.</p>
            <div className="bg-surface-container rounded-2xl border border-premium-border p-6 shadow-sm">
                <ReporteForm
                user={user}
                tareaAsignada={selectedLog}
                onCancel={() => setCurrentTab('logs')}
                onReportSubmitted={() => {
                    setCurrentTab('logs');
                    cargarLogs(user.id);
                    setSelectedLog(null);
                }}
                />
            </div>
          </div>
        )}

        {/* ── TAB: PERFIL ── */}
        {currentTab === 'perfil' && (
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black mb-2 text-on-background font-['Montserrat']">Credenciales de Acceso</h1>
            <p className="text-on-background opacity-70 text-sm mb-8">Gestión de identidad operativa.</p>
            <div className="bg-surface-container rounded-2xl border border-premium-border p-6 shadow-sm">
                <UserProfile user={user} onUpdateUser={setUser} isProfessionalMode={true} />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default VolunteerDashboard;

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
  Menu
} from 'lucide-react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import UserProfile from '../user/UserProfile';
import ReporteForm from './ReporteForm';
import DarkModeToggle from '../DarkModeToggle';
import '../../styles/VoluntariadoPremium.css';

const SIDEBAR = '#283618';
const SIDEBAR_ACTIVE = '#344e41';
const ACCENT = '#a3b18a';

function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('logs');
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
      if (parsed.rol !== 'voluntario') { navigate('/login'); return; }
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
        .filter(r => r.voluntarioId === volId)
        .sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      setLogs(mis);
      if (mis.length > 0) setSelectedLog(mis[0]);
    } catch (err) {
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
      confirmButtonColor: SIDEBAR_ACTIVE,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: isDark ? '#1e1e1e' : '#fff',
      color: isDark ? '#fff' : '#545454'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate('/login');
      }
    });
  };

  const getTaskBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return { color: '#e65100', bg: '#fff3e0' };
    if (t.includes('suelo') || t.includes('siembra') || t.includes('plant')) return { color: '#2e7d32', bg: '#e8f5e9' };
    return { color: '#0277bd', bg: '#e3f2fd' };
  };

  const getStatusLabel = (estado) => {
    const map = { aprobado: 'Aprobado', rechazado: 'Rechazado', rechazado_pre: 'Rechazado', solicitado: 'Solicitado', en_curso: 'En Curso', asignado: 'Asignado', enviado: 'Enviado' };
    return map[estado] || estado;
  };

  const aprobados = logs.filter(l => l.estado === 'aprobado');
  const rechazados = logs.filter(l => l.estado.startsWith('rechazado'));
  const pendientes = logs.filter(l => ['enviado', 'solicitado', 'asignado', 'en_curso'].includes(l.estado));
  const horasAprobadas = aprobados.reduce((acc, l) => acc + (Number(l.horas) || 0), 0);
  const logsFiltrados = busqueda
    ? logs.filter(l => l.tipoTarea?.toLowerCase().includes(busqueda.toLowerCase()) || l.fecha?.includes(busqueda))
    : logs;

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { key: 'logs', icon: <ClipboardList size={17} />, label: 'Mis Labores', badge: pendientes.length },
    { key: 'nueva_tarea', icon: <PlayCircle size={17} />, label: 'Nueva Tarea' },
    { key: 'ayuda', icon: <HelpCircle size={17} />, label: 'Centro de Ayuda' },
    { key: 'perfil', icon: <User size={17} />, label: 'Mi Perfil' },
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f5f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666' }}>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`premium-vol-layout ${isMobile ? 'is-mobile' : 'full-content'}`}>

      {/* ── SIDEBAR ── */}
      <aside className={`premium-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>

        <div className="sidebar-logo-container">
          <div>
            <h2 className="sidebar-title">Centro de Control</h2>
            <span className="sidebar-subtitle">Panel de Voluntario</span>
          </div>
          {isMobile && (
            <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
              <XCircle size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-quick-stats">
          <div className="sidebar-stat-item">
            <div className="stat-num highlighted">{horasAprobadas}h</div>
            <div className="stat-label">Aprobadas</div>
          </div>
          <div className="sidebar-stat-item">
            <div className="stat-num alert">{pendientes.length}</div>
            <div className="stat-label">En Revisión</div>
          </div>
        </div>

        <nav className="sidebar-nav-container">
          {navItems.map(item => (
            <div
              key={item.key}
              onClick={() => {
                setCurrentTab(item.key);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`sidebar-nav-link ${currentTab === item.key ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">{item.icon}</div>
              <span className="nav-text">{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer-container">
          <button onClick={() => currentTab === 'logs' && cargarLogs(user.id)} className="btn-sidebar-export">
            <Download size={14} /> Exportar Reporte
          </button>
          <div className="sidebar-logout-link" onClick={handleLogout}>
            <LogOut size={15} /> <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="premium-main-area">
        {/* Top Bar */}
        <div className="volunteer-top-bar">
          <div className="top-bar-left">
            {isMobile && (
              <button className="mobile-menu-trigger" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <div className="top-search-bar">
              <Search size={14} color="#999" />
              <input
                type="text"
                placeholder="Buscar en mis labores..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="top-bar-right">
            <DarkModeToggle />
            <div className="top-profile-pill">
              <div className="mini-avatar">
                {user?.fotoPerfil ? <img src={user.fotoPerfil} alt="" /> : user?.nombre?.charAt(0) || 'V'}
              </div>
              {!isMobile && <span className="pill-name">{user?.nombre}</span>}
            </div>
          </div>
        </div>

        {/* ── TAB: DASHBOARD ── */}
        {currentTab === 'dashboard' && (
          <div className="tab-dashboard-content">
            <h1 className="welcome-title">¡Bienvenido, {user?.nombre?.split(' ')[0]}!</h1>
            <p className="welcome-subtitle">Aquí está el resumen de tus actividades en el Eco-Corredor La Angostura.</p>
            <div className="stats-grid-v2">
              {[
                { icon: <Hourglass size={20} color="#059669" />, val: `${horasAprobadas}h`, label: 'Horas Aprobadas', bg: '#064e3b', border: '#065f46', valColor: '#6ee7b7', labelColor: '#a7f3d0' },
                { icon: <CheckCircle2 size={20} color="#6ee7b7" />, val: aprobados.length, label: 'Labores Validadas', bg: '#064e3b', border: '#065f46', valColor: '#6ee7b7', labelColor: '#a7f3d0' },
                { icon: <Clock size={20} color="#fbbf24" />, val: pendientes.length, label: 'En Revisión', bg: '#78350f', border: '#92400e', valColor: '#fcd34d', labelColor: '#fde68a' },
              ].map((s, i) => (
                <div key={i} className="stat-card-premium" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <div className="stat-icon-wrapper">{s.icon}</div>
                  <div className="stat-value-big" style={{ color: s.valColor }}>{s.val}</div>
                  <div className="stat-label-big" style={{ color: s.labelColor }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="dashboard-actions-group">
              <button onClick={() => setCurrentTab('nueva_tarea')} className="btn-primary-v2">
                <PlayCircle size={16} /> Registrar Nueva Labor
              </button>
              <button onClick={() => setCurrentTab('logs')} className="btn-secondary-v2">
                <ClipboardList size={16} /> Ver Mis Labores
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: LOGS ── */}
        {currentTab === 'logs' && (
          <div className={`logs-layout-container ${selectedLog && !isMobile ? 'has-selection' : ''}`}>
            {/* Lista */}
            <div className="logs-list-scrollable">
              <div className="logs-section-header">
                <div className="title-area">
                  <h1 className="section-title">Mis Labores</h1>
                  <p className="section-subtitle">Historial de tus actividades registradas</p>
                </div>
                {pendientes.length > 0 && (
                  <span className="pending-badge-float">
                    ⏳ {pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="logs-table-header">
                <span>Actividad</span>
                <span className="hide-mobile">Fecha</span>
                <span className="hide-mobile">Tipo</span>
                <span>Horas</span>
                <span>Estado</span>
              </div>

              <div className="logs-rows-stack">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner-small" />
                    <p>Cargando...</p>
                  </div>
                ) : logsFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <ClipboardList size={36} style={{ opacity: 0.25 }} />
                    <p>{busqueda ? 'Sin resultados.' : 'Aún no tienes labores registradas.'}</p>
                    {!busqueda && (
                      <button onClick={() => setCurrentTab('nueva_tarea')} className="btn-link-underline">
                        Registrar mi primera labor
                      </button>
                    )}
                  </div>
                ) : logsFiltrados.map(log => {
                  const badge = getTaskBadge(log.tipoTarea);
                  const isSelected = selectedLog?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`log-row-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="log-col-main">
                        <div className="log-title">{log.tipoTarea}</div>
                        <div className="log-desc">{log.tareas?.substring(0, 40) || '—'}</div>
                      </div>
                      <div className="log-col-date hide-mobile">
                        <CalendarDays size={11} /> {log.fecha}
                      </div>
                      <div className="log-col-type hide-mobile">
                        <span className="type-badge" style={{ background: badge.bg, color: badge.color }}>
                          {log.tipoTarea?.split(' ')[0]}
                        </span>
                      </div>
                      <div className="log-col-hours">{log.horas}h</div>
                      <div className={`log-col-status status-${log.estado}`}>
                        <span className="status-dot" />
                        <span className="status-text">{getStatusLabel(log.estado)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Panel */}
            {(!isMobile || selectedLog) && (
              <div className={`logs-details-panel ${isMobile ? 'mobile-overlay' : ''}`}>
                <div className="details-card-sticky">
                  <div className="details-header">
                    <h3>Detalles</h3>
                    {isMobile && (
                      <button className="close-details-btn" onClick={() => setSelectedLog(null)}>
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>

                  {selectedLog ? (
                    <div className="details-body">
                      {selectedLog.pruebas && (
                        <div className="details-image-wrapper">
                          <img src={selectedLog.pruebas} alt="Evidencia" />
                        </div>
                      )}
                      <div className="details-section">
                        <label>Observación</label>
                        <p>{selectedLog.tareas || '—'}</p>
                      </div>
                      <div className="details-grid-mini">
                        <div className="mini-box">
                          <label>Tipo</label>
                          <span>{selectedLog.tipoTarea}</span>
                        </div>
                        <div className="mini-box">
                          <label>Horas</label>
                          <span>{selectedLog.horas}h</span>
                        </div>
                      </div>

                      <div className="details-footer-status">
                        {selectedLog.estado === 'asignado' ? (
                          <div className="status-alert info">
                            <PlayCircle size={15} />
                            <span>Labor Asignada.</span>
                            <button onClick={() => setCurrentTab('subir_evidencia')} className="btn-action-small">
                              Reportar Completada
                            </button>
                          </div>
                        ) : selectedLog.estado === 'solicitado' ? (
                          <div className="status-alert warning">
                            <Clock size={15} /> <span>Esperando asignación...</span>
                          </div>
                        ) : selectedLog.estado === 'enviado' ? (
                          <div className="status-alert info">
                            <CheckCircle2 size={15} /> <span>Evidencia enviada, en revisión.</span>
                          </div>
                        ) : (
                          <div className={`status-alert ${selectedLog.estado === 'aprobado' ? 'success' : 'danger'}`}>
                            {selectedLog.estado === 'aprobado' ? <Check size={15} /> : <XCircle size={15} />}
                            <span>
                              {selectedLog.estado === 'aprobado'
                                ? '✓ Horas validadas por el admin'
                                : `Rechazado: ${selectedLog.motivoRechazo || 'Consulta al admin'}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="details-placeholder">
                      <ClipboardList size={36} />
                      <p>Selecciona una labor</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: NUEVA TAREA ── */}
        {currentTab === 'nueva_tarea' && (
          <div className="standard-tab-padding">
            <h1 className="tab-heading">Solicitar Tarea</h1>
            <p className="tab-subheading">Selecciona una labor en el catálogo para solicitarla.</p>
            <ReporteForm
              user={user}
              busqueda={busqueda}
              onReportSubmitted={() => {
                setCurrentTab('logs');
                cargarLogs(user.id);
              }}
            />
          </div>
        )}

        {/* ── TAB: AYUDA ── */}
        {currentTab === 'ayuda' && (
          <div className="standard-tab-padding">
            <h1 className="tab-heading">Centro de Ayuda</h1>
            <p className="tab-subheading">Aprende cómo funciona el voluntariado o contacta con el administrador.</p>
            <div className="help-grid">
              <div>
                <h2 className="help-section-title">Mini Guía de Uso</h2>
                {[
                  { t: '1. Elige una Tarea', d: 'Ve a "Nueva Tarea", busca en el catálogo y envía tu solicitud.' },
                  { t: '2. Espera Asignación', d: 'El admin revisará y verás la labor en "Mis Labores" como Asignada.' },
                  { t: '3. Realiza el Trabajo', d: 'Completa la labor en el Eco-Corredor según lo acordado.' },
                  { t: '4. Sube tu Evidencia', d: 'Sube la foto de tu trabajo para que el admin valide tus horas.' }
                ].map((step, i) => (
                  <div key={i} className="help-step">
                    <div className="help-step-num">{i + 1}</div>
                    <div>
                      <div className="help-step-title">{step.t}</div>
                      <div className="help-step-desc">{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="help-support-card">
                <h2>Mensaje de Soporte</h2>
                <p>¿Tienes una duda? Escribe aquí al administrador.</p>
                <textarea
                  placeholder="Escribe tu duda o problema aquí..."
                  id="soporte-msg"
                  className="support-textarea"
                />
                <button
                  className="btn-primary-v2"
                  style={{ width: '100%', marginTop: '0.8rem' }}
                  onClick={async () => {
                    const msg = document.getElementById('soporte-msg').value;
                    if (!msg) return Swal.fire('Error', 'Escribe un mensaje primero', 'warning');
                    try {
                      await services.postReportes({
                        tipo: 'soporte',
                        usuarioId: `vol-${user.id}`,
                        usuarioNombre: user.nombre,
                        asunto: 'Soporte de Voluntariado',
                        contenido: msg,
                        fecha: new Date().toLocaleDateString(),
                        visto: false
                      });
                      Swal.fire('¡Enviado!', 'Tu mensaje ha sido enviado.', 'success');
                      document.getElementById('soporte-msg').value = '';
                    } catch (e) {
                      Swal.fire('Error', 'No se pudo enviar.', 'error');
                    }
                  }}
                >
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SUBIR EVIDENCIA ── */}
        {currentTab === 'subir_evidencia' && selectedLog && (
          <div className="standard-tab-padding">
            <h1 className="tab-heading">Entregar Evidencia</h1>
            <p className="tab-subheading">Sube la fotografía de tu labor completada.</p>
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
        )}

        {/* ── TAB: PERFIL ── */}
        {currentTab === 'perfil' && (
          <div className="standard-tab-padding">
            <h1 className="tab-heading">Mi Perfil</h1>
            <p className="tab-subheading">Administra tu información personal.</p>
            <UserProfile user={user} onUpdateUser={setUser} isProfessionalMode={true} />
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default VolunteerDashboard;

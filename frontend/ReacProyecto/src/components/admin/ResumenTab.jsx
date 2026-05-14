import React from 'react';
import { Users, Trees, UserMinus, AlertCircle, ArrowRight, ExternalLink, Calendar, ShieldCheck, Activity, Award } from 'lucide-react';

const ResumenTab = ({ 
  usuarios, 
  arboles, 
  setTab, 
  setUserSubTab 
}) => {
  const stats = [
    {
      label: 'Usuarios Totales',
      value: usuarios.length,
      subtitle: `${usuarios.filter(u => (u.Rol?.nombre || u.rol) === 'voluntario').length} Voluntarios`,
      icon: Users,
      color: 'var(--ui-success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      onClick: () => { setTab('usuarios'); setUserSubTab('activos'); }
    },
    {
      label: 'Árboles Registrados',
      value: arboles.length,
      subtitle: 'Especies en conservación',
      icon: Trees,
      color: 'var(--ui-info)',
      bg: 'rgba(59, 130, 246, 0.1)',
      onClick: () => setTab('lista')
    },
    {
      label: 'Cuentas Inactivas',
      value: usuarios.filter(u => u.status === 'baneado' || u.status === 'banned').length,
      subtitle: 'Usuarios restringidos',
      icon: UserMinus,
      color: 'var(--ui-warning)',
      bg: 'rgba(245, 158, 11, 0.1)',
      onClick: () => { setTab('usuarios'); setUserSubTab('cancelados'); }
    },
    {
      label: 'Bajas Reportadas',
      value: arboles.filter(a => a.estado === 'muerto').length,
      subtitle: 'Incidencias críticas',
      icon: AlertCircle,
      color: 'var(--ui-error)',
      bg: 'rgba(239, 68, 68, 0.1)',
      onClick: () => setTab('bajas')
    }
  ];

  const recentTrees = arboles.slice(-6).reverse();

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="dashboard-header flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', margin: 0 }}>Centro de Control</h2>
          <p className="text-muted" style={{ fontSize: '1rem', marginTop: '4px' }}>Visión holística del ecosistema BioMon</p>
        </div>
        <div className="premium-card flex-center" style={{ padding: '12px 20px', borderRadius: '16px', gap: '12px', background: 'var(--glass-bg)' }}>
          <Activity size={20} color="var(--ui-primary)" className="animate-pulse" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ui-primary)', textTransform: 'uppercase' }}>Sistema Activo</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.8 }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="premium-card clickable-card" 
            onClick={stat.onClick}
            style={{ 
              animationDelay: `${idx * 0.1}s`,
              padding: '2rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
               <stat.icon size={120} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
              <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '14px', background: stat.bg, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', opacity: 0.6, letterSpacing: '0.5px' }}>
                {stat.label.toUpperCase()}
              </div>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-1px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ui-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {stat.subtitle} <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }} className="grid-auto">
        
        {/* Left Column: Recent Activity */}
        <div className="premium-card" style={{ padding: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--ui-primary-bg)', color: 'var(--ui-primary)' }}>
                 <Activity size={20} />
               </div>
               <div>
                 <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Actividad Reciente</h3>
                 <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Últimos ejemplares incorporados</p>
               </div>
            </div>
            <button className="ui-btn ui-btn--ghost" onClick={() => setTab('lista')} style={{ fontSize: '0.8rem' }}>
              Gestionar Catálogo <ExternalLink size={14} style={{ marginLeft: '6px' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTrees.length > 0 ? (
              recentTrees.map((arbol, idx) => (
                <div key={idx} className="fade-in" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '12px', 
                  borderRadius: '16px', 
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  animationDelay: `${idx * 0.05}s`
                }}>
                  <img 
                    src={arbol.imagenUrl || 'https://via.placeholder.com/60'} 
                    alt={arbol.nombre} 
                    style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{arbol.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ui-primary)', fontWeight: 700 }}>{arbol.tipo?.toUpperCase() || 'ESPECIE'} • {arbol.clima || 'Clima General'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.5, marginBottom: '4px' }}>ESTADO</div>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      background: arbol.estado === 'vivo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: arbol.estado === 'vivo' ? 'var(--ui-success)' : 'var(--ui-error)'
                    }}>
                      {(arbol.estado || 'activo').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-center" style={{ padding: '4rem', opacity: 0.4, flexDirection: 'column' }}>
                <Trees size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
                <p>No hay registros recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Health Status / Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="premium-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--ui-primary), var(--color-bosque-pino))', color: '#fff', border: 'none' }}>
             <Award size={40} style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
             <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 900 }}>Estatus del Ecosistema</h3>
             <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
               El monitoreo actual indica una tasa de supervivencia del <strong>{Math.round((arboles.filter(a => a.estado === 'vivo').length / (arboles.length || 1)) * 100)}%</strong>. 
               Buen trabajo gestionando las especies.
             </p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                <ShieldCheck size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Protección BioMon Activa</span>
             </div>
          </div>

          <div className="premium-card" style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Próximos Pasos</h3>
              <Calendar size={18} className="text-muted" />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { text: 'Revisar reportes de robo pendientes', tab: 'buzon' },
                { text: 'Validar nuevas postulaciones', tab: 'buzon' },
                { text: 'Actualizar catálogo de abonos', tab: 'abonos' }
              ].map((step, idx) => (
                <li key={idx} onClick={() => setTab(step.tab)} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.02)',
                  transition: '0.2s'
                }} className="hover-push">
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ui-primary)' }}></div>
                  {step.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumenTab;

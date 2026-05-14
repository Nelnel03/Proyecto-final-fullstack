import React, { useMemo } from 'react';
import { 
  Users, 
  Trees, 
  UserMinus, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  Activity, 
  Award,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const ResumenTab = ({ 
  usuarios, 
  arboles, 
  setTab, 
  setUserSubTab 
}) => {
  // --- DATA PROCESSING FOR CHARTS ---
  
  // 1. Growth Data (Mocked but based on real data for trends)
  const growthData = useMemo(() => [
    { name: 'Ene', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Abr', value: 800 },
    { name: 'May', value: arboles.length > 0 ? arboles.length * 10 : 500 },
  ], [arboles]);

  // 2. Tree Health Distribution
  const healthData = useMemo(() => [
    { name: 'Vivos', value: arboles.filter(a => a.estado === 'vivo').length, color: '#10b981' },
    { name: 'Muertos', value: arboles.filter(a => a.estado === 'muerto').length, color: '#ef4444' },
    { name: 'En Tratamiento', value: arboles.filter(a => a.estado === 'enfermo').length, color: '#f59e0b' },
  ].filter(d => d.value > 0), [arboles]);

  const stats = [
    {
      label: 'Usuarios Totales',
      value: usuarios.length,
      trend: '+12%',
      icon: Users,
      color: 'var(--ui-success)',
      onClick: () => { setTab('usuarios'); setUserSubTab('activos'); }
    },
    {
      label: 'Árboles Registrados',
      value: arboles.length,
      trend: '+5.4%',
      icon: Trees,
      color: 'var(--ui-info)',
      onClick: () => setTab('lista')
    },
    {
      label: 'Cuentas Inactivas',
      value: usuarios.filter(u => u.status === 'baneado' || u.status === 'banned').length,
      trend: '-2%',
      icon: UserMinus,
      color: 'var(--ui-warning)',
      onClick: () => { setTab('usuarios'); setUserSubTab('cancelados'); }
    },
    {
      label: 'Bajas Críticas',
      value: arboles.filter(a => a.estado === 'muerto').length,
      trend: '+1',
      icon: AlertCircle,
      color: 'var(--ui-error)',
      onClick: () => setTab('bajas')
    }
  ];

  const recentTrees = arboles.slice(-5).reverse();

  return (
    <div className="admin-tab-content-wrapper fade-in">
      {/* Header Section */}
      <div className="dashboard-header-premium mb-8">
        <div className="flex-between align-start">
          <div>
            <h2 className="text-gradient font-black" style={{ fontSize: '2.5rem', letterSpacing: '-1.5px' }}>
              Dashboard Principal
            </h2>
            <p className="text-muted font-bold" style={{ fontSize: '1.1rem' }}>
              Gestión inteligente y monitoreo del Corredor Biológico.
            </p>
          </div>
          <div className="system-status-pill">
            <Zap size={16} className="text-primary animate-pulse" />
            <span>Sistema: <strong>Online</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="stats-grid-saas mb-8">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="saas-stat-card premium-card" 
            onClick={stat.onClick}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="stat-card-inner">
              <div className="stat-icon-wrapper" style={{ color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label-saas">{stat.label}</p>
                <h3 className="stat-value-saas">{stat.value}</h3>
                <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  <TrendingUp size={12} /> {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="dashboard-main-grid mb-8">
        {/* Growth Chart */}
        <div className="premium-card chart-container p-6">
          <div className="flex-between mb-6">
            <h3 className="card-title-saas">Tendencia de Registro</h3>
            <button className="ui-btn ui-btn--ghost text-xs">Últimos 6 meses</button>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--ui-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--ui-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, opacity: 0.5}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--sombra-profunda)' }} 
                  cursor={{ stroke: 'var(--ui-primary)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--ui-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Pie Chart */}
        <div className="premium-card chart-container p-6">
          <h3 className="card-title-saas mb-6">Estado Fitofortificante</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={healthData.length > 0 ? healthData : [{name: 'Sin datos', value: 1, color: '#ccc'}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(healthData.length > 0 ? healthData : [{color: '#ccc'}]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {healthData.map((item, i) => (
              <div key={i} className="legend-item">
                <span className="dot" style={{ background: item.color }}></span>
                <span className="name">{item.name}</span>
                <span className="val">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Layout: Activity + Quick Actions */}
      <div className="dashboard-footer-grid">
        <div className="premium-card p-6">
          <div className="flex-between mb-6">
            <h3 className="card-title-saas">Actividad Reciente</h3>
            <button className="text-link-small" onClick={() => setTab('lista')}>Ver Todo</button>
          </div>
          <div className="saas-activity-list">
            {recentTrees.map((arbol, idx) => (
              <div key={idx} className="activity-item-saas">
                <div className="activity-icon-saas">
                  <Trees size={16} />
                </div>
                <div className="activity-content-saas">
                  <p className="activity-text"><strong>{arbol.nombre}</strong> fue registrado con éxito.</p>
                  <span className="activity-time">{arbol.fechaRegistro || 'Reciente'}</span>
                </div>
                <div className={`status-dot ${arbol.estado === 'vivo' ? 'bg-success' : 'bg-error'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-saas">
          <div className="premium-card p-6 mb-4 bg-primary text-white border-none">
            <Award size={32} className="mb-4 opacity-80" />
            <h4 className="font-black text-xl mb-2">Meta Mensual</h4>
            <p className="text-sm opacity-90 mb-4">Estamos a 12 registros de alcanzar el objetivo de reforestación.</p>
            <div className="saas-progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="premium-card p-6">
            <h4 className="card-title-saas mb-4">Acceso Rápido</h4>
            <div className="quick-links-grid">
              {[
                { label: 'Buzón', icon: Activity, tab: 'buzon' },
                { label: 'Usuarios', icon: ShieldCheck, tab: 'usuarios' },
                { label: 'Abonos', icon: Zap, tab: 'abonos' },
                { label: 'Soporte', icon: Calendar, tab: 'ayuda' }
              ].map((link, i) => (
                <button key={i} className="quick-link-item" onClick={() => setTab(link.tab)}>
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .dashboard-header-premium {
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-bottom: 1.5rem;
        }
        
        .system-status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          box-shadow: var(--sombra-suave);
          border: 1px solid var(--glass-border);
        }

        .stats-grid-saas {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .saas-stat-card {
          padding: 1.5rem;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .saas-stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card-inner {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .stat-icon-wrapper {
          width: 50px;
          height: 50px;
          background: rgba(0,0,0,0.03);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-label-saas {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--color-tierra-sombra);
          opacity: 0.6;
          margin-bottom: 2px;
        }

        .stat-value-saas {
          font-size: 1.8rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
        }

        .stat-trend {
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-trend.positive { color: var(--ui-success); }
        .stat-trend.negative { color: var(--ui-error); }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .card-title-saas {
          font-size: 1.1rem;
          font-weight: 900;
          margin: 0;
        }

        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
        }

        .legend-item .dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-item .name { flex: 1; font-weight: 600; opacity: 0.7; }
        .legend-item .val { font-weight: 800; }

        .dashboard-footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.5rem;
        }

        .saas-activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item-saas {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
        }

        .activity-icon-saas {
          width: 32px;
          height: 32px;
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ui-primary);
        }

        .activity-text { font-size: 0.85rem; margin: 0; }
        .activity-time { font-size: 0.7rem; opacity: 0.5; font-weight: 700; }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; }
        .bg-success { background: var(--ui-success); }
        .bg-error { background: var(--ui-error); }

        .saas-progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill { height: 100%; background: #fff; border-radius: 10px; }

        .quick-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .quick-link-item {
          background: rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.05);
          padding: 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .quick-link-item:hover {
          background: var(--ui-primary-bg);
          color: var(--ui-primary);
          border-color: var(--ui-primary);
        }

        .quick-link-item span { font-size: 0.75rem; font-weight: 800; }

        @media screen and (max-width: 1024px) {
          .dashboard-main-grid, .dashboard-footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumenTab;

import React, { useMemo, useState } from 'react';
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
  reportesRobos = [],
  setTab, 
  setUserSubTab,
  cargando = false
}) => {
  const [filtroIncidentes, setFiltroIncidentes] = useState('mes');
  // --- DATA PROCESSING FOR CHARTS ---
  
  // 1. Growth Data: Dynamic month calculation based on real tree/user registration records
  const growthData = useMemo(() => {
    const months = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Get the last 6 months (inclusive of current month)
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        name: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        arboles: 0,
        usuarios: 0
      });
    }

    const getYearMonth = (dateInput) => {
      if (!dateInput) return null;
      let d = new Date(dateInput);
      if (isNaN(d.getTime())) return null;
      return { year: d.getFullYear(), month: d.getMonth() };
    };

    // Count real trees registered per month
    arboles.forEach(arbol => {
      const dateInfo = getYearMonth(arbol.fechaRegistro) || getYearMonth(arbol.createdAt) || getYearMonth(arbol.created_at);
      if (dateInfo) {
        const match = months.find(m => m.year === dateInfo.year && m.month === dateInfo.month);
        if (match) {
          match.arboles += 1;
        }
      }
    });

    // Count real users registered per month
    usuarios.forEach(user => {
      const dateInfo = getYearMonth(user.fechaIngreso) || getYearMonth(user.createdAt) || getYearMonth(user.created_at);
      if (dateInfo) {
        const match = months.find(m => m.year === dateInfo.year && m.month === dateInfo.month);
        if (match) {
          match.usuarios += 1;
        }
      }
    });

    return months.map(m => ({
      name: m.name,
      value: m.arboles + m.usuarios,
      'Árboles': m.arboles,
      'Usuarios': m.usuarios
    }));
  }, [arboles, usuarios]);

  // 2. Tree Health Distribution: Real distribution with exact dynamic percentages
  const healthData = useMemo(() => {
    const vivos = arboles.filter(a => a.estado === 'vivo').length;
    const muertos = arboles.filter(a => a.estado === 'muerto').length;
    const enTratamiento = arboles.filter(a => a.estado === 'enfermo').length;
    const total = vivos + muertos + enTratamiento;

    return [
      { 
        name: 'Vivos', 
        value: vivos, 
        percentage: total > 0 ? ((vivos / total) * 100).toFixed(1) : '0.0', 
        color: '#10b981' 
      },
      { 
        name: 'En Riesgo', 
        value: enTratamiento, 
        percentage: total > 0 ? ((enTratamiento / total) * 100).toFixed(1) : '0.0', 
        color: '#f59e0b' 
      },
      { 
        name: 'Inactivos', 
        value: muertos, 
        percentage: total > 0 ? ((muertos / total) * 100).toFixed(1) : '0.0', 
        color: '#ef4444' 
      },
    ].filter(d => d.value > 0);
  }, [arboles]);

  // 3. Incidentes Data (Robos y Daños): Last 6 months, 4 weeks, or 7 days
  const incidentesData = useMemo(() => {
    const dataPoints = [];
    const today = new Date();

    const normalizeDate = (d) => {
      if (!d) return null;
      let dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return null;
      return dateObj;
    };

    if (filtroIncidentes === 'mes') {
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        dataPoints.push({
          year: d.getFullYear(),
          month: d.getMonth(),
          name: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
          Reportes: 0
        });
      }
      reportesRobos.forEach(reporte => {
        const d = normalizeDate(reporte.fecha || reporte.created_at || reporte.createdAt);
        if (d) {
          const match = dataPoints.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
          if (match) match.Reportes += 1;
        }
      });
    } else if (filtroIncidentes === 'semana') {
      for (let i = 3; i >= 0; i--) {
        const start = new Date(today);
        start.setDate(today.getDate() - (i * 7 + today.getDay()));
        start.setHours(0,0,0,0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23,59,59,999);
        dataPoints.push({
          start,
          end,
          name: `Sem. ${4 - i}`,
          Reportes: 0
        });
      }
      reportesRobos.forEach(reporte => {
        const d = normalizeDate(reporte.fecha || reporte.created_at || reporte.createdAt);
        if (d) {
          const match = dataPoints.find(w => d >= w.start && d <= w.end);
          if (match) match.Reportes += 1;
        }
      });
    } else if (filtroIncidentes === 'dia') {
      const daysNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        d.setHours(0,0,0,0);
        dataPoints.push({
          date: d.toDateString(),
          name: `${daysNames[d.getDay()]} ${d.getDate()}`,
          Reportes: 0
        });
      }
      reportesRobos.forEach(reporte => {
        const d = normalizeDate(reporte.fecha || reporte.created_at || reporte.createdAt);
        if (d) {
          d.setHours(0,0,0,0);
          const match = dataPoints.find(day => day.date === d.toDateString());
          if (match) match.Reportes += 1;
        }
      });
    }

    return dataPoints;
  }, [reportesRobos, filtroIncidentes]);

  // --- PREMIUM SKELETON LOADING STATE ---
  const getGrowth = (dataArray, dateFields) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let currentMonthCount = 0;
    let previousMonthCount = 0;

    dataArray.forEach(item => {
      let dateVal = null;
      for (let field of dateFields) {
        if (item[field]) {
          dateVal = item[field];
          break;
        }
      }
      if (!dateVal) dateVal = item.createdAt || item.created_at;
      if (!dateVal) return;
      
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return;

      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        currentMonthCount++;
      } else if (
        (currentMonth === 0 && d.getMonth() === 11 && d.getFullYear() === currentYear - 1) ||
        (d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear)
      ) {
        previousMonthCount++;
      }
    });

    if (previousMonthCount === 0) {
      return currentMonthCount > 0 ? `+${currentMonthCount * 100}%` : '0%';
    }
    const diff = currentMonthCount - previousMonthCount;
    const percentage = (diff / previousMonthCount) * 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const trendUsuarios = useMemo(() => getGrowth(usuarios, ['fechaIngreso', 'fechaRegistro']), [usuarios]);
  const trendArboles = useMemo(() => getGrowth(arboles, ['fechaRegistro', 'fechaPlantacion']), [arboles]);
  
  const trendInactivas = useMemo(() => {
    const inactivas = usuarios.filter(u => u.status === 'baneado' || u.status === 'banned');
    return getGrowth(inactivas, ['fechaIngreso', 'fechaRegistro']); 
  }, [usuarios]);

  const trendBajas = useMemo(() => {
    const bajas = arboles.filter(a => a.estado === 'muerto');
    return getGrowth(bajas, ['fechaRegistro', 'fechaPlantacion']);
  }, [arboles]);

  if (cargando) {
    return (
      <div className="admin-tab-content-wrapper fade-in">
        {/* Header Section */}
        <div className="dashboard-header-premium mb-8">
          <div className="flex-between align-start">
            <div>
              <div className="skeleton premium-shimmer" style={{ width: '250px', height: '40px', borderRadius: '8px', marginBottom: '12px' }}></div>
              <div className="skeleton premium-shimmer" style={{ width: '400px', height: '20px', borderRadius: '4px' }}></div>
            </div>
            <div className="skeleton premium-shimmer" style={{ width: '150px', height: '36px', borderRadius: '50px' }}></div>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="stats-grid-saas mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="saas-stat-card premium-card skeleton premium-shimmer" style={{ minHeight: '150px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ width: '60%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ width: '40%', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="dashboard-main-grid mb-8">
          <div className="premium-card chart-container p-6 skeleton premium-shimmer" style={{ height: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ width: '200px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div style={{ width: '100px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
            </div>
            <div style={{ width: '100%', height: '260px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}></div>
          </div>

          <div className="premium-card chart-container p-6 skeleton premium-shimmer" style={{ height: '380px' }}>
            <div style={{ width: '180px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginBottom: '32px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
              <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '15px solid rgba(255,255,255,0.03)' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
              <div style={{ width: '60px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div style={{ width: '60px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div style={{ width: '60px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="dashboard-footer-grid">
          <div className="premium-card p-6 skeleton premium-shimmer" style={{ height: '300px' }}></div>
          <div className="quick-actions-saas" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="premium-card p-6 skeleton premium-shimmer" style={{ height: '140px' }}></div>
            <div className="premium-card p-6 skeleton premium-shimmer" style={{ height: '140px' }}></div>
          </div>
        </div>

        <style jsx="true">{`
          .stats-grid-saas {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 32px;
          }
          .dashboard-main-grid {
            display: grid;
            grid-template-columns: 7fr 3fr;
            gap: 24px;
            margin-bottom: 32px;
          }
          .dashboard-footer-grid {
            display: grid;
            grid-template-columns: 7fr 3fr;
            gap: 24px;
          }
          .premium-shimmer {
            position: relative;
            overflow: hidden;
          }
          .premium-shimmer::after {
            content: '';
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.04) 20%,
              rgba(255,255,255,0.08) 60%,
              rgba(255,255,255,0) 100%
            );
            animation: premium-shimmer-anim 1.8s infinite;
          }
          @keyframes premium-shimmer-anim {
            100% { transform: translateX(100%); }
          }
          [data-theme='light'] .premium-shimmer::after {
            background: linear-gradient(
              90deg,
              rgba(47,79,63,0) 0%,
              rgba(47,79,63,0.03) 20%,
              rgba(47,79,63,0.06) 60%,
              rgba(47,79,63,0) 100%
            );
          }
          @media screen and (max-width: 1024px) {
            .stats-grid-saas { grid-template-columns: repeat(2, 1fr); }
            .dashboard-main-grid, .dashboard-footer-grid { grid-template-columns: 1fr; }
          }
          @media screen and (max-width: 600px) {
            .stats-grid-saas { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    );
  }



  const stats = [
    {
      label: 'Usuarios Totales',
      value: usuarios.length,
      trend: trendUsuarios,
      icon: Users,
      color: 'var(--ui-success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      onClick: () => { setTab('usuarios'); setUserSubTab('activos'); }
    },
    {
      label: 'Árboles Registrados',
      value: arboles.length,
      trend: trendArboles,
      icon: Trees,
      color: 'var(--ui-info)',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      onClick: () => setTab('lista')
    },
    {
      label: 'Cuentas Inactivas',
      value: usuarios.filter(u => u.status === 'baneado' || u.status === 'banned').length,
      trend: trendInactivas,
      icon: UserMinus,
      color: 'var(--ui-warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      onClick: () => { setTab('usuarios'); setUserSubTab('cancelados'); }
    },
    {
      label: 'Bajas Críticas',
      value: arboles.filter(a => a.estado === 'muerto').length,
      trend: trendBajas,
      icon: AlertCircle,
      color: 'var(--ui-error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
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
            <h2 className="text-gradient font-black" style={{ fontSize: '2.5rem', letterSpacing: '-1.5px', marginBottom: '8px' }}>
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
            <div className="stat-icon-wrapper" style={{ color: stat.color, backgroundColor: stat.bgColor }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label-saas">{stat.label}</p>
              <div className="stat-value-container">
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
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
                  data={healthData.length > 0 ? healthData : [{name: 'Sin datos', value: 1, color: '#e2e8f0'}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={healthData.length > 0 ? ({ name, percentage }) => `${name} ${percentage}%` : false}
                  labelLine={healthData.length > 0}
                >
                  {(healthData.length > 0 ? healthData : [{color: '#e2e8f0'}]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {healthData.length > 0 ? healthData.map((item, i) => (
              <div key={i} className="legend-item">
                <div className="legend-header">
                  <span className="dot" style={{ background: item.color }}></span>
                  <span className="name">{item.name}</span>
                </div>
                <span className="val">{item.value} <small style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '4px' }}>({item.percentage}%)</small></span>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, fontSize: '0.85rem', padding: '8px 0' }}>
                No hay árboles registrados aún
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incidentes Chart (Robos / Daños) */}
      <div className="premium-card chart-container p-6 mb-8">
        <div className="flex-between mb-6">
          <div>
             <h3 className="card-title-saas" style={{ color: 'var(--ui-error)' }}>Árboles Reportados (Dañados / Robados)</h3>
             <p className="text-muted text-sm mt-1">Histórico de incidentes ({filtroIncidentes === 'mes' ? 'últimos 6 meses' : filtroIncidentes === 'semana' ? 'últimas 4 semanas' : 'últimos 7 días'})</p>
          </div>
          <select 
             value={filtroIncidentes} 
             onChange={(e) => setFiltroIncidentes(e.target.value)}
             style={{
               padding: '6px 12px',
               borderRadius: '8px',
               border: '1px solid var(--glass-border)',
               background: 'transparent',
               color: 'var(--color-texto)',
               fontSize: '0.85rem',
               outline: 'none',
               cursor: 'pointer',
               fontWeight: '600'
             }}
          >
             <option value="mes">Por Meses</option>
             <option value="semana">Por Semanas</option>
             <option value="dia">Por Días</option>
          </select>
        </div>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
             <BarChart data={incidentesData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, opacity: 0.5}} />
                 <YAxis hide />
                 <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--sombra-profunda)' }} 
                   cursor={{ fill: 'rgba(239,68,68,0.05)' }} 
                 />
                 <Bar dataKey="Reportes" fill="var(--ui-error)" radius={[4,4,0,0]} barSize={40} />
             </BarChart>
          </ResponsiveContainer>
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
            {recentTrees.length > 0 ? recentTrees.map((arbol, idx) => (
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
            )) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', opacity: 0.4, gap: '8px' }}>
                <Trees size={32} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Sin actividad reciente</p>
                <p style={{ margin: 0, fontSize: '0.78rem' }}>Los árboles registrados aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions-saas">
          <div className="premium-card p-6 mb-4 meta-mensual-card">
            <Award size={32} className="mb-4 opacity-80" />
            <h4 className="font-black text-xl mb-2 meta-mensual-title">Meta Mensual</h4>
            <p className="text-sm mb-4 meta-mensual-text">Estamos a 12 registros de alcanzar el objetivo de reforestación.</p>
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
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1.5rem;
          margin-bottom: 32px;
        }
        
        .system-status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-caracola);
          color: var(--color-texto);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          box-shadow: var(--sombra-suave);
          border: 1px solid var(--glass-border);
        }

        .stats-grid-saas {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .saas-stat-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          min-height: 150px;
          border-radius: var(--radius-md);
          background: var(--color-caracola);
          border: 1px solid var(--glass-border);
          box-shadow: var(--sombra-suave);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .saas-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--sombra-profunda);
          border-color: var(--ui-primary);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stat-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label-saas {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-texto);
          opacity: 0.6;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value-container {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
        }

        .stat-value-saas {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-texto);
          margin: 0;
          letter-spacing: -0.03em;
        }

        .stat-trend {
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .stat-trend.positive {
          background: rgba(16, 185, 129, 0.1);
          color: var(--ui-success);
        }
        .stat-trend.negative {
          background: rgba(239, 68, 68, 0.1);
          color: var(--ui-error);
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 7fr 3fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .card-title-saas {
          font-size: 1.1rem;
          font-weight: 900;
          margin: 0;
          color: var(--color-texto);
        }

        .pie-legend {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
          border-top: 1px dashed var(--glass-border);
          padding-top: 16px;
        }

        .legend-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
        }

        .legend-item .legend-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-item .dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-item .name { font-weight: 600; opacity: 0.7; color: var(--color-texto); }
        .legend-item .val { font-weight: 800; font-size: 1.1rem; color: var(--color-texto); }

        .dashboard-footer-grid {
          display: grid;
          grid-template-columns: 7fr 3fr;
          gap: 24px;
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
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .activity-icon-saas {
          width: 36px;
          height: 36px;
          background: rgba(58, 90, 64, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ui-primary);
        }

        .activity-text { font-size: 0.85rem; margin: 0; color: var(--color-texto); }
        .activity-time { font-size: 0.7rem; opacity: 0.5; font-weight: 700; color: var(--color-texto); }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; }
        .bg-success { background: var(--ui-success); }
        .bg-error { background: var(--ui-error); }

        .meta-mensual-card {
          background: linear-gradient(135deg, var(--ui-primary, #0A3323), #10b981) !important;
          border: none !important;
          color: #ffffff;
        }

        .meta-mensual-card:hover {
          transform: none;
        }

        .meta-mensual-title,
        .meta-mensual-text {
          color: #ffffff;
        }

        .meta-mensual-text {
          opacity: 0.92;
        }

        .meta-mensual-card svg {
          color: #ffffff;
        }

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
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--color-texto);
        }

        .quick-link-item:hover {
          background: var(--ui-primary);
          color: #fff;
          border-color: var(--ui-primary);
          transform: translateY(-2px);
        }

        .quick-link-item span { font-size: 0.75rem; font-weight: 800; }

        @media screen and (max-width: 1024px) {
          .stats-grid-saas {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-main-grid, .dashboard-footer-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media screen and (max-width: 600px) {
          .stats-grid-saas {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumenTab;

import React from 'react';
import { Skull, RotateCcw, Calendar, Hash, Leaf } from 'lucide-react';
import '../../styles/admin/MainPagesInicoAdmin.css';

function BajasTab({ arboles, handleEditar }) {
  const bajas = arboles.filter(a => a.estado === 'muerto');

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="flex-center" style={{ width: '56px', height: '56px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--ui-error)', borderRadius: '16px' }}>
            <Skull size={32} />
          </div>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Registro de Bajas</h2>
            <p className="text-muted">Historial de ejemplares declarados como pérdida biológica</p>
          </div>
        </div>
      </div>

      {bajas.length === 0 ? (
        <div className="empty-state-large flex-center" style={{ padding: '6rem 2rem', background: 'var(--glass-bg)', borderRadius: '24px', opacity: 0.6 }}>
          <Leaf size={64} strokeWidth={1} style={{ marginBottom: '1.5rem', transform: 'rotate(180deg)' }} />
          <h3 style={{ margin: 0 }}>Sin registros de bajas</h3>
          <p className="text-muted">El ecosistema se mantiene saludable y sin pérdidas registradas</p>
        </div>
      ) : (
        <div className="admin-arboles-lista grid-auto">
          {bajas
            .sort((a,b) => new Date(b.fechaMuerto || 0) - new Date(a.fechaMuerto || 0))
            .map((arbol, idx) => (
            <div 
              key={arbol.id} 
              className="premium-card fade-in" 
              style={{ animationDelay: `${idx * 0.05}s`, display: 'flex', flexDirection: 'column' }}
            >
               <div className="card-image-wrapper" style={{ height: '160px', position: 'relative', opacity: 0.6, filter: 'grayscale(1)' }}>
                  {arbol.imagenUrl ? (
                     <img src={arbol.imagenUrl} alt={arbol.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="flex-center" style={{ width: '100%', height: '100%', background: '#eee' }}>
                      <Skull size={48} opacity={0.2} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--ui-error)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800 }}>
                    BAJA
                  </div>
               </div>

               <div className="card-body" style={{ padding: '1.5rem', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{arbol.nombre}</h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Hash size={14} /> ID: {arbol.id} • {arbol.tipo?.toUpperCase() || 'GENERAL'}
                  </p>

                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ui-error)', opacity: 0.8 }}>FECHA DE DECLARACIÓN</span>
                      <Calendar size={14} color="var(--ui-error)" opacity={0.5} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--ui-error)' }}>
                       {arbol.fechaMuerto ? arbol.fechaMuerto.split('-').reverse().join('/') : 'Sin fecha registrada'}
                    </p>
                  </div>

                  <button 
                     className="ui-btn ui-btn--ghost" 
                     onClick={() => handleEditar(arbol)}
                     style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                  >
                     <RotateCcw size={16} style={{ marginRight: '8px' }} /> Restaurar / Editar
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BajasTab;

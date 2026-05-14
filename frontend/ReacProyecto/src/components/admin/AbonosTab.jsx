import React, { useState } from 'react';
import { ImageUploadField } from '../common';
import { Package, Plus, Edit3, Trash2, Box, Info, X } from 'lucide-react';
import '../../styles/admin/MainPagesInicoAdmin.css';

function AbonosTab({
  modoEdicionAbono,
  handleAbonoSubmit,
  formAbono,
  setFormAbono,
  resetFormAbono,
  abonos,
  handleEditarAbono,
  handleEliminarAbono
}) {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    if (modoEdicionAbono) {
      resetFormAbono();
    }
    setShowForm(!showForm);
  };

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="flex-center" style={{ width: '56px', height: '56px', background: 'rgba(58, 90, 64, 0.1)', color: 'var(--ui-primary)', borderRadius: '16px' }}>
              <Package size={32} />
            </div>
            <div>
              <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Inventario de Insumos</h2>
              <p className="text-muted">Control de abonos, fertilizantes y recursos del ecosistema</p>
            </div>
          </div>
          <button 
            className={`ui-btn ${showForm || modoEdicionAbono ? 'ui-btn--ghost' : 'ui-btn--primary'}`}
            onClick={handleToggleForm}
            style={{ borderRadius: '12px' }}
          >
            {showForm || modoEdicionAbono ? (
              <><X size={18} style={{ marginRight: '8px' }} /> Cancelar</>
            ) : (
              <><Plus size={18} style={{ marginRight: '8px' }} /> Nuevo Producto</>
            )}
          </button>
        </div>
      </div>

      {(showForm || modoEdicionAbono) && (
        <div className="premium-card fade-in" style={{ padding: '2rem', marginBottom: '2.5rem', border: '2px solid var(--ui-primary-bg)' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
            {modoEdicionAbono ? 'Actualizar Existencias' : 'Registrar Insumo'}
          </h3>
          <form onSubmit={(e) => { e.preventDefault(); handleAbonoSubmit(e); !modoEdicionAbono && setShowForm(false); }} className="admin-grid-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="ui-field">
              <label>Nombre del Producto</label>
              <input
                type="text"
                className="ui-input"
                required
                value={formAbono.nombre}
                onChange={(e) => setFormAbono({...formAbono, nombre: e.target.value})}
                placeholder="Ej: Compost Orgánico"
              />
            </div>
            <div className="ui-field">
              <label>Cantidad en Stock</label>
              <input
                type="number"
                className="ui-input"
                required
                min="0"
                value={formAbono.stock}
                onChange={(e) => setFormAbono({...formAbono, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="ui-field">
              <label>Unidad de Medida</label>
              <input
                type="text"
                className="ui-input"
                required
                value={formAbono.unidad}
                onChange={(e) => setFormAbono({...formAbono, unidad: e.target.value})}
                placeholder="kg, L, sacos..."
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUploadField 
                label="Imagen del Insumo" 
                value={formAbono.imagenUrl || ''} 
                onChange={(url) => setFormAbono({...formAbono, imagenUrl: url})} 
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
               <button type="submit" className="ui-btn ui-btn--primary" style={{ padding: '12px 32px' }}>
                 {modoEdicionAbono ? 'Guardar Cambios' : 'Registrar Producto'}
               </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-arboles-lista grid-auto">
        {abonos.map((abono, idx) => (
          <div key={abono.id} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.05}s`, display: 'flex', flexDirection: 'column' }}>
            <div className="card-image-wrapper" style={{ height: '180px', background: 'var(--ui-primary-bg)' }}>
              {abono.imagenUrl ? (
                <img 
                  src={abono.imagenUrl} 
                  alt={abono.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="flex-center" style={{ width: '100%', height: '100%', opacity: 0.2 }}>
                  <Box size={64} />
                </div>
              )}
              {abono.stock < 5 && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--ui-error)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800 }}>
                  STOCK BAJO
                </div>
              )}
            </div>
            
            <div className="card-body" style={{ padding: '1.5rem', flexGrow: 1 }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800 }}>{abono.nombre}</h4>
              
              <div style={{ background: 'var(--glass-bg)', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
                <div className="flex-between">
                   <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5 }}>DISPONIBILIDAD</div>
                   <Info size={14} className="text-muted" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: abono.stock < 5 ? 'var(--ui-error)' : 'var(--ui-primary)' }}>{abono.stock}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.6 }}>{abono.unidad}</span>
                </div>
              </div>

              <div className="flex-center" style={{ gap: '10px' }}>
                <button 
                  onClick={() => { handleEditarAbono(abono); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                  className="ui-btn ui-btn--ghost" 
                  style={{ flex: 1, padding: '8px' }}
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleEliminarAbono(abono.id, abono.nombre)} 
                  className="ui-btn ui-btn--danger-outline" 
                  style={{ flex: 1, padding: '8px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {abonos.length === 0 && (
          <div className="flex-center" style={{ gridColumn: '1 / -1', padding: '6rem 2rem', opacity: 0.4, flexDirection: 'column' }}>
            <Box size={64} strokeWidth={1} style={{ marginBottom: '1.5rem' }} />
            <p style={{ fontWeight: 600 }}>El inventario está vacío actualmente.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AbonosTab;

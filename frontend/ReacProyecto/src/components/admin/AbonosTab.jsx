import React from 'react';
import ImageUploadField from '../ImageUploadField';
import '../../styles/MainPagesInicoAdmin.css';

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
  return (
    <div className="admin-abonos-container">
      <div className="admin-section-header">
        <h2>Gestión de Abonos y Fertilizantes</h2>
        <p>Control de inventario y reposición de insumos</p>
      </div>


      <div className="admin-abono-form-card">
        <h3>{modoEdicionAbono ? 'Reponer / Editar Stock' : 'Registrar Nuevo Producto'}</h3>
        <form onSubmit={handleAbonoSubmit} className="admin-abono-form">
          <div className="admin-form-group">
            <label>Nombre del Producto</label>
            <input
              type="text"
              required
              value={formAbono.nombre}
              onChange={(e) => setFormAbono({...formAbono, nombre: e.target.value})}
              placeholder="Ej: Compost Orgánico"
            />
          </div>
          <div className="admin-form-group">
            <label>Cantidad en Stock</label>
            <input
              type="number"
              required
              min="0"
              value={formAbono.stock}
              onChange={(e) => setFormAbono({...formAbono, stock: e.target.value})}
              className="admin-input-no-spinner"
              placeholder="Ingresa cantidad..."
            />
          </div>
          <div className="admin-form-group">
            <label>Unidad (kg, L, sacos...)</label>
            <input
              type="text"
              required
              value={formAbono.unidad}
              onChange={(e) => setFormAbono({...formAbono, unidad: e.target.value})}
              placeholder="Ej: kg"
            />
          </div>
          <ImageUploadField 
            label="Foto del Producto" 
            value={formAbono.imagenUrl || ''} 
            onChange={(url) => setFormAbono({...formAbono, imagenUrl: url})} 
            placeholder="Subir foto del abono"
          />
          <div className="admin-abono-form-actions">
            <button type="submit" className="admin-btn-save-abono">
              {modoEdicionAbono ? 'Guardar Inventario' : 'Agregar al Sistema'}
            </button>
            {modoEdicionAbono && (
              <button type="button" onClick={resetFormAbono} className="admin-btn-cancel-abono">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-abonos-grid">
        {abonos.map(abono => (
          <div key={abono.id} className="admin-abono-stat-card">
            <div className="admin-abono-card-body">
              <div className="admin-abono-icon">
                {abono.imagenUrl && (
                  <img 
                    src={abono.imagenUrl} 
                    alt={abono.nombre} 
                    className="admin-abono-img-preview" 
                    onError={(e) => e.target.classList.add('error')} 
                  />
                )}
                <span></span>
              </div>
              <div className="admin-abono-info">
                <h4>{abono.nombre}</h4>
                <div className="admin-abono-stock-badge">
                  <span className="stock-number">{abono.stock}</span>
                  <span className="stock-unit">{abono.unidad} disponibles</span>
                </div>
              </div>
            </div>
            <div className="admin-abono-card-footer">
              <button onClick={() => handleEditarAbono(abono)} className="btn-edit-stock">Editar Stock</button>
              <button onClick={() => handleEliminarAbono(abono.id, abono.nombre)} className="btn-delete-abono">Eliminar</button>
            </div>
          </div>
        ))}
        {abonos.length === 0 && <p className="admin-no-data">No hay productos registrados en el inventario.</p>}

      </div>
    </div>
  );
}

export default AbonosTab;

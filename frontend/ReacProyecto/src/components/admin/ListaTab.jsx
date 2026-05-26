import React from 'react';
import '../../styles/admin/MainPagesInicoAdmin.css';
import ArbolFormTab from './ArbolFormTab';
import { SkeletonCardGrid, Pagination } from '../ui';
import { usePagination } from '../../hooks/usePagination';
import { Search, Plus, Filter, Edit3, Droplets, Trash2, XCircle, Skull } from 'lucide-react';

function ListaTab({
  busqueda,
  setBusqueda,
  tipoFiltro,
  setTipoFiltro,
  tiposDisponibles,
  setTab,
  handleEliminarTipo,
  statsTipos,
  handleUpdateStatTipo,
  arboles,
  cargando,
  handleEditar,
  handleAbonarArbol,
  handleEliminar,
  handleLimpiarHistorialAbono,
  modoEdicion,
  handleSubmit,
  form,
  handleChange,
  modoNuevoTipo,
  setModoNuevoTipo,
  setForm,
  resetForm,
  isSubmitting = false,
  onSaveArbolImage
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    if (modoEdicion) {
      setShowAddForm(true);
    }
  }, [modoEdicion]);

  const arbolesFiltrados = (arboles || []).filter(Boolean)
    .filter(a => {
      const searchLower = busqueda.toLowerCase();
      const matchesSearch = (a.nombre || '').toLowerCase().includes(searchLower) || 
                          (a.tipo || '').toLowerCase().includes(searchLower) ||
                          (a.estado || '').toLowerCase().includes(searchLower) ||
                          (a.descripcion || '').toLowerCase().includes(searchLower) ||
                          (a.cuidados || '').toLowerCase().includes(searchLower);
      const matchesType = !tipoFiltro || (a.tipo || '').toLowerCase() === tipoFiltro.toLowerCase();
      
      if (a.estado === 'muerto' && !searchLower) return false;

      return matchesSearch && matchesType;
    });

  const {
    currentPage,
    currentItems,
    totalPages,
    paginate,
    totalItems,
    itemsPerPage,
    changeItemsPerPage
  } = usePagination(arbolesFiltrados, 6);

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>Catálogo de Especies</h2>
            <p className="text-muted">Gestión centralizada del patrimonio biológico</p>
          </div>
          
          {!showAddForm && (
            <button 
              className="ui-btn ui-btn--primary" 
              onClick={() => {
                setShowAddForm(true);
                resetForm();
              }}
              style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Plus size={20} /> Nueva Especie
            </button>
          )}
        </div>

        {!showAddForm ? (
          <div className="admin-controls-row" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="admin-search-container" style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={18} className="search-icon" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, tipo, estado o detalles..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="ui-input"
                style={{ paddingLeft: '45px', width: '100%', borderRadius: '12px' }}
              />
            </div>

            <div className="filter-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Filter size={18} style={{ opacity: 0.6 }} />
              <select 
                value={tipoFiltro} 
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="ui-input"
                style={{ borderRadius: '12px', minWidth: '200px' }}
              >
                <option value="">Todas las categorías</option>
                {tiposDisponibles.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="form-header-row flex-between" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
             <p className="text-muted" style={{ fontWeight: 600 }}>
               {modoEdicion ? 'Actualizando datos del espécimen' : 'Ingresando nueva especie al sistema'}
             </p>
             <button 
               className="ui-btn ui-btn--ghost" 
               onClick={() => {
                 setShowAddForm(false);
                 resetForm();
               }}
               style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
             >
               <XCircle size={18} /> Cancelar y volver
             </button>
          </div>
        )}

        {showAddForm && (
           <div className="form-container-reveal" style={{ marginTop: '1rem' }}>
             <ArbolFormTab
               modoEdicion={modoEdicion}
               handleSubmit={async (e) => {
                 // Awaitar correctamente para no cerrar el form antes de que termine
                 const exitoso = await handleSubmit(e);
                 // Solo cerramos el formulario si el guardado fue exitoso
                 if (exitoso) {
                   setShowAddForm(false);
                 }
               }}
               form={form}
               handleChange={handleChange}
               modoNuevoTipo={modoNuevoTipo}
               tiposDisponibles={tiposDisponibles}
               setModoNuevoTipo={setModoNuevoTipo}
               setForm={setForm}
               resetForm={() => {
                 resetForm();
                 setShowAddForm(false);
               }}
               setTab={setTab}
               isSubmitting={isSubmitting}
               onImageUpload={modoEdicion ? onSaveArbolImage : undefined}
             />
           </div>
        )}

        {/* Panel de Seguimiento Moderno */}
        {!showAddForm && tipoFiltro && (
          <div className="admin-tracking-panel premium-card fade-in" style={{ marginTop: '2rem', background: 'rgba(58, 90, 64, 0.05)', border: '1px dashed var(--ui-primary)' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Edit3 size={20} color="var(--ui-primary)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Métricas: {tipoFiltro.toUpperCase()}</h3>
              </div>
              <button 
                onClick={() => handleEliminarTipo(tipoFiltro)}
                className="ui-btn ui-btn--danger"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Eliminar Categoría
              </button>
            </div>
            
            <div className="admin-tracking-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
              <div className="stat-input-group">
                <label className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>PLANIFICADOS</label>
                <input 
                  type="number" 
                  value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.planificados || 0}
                  onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'planificados', e.target.value)}
                  className="ui-input"
                  style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800 }}
                />
              </div>
              <div className="stat-input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--ui-error)' }}>BAJAS (MUERTOS)</label>
                <input 
                  type="number" 
                  value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.muertos || 0}
                  onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'muertos', e.target.value)}
                  className="ui-input"
                  style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800, borderColor: 'var(--ui-error)' }}
                />
              </div>
              <div className="stat-input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--ui-success)' }}>ACTIVOS (VIVOS)</label>
                <div className="ui-input flex-center" style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--ui-success)', border: 'none' }}>
                  {arboles.filter(a => (a.tipo || 'Sin clasificar').toLowerCase() === tipoFiltro.toLowerCase() && a.estado !== 'muerto').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!showAddForm && (
        <div className="catalog-render-area">
          {cargando ? (
            <SkeletonCardGrid count={6} />
          ) : arbolesFiltrados.length === 0 ? (
            <div className="empty-state-large flex-center" style={{ padding: '6rem 2rem', background: 'var(--glass-bg)', borderRadius: '24px', opacity: 0.6 }}>
              <XCircle size={64} strokeWidth={1} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ margin: 0 }}>Sin resultados encontrados</h3>
              <p className="text-muted">Intenta ajustar tus filtros o buscar otro término</p>
            </div>
          ) : (
            <>
              <div className="admin-arboles-lista grid-auto">
                {currentItems.map((arbol, idx) => (
                    <div 
                      key={arbol.id} 
                      className="premium-card arbol-card fade-in"
                      style={{ animationDelay: `${idx * 0.05}s`, display: 'flex', flexDirection: 'column' }}
                    >
                      <div className="card-image-wrapper" style={{ height: '200px', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <img
                          src={arbol.imagenUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={arbol.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          className="hover-zoom"
                        />
                        <div className="card-badge-type" style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}>
                          {arbol.tipo?.toUpperCase() || 'GENERAL'}
                        </div>
                      </div>

                      <div className="card-body" style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{arbol.nombre}</h4>
                        <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '12px' }}>
                          {arbol.nombreCientifico || '—'}
                        </p>
                        
                        <div className="card-meta flex-between" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-tierra-sombra)', opacity: 0.8, marginBottom: '1rem' }}>
                          <span>H: {arbol.altura || 'N/A'}</span>
                          <span>{arbol.clima || 'N/A'}</span>
                        </div>

                        {/* Info de Abono Premium */}
                        <div className="abono-status-section" style={{ background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '10px', marginBottom: '1.5rem' }}>
                          <div className="flex-between" style={{ marginBottom: '4px' }}>
                             <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>ESTADO NUTRICIONAL</span>
                             <span className={`status-dot ${arbol.historialAbono?.length > 0 ? 'active' : ''}`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: arbol.historialAbono?.length > 0 ? 'var(--ui-success)' : 'var(--ui-warning)' }}></span>
                          </div>
                          <div className="flex-between">
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{arbol.historialAbono?.length || 0} Aplicaciones</span>
                            {arbol.historialAbono?.length > 0 && (
                              <button 
                                className="icon-btn-small"
                                onClick={() => handleLimpiarHistorialAbono(arbol)}
                                title="Reset historial"
                                style={{ background: 'none', border: 'none', color: 'var(--ui-error)', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          {arbol.historialAbono?.length > 0 && (
                            <p className="text-muted" style={{ fontSize: '0.7rem', margin: '4px 0 0' }}>
                              Última: {arbol.historialAbono[arbol.historialAbono.length - 1].fecha.split('-').reverse().join('/')}
                            </p>
                          )}
                        </div>

                        <div className="card-actions" style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <button
                            className="ui-btn ui-btn--primary"
                            onClick={() => {
                              handleEditar(arbol);
                              setShowAddForm(true);
                            }}
                            style={{ fontSize: '0.8rem', padding: '10px' }}
                          >
                            <Edit3 size={14} style={{ marginRight: '6px' }} /> Editar
                          </button>
                          <button
                            className="ui-btn ui-btn--secondary"
                            onClick={() => handleAbonarArbol(arbol)}
                            style={{ fontSize: '0.8rem', padding: '10px' }}
                          >
                            <Droplets size={14} style={{ marginRight: '6px' }} /> Abonar
                          </button>
                          <button
                            className="ui-btn ui-btn--danger"
                            onClick={() => handleEliminar(arbol)}
                            style={{ gridColumn: 'span 2', fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <Skull size={14} /> Dar de Baja
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={changeItemsPerPage}
                  />
                </div>

              </>
            )}
        </div>
      )}
    </div>
  );
}

export default ListaTab;

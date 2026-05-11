import React from 'react';
import '../../styles/MainPagesInicoAdmin.css';
import '../../styles/Arboles.css';
import ArbolFormTab from './ArbolFormTab';

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
  resetForm
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Si estamos en modo edición, queremos forzar que el formulario se vea
  React.useEffect(() => {
    if (modoEdicion) {
      setShowAddForm(true);
    }
  }, [modoEdicion]);

  return (
    <div className="admin-tab-content-wrapper">
      <div className="admin-section-header admin-section-header-flex">
        {!showAddForm ? (
          <div className="admin-header-row">
            <div>
              <h2 className="admin-section-title-white">Catálogo de Especies</h2>
              <p className="admin-section-subtitle-green">Gestiona la base de datos de árboles y vegetación</p>
            </div>
            <div className="admin-controls-row">
              <div className="admin-search-box">
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <select 
                value={tipoFiltro} 
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="admin-filter-select"
              >
                <option value="">Todos los Tipos</option>
                {tiposDisponibles.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                ))}
              </select>

              <button 
                className="admin-add-btn" 
                onClick={() => {
                  setShowAddForm(true);
                  resetForm();
                }}
              >
                Nueva Especie
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-header-row">
             <div>
               <h2 className="admin-section-title-white">
                 {modoEdicion ? 'Editando Especie' : 'Registrar Nueva Especie'}
               </h2>
               <p className="admin-section-subtitle-green">Panel de configuración biológica en vivo</p>
             </div>
             <button 
               className="admin-btn-cancelar-simple" 
               onClick={() => {
                 setShowAddForm(false);
                 resetForm();
               }}
             >
               Volver al Catálogo
             </button>
          </div>
        )}

        {showAddForm && (
           <div style={{ width: '100%', marginTop: '2rem', animation: 'fadeIn 0.3s ease' }}>
             <ArbolFormTab 
               modoEdicion={modoEdicion}
               handleSubmit={(e) => {
                 handleSubmit(e);
                 setShowAddForm(false);
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
             />
           </div>
        )}

        {/* Estadísticas rápidas por tipo (Solo si no hay formulario abierto y hay un tipo seleccionado) */}
        {!showAddForm && tipoFiltro && (
          <div className="admin-tracking-panel">
            <div className="admin-tracking-header">
              <h3>Seguimiento: "{tipoFiltro.toUpperCase()}"</h3>
              <button 
                onClick={() => handleEliminarTipo(tipoFiltro)}
                className="admin-btn-delete-type"
              >
                Eliminar Tipo
              </button>
            </div>
            
            <div className="admin-tracking-stats">
              <div className="admin-form-group admin-form-group-no-margin">
                <label className="admin-tracking-label-plan">Planificados</label>
                <input 
                  type="number" 
                  value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.planificados || 0}
                  onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'planificados', e.target.value)}
                  className="admin-tracking-input"
                />
              </div>
              <div className="admin-form-group admin-form-group-no-margin">
                <label className="admin-tracking-label-dead">Bajas de este tipo</label>
                <input 
                  type="number" 
                  value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.muertos || 0}
                  onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'muertos', e.target.value)}
                  className="admin-tracking-input"
                />
              </div>
              <div className="admin-form-group admin-form-group-no-margin admin-opacity-muted">
                <label className="admin-tracking-label-alive">Vivos en sistema</label>
                <input 
                  type="text" 
                  disabled
                  value={arboles.filter(a => (a.tipo || 'Sin clasificar').toLowerCase() === tipoFiltro.toLowerCase() && a.estado !== 'muerto').length}
                  className="admin-tracking-input-disabled"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {!showAddForm && (
        <>
          {cargando ? (
            <div className="admin-loading-msg">
              Cargando árboles...
            </div>
          ) : arboles.filter(a => a.estado !== 'muerto').length === 0 ? (
            <div className="admin-empty-msg">
              <div className="admin-empty-icon"></div>
              <p>No hay árboles activos registrados. ¡Agrega el primero!</p>
            </div>
          ) : (
            <>
              {arboles
                .filter(a => a.estado !== 'muerto')
                .filter(a => {
                  const matchesSearch = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                      (a.tipo || '').toLowerCase().includes(busqueda.toLowerCase());
                  const matchesType = !tipoFiltro || (a.tipo || '').toLowerCase() === tipoFiltro.toLowerCase();
                  return matchesSearch && matchesType;
                }).length === 0 ? (
                <div className="admin-no-results">
                  <p>No se encontraron árboles con los filtros aplicados.</p>
                </div>
              ) : (
                <div className="admin-arboles-lista">
                  {arboles
                    .filter(a => a.estado !== 'muerto')
                    .filter(a => {
                      const matchesSearch = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                          (a.tipo || '').toLowerCase().includes(busqueda.toLowerCase());
                      const matchesType = !tipoFiltro || (a.tipo || '').toLowerCase() === tipoFiltro.toLowerCase();
                      return matchesSearch && matchesType;
                    })
                    .map((arbol) => (
                    <div key={arbol.id} className="admin-arbol-card">
                      {arbol.imagenUrl && (
                        <img
                          src={arbol.imagenUrl}
                          alt={arbol.nombre}
                          className="admin-arbol-card-img"
                          onError={(e) => e.target.classList.add('error')}
                        />
                      )}
                      <div className="admin-arbol-card-img-placeholder">
                         
                      </div>

                      <div className="admin-arbol-card-body">
                        <p className="admin-arbol-card-nombre">{arbol.nombre}</p>
                        <p className="admin-arbol-card-cientifico">
                          {arbol.nombreCientifico || '—'}
                        </p>
                        <p className="admin-card-clima-altura">
                          {arbol.clima ? arbol.clima : ''}{' '}
                          {arbol.altura ? `• ${arbol.altura}` : ''}
                        </p>

                        {/* Info de Abono */}
                        <div className="admin-arbol-status-abono">
                          <div className="admin-abono-count-wrap">
                             <span className="admin-abono-badge">
                               {arbol.historialAbono?.length || 0} Abonos
                             </span>
                             {arbol.historialAbono?.length > 0 && (
                               <button 
                                 className="admin-btn-clear-history"
                                 onClick={() => handleLimpiarHistorialAbono(arbol)}
                                 title="Limpiar historial de abonos"
                               >
                                 ×
                               </button>
                             )}
                          </div>
                          {arbol.historialAbono?.length > 0 && (
                            <p className="admin-abono-last-date">
                              {arbol.historialAbono[arbol.historialAbono.length - 1].fecha.split('-').reverse().join('/')}
                              {arbol.historialAbono[arbol.historialAbono.length - 1].hora && ` - ${arbol.historialAbono[arbol.historialAbono.length - 1].hora}`}
                            </p>
                          )}
                        </div>

                        <div className="admin-arbol-card-actions">
                          <button
                            className="admin-btn-editar"
                            onClick={() => {
                              handleEditar(arbol);
                              setShowAddForm(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="admin-btn-abonar"
                            onClick={() => handleAbonarArbol(arbol)}
                            title="Aplicar abono/fertilizante"
                          >
                            Abonar
                          </button>
                          <button
                            className="admin-btn-eliminar"
                            onClick={() => handleEliminar(arbol)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ListaTab;

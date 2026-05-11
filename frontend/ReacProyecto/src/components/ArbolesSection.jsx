import React, { useState, useEffect } from 'react';
import services from '../services/services';
import '../styles/Arboles.css';
import '../styles/PremiumDashboard.css';

// ── Modal con toda la información del árbol ──────────────────────────────────
function ArbolModal({ arbol, onClose }) {
  const [imgError, setImgError] = useState(false);
  if (!arbol) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-cerrar" 
          onClick={onClose} 
          title="Cerrar"
        >✕</button>

        {arbol.imagenUrl && !imgError ? (
          <img
            src={arbol.imagenUrl}
            alt={arbol.nombre}
            className="modal-img"
            onError={() => setImgError(true)}
          />

        ) : (
          <div className="modal-img-placeholder">
           
          </div>
        )}


        <div className="modal-body">
          <h2 className="modal-nombre">{arbol.nombre}</h2>
          <p className="modal-cientifico">
            {arbol.nombreCientifico || 'Nombre científico no disponible'}
          </p>

          <div className="modal-info-grid">
            {[
                { label: 'Familia', value: arbol.familia },
                { label: 'Altura', value: arbol.altura },
                { label: 'Crecimiento', value: arbol.crecimiento },
                { label: 'Clima', value: arbol.clima },
                { label: 'Registrado', value: arbol.fechaRegistro },
                { label: 'Estado', value: arbol.estado }
            ].map((item, idx) => item.value ? (
              <div className="modal-info-item" key={idx}>
                <div className="modal-info-label">{item.label}</div>
                <div className="modal-info-value">{item.value}</div>
              </div>
            ) : null)}
          </div>

          {arbol.descripcion && (
            <div className="modal-section">
              <h3 className="modal-section-title">Descripción</h3>
              <p className="modal-section-text">{arbol.descripcion}</p>
            </div>
          )}

          {arbol.cuidados && (

            <div className="modal-section">
              <h3 className="modal-section-title">Cuidados</h3>

              <p className="modal-section-text">{arbol.cuidados}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tarjeta individual de árbol ───────────────────────────────────────────────
function ArbolCard({ arbol, count, onClick }) {
  const [imgError, setImgError] = useState(false);
  const titulo = count !== undefined ? (arbol.tipo || 'Sin clasificar') : arbol.nombre;

  return (
    <div className="arbol-card" onClick={() => onClick(arbol)}>
      {arbol.imagenUrl && !imgError ? (
        <img
          src={arbol.imagenUrl}
          alt={titulo}
          className="arbol-card-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="arbol-card-img-placeholder">
          
          <span>Sin imagen</span>
        </div>
      )}

      <div className="arbol-card-body">
        <h3 className="arbol-card-nombre">{titulo}</h3>
        {arbol.nombreCientifico && (
          <p className="arbol-card-cientifico">{arbol.nombreCientifico}</p>
        )}
        
        {count !== undefined ? (
          <div className="arbol-card-badge-container">
            <span className="arbol-card-badge dark">
              <strong>{count}</strong> Registrados
            </span>
          </div>
        ) : (
          <div className="arbol-card-badge-container">
            <span className="arbol-card-badge">{arbol.estado || 'Registrado'}</span>
          </div>
        )}
        

        <p className="arbol-card-hint">CLICK PARA DETALLES</p>

      </div>
    </div> 
  );
}

// ── Sección completa de tarjetas (usada en User y Visitante) ──────────────────
function ArbolesSection({ arboles, viewMode = 'individual' }) {
  const [arbolSeleccionado, setArbolSeleccionado] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    services.getStatsTipos().then(res => setStats(res || []));
  }, []);

  // Si el modo es individual, pasamos la lista tal cual.
  // Si el modo es especies, agrupamos por tipo.
  const displayList = arboles && arboles.length > 0 ? (
    viewMode === 'individual' 
      ? arboles.map(a => ({ ...a, isIndividual: true }))
      : Object.values(arboles.reduce((acc, arbol) => {
          const tipo = (arbol.tipo || 'Sin clasificar').toLowerCase();
          const isAlive = arbol.estado !== 'muerto';

          if (!acc[tipo]) {
            const statDelTipo = stats.find(s => s.tipo.toLowerCase() === tipo);
            acc[tipo] = {
              tipo,
              count: 0,
              representante: { ...arbol, stats: statDelTipo },
            };
          }
          
          if (isAlive) {
            acc[tipo].count += 1;
          }
          
          return acc;
        }, {}))
  ) : [];

  return (
    <section className="arboles-section">

      <div className="arboles-section-header">
        <h2 className="arboles-section-title">
          {viewMode === 'individual' ? 'Inventario de Árboles' : 'Especies Registradas'}
        </h2>
        <p className="arboles-section-subtitle">


          {viewMode === 'individual' 
            ? 'Listado detallado de cada ejemplar plantado en el corredor.' 
            : 'Explora la diversidad forestal por tipo de especie.'}

        </p>
      </div>

      {displayList.length > 0 ? (
        <div className="arboles-grid">
          {displayList.map((item, idx) => (
            <ArbolCard
              key={item.id || item.tipo || idx}
              arbol={item.isIndividual ? item : item.representante}
              count={item.isIndividual ? undefined : item.count}
              onClick={setArbolSeleccionado}
            />
          ))}
        </div>
      ) : (

        <div className="arboles-empty">
          <div className="tree-icon"></div>
          <p>Aún no hay especies registradas en el sistema.</p>
        </div>
      )}

      {arbolSeleccionado && (
        <ArbolModal
          arbol={arbolSeleccionado}
          onClose={() => setArbolSeleccionado(null)}
        />
      )}
    </section>
  );
}

export { ArbolesSection, ArbolCard, ArbolModal };
export default ArbolesSection;

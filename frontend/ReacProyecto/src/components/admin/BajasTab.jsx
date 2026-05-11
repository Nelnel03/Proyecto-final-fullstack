import React from 'react';
import '../../styles/MainPagesInicoAdmin.css';

function BajasTab({ arboles, handleEditar }) {
  const bajas = arboles.filter(a => a.estado === 'muerto');

  return (
    <div>
      <div className="admin-section-header">
        <h2>Registro de Bajas</h2>
        <p>Historial de piezas forestales declaradas como pérdida</p>
      </div>

      {bajas.length === 0 ? (
        <div className="admin-empty-msg">
          <div className="admin-empty-icon"></div>
          <p>No hay registros de bajas en el sistema.</p>
        </div>
      ) : (
        <div className="admin-arboles-lista admin-arboles-lista-vertical">
          {bajas
            .sort((a,b) => new Date(b.fechaMuerto || 0) - new Date(a.fechaMuerto || 0))
            .map((arbol) => (
            <div key={arbol.id} className="admin-arbol-card admin-baja-card">
               <div className="admin-baja-img-wrap">
                  {arbol.imagenUrl ? (
                     <img src={arbol.imagenUrl} alt={arbol.nombre} className="admin-baja-img" />
                  ) : <div className="admin-baja-placeholder"></div>}
               </div>
               <div className="admin-baja-info">
                  <h3 className="admin-baja-title">{arbol.nombre}</h3>
                  <p className="admin-baja-type">
                     Especie: {arbol.tipo || 'mimbro'}
                  </p>
                  <p className="admin-baja-id">
                     ID: #{arbol.id}
                  </p>
               </div>
               <div className="admin-baja-date-wrap">
                  <p className="admin-baja-date-label">Fecha de Defunción</p>
                  <p className="admin-baja-date-value">
                     {arbol.fechaMuerto ? arbol.fechaMuerto.split('-').reverse().join('/') : 'Sin fecha'}
                  </p>
               </div>
               <div className="admin-flex-row-gap">
                  <button 
                     className="admin-edit-btn admin-btn-small" 
                     onClick={() => handleEditar(arbol)}
                  >
                     Restaurar/Editar
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

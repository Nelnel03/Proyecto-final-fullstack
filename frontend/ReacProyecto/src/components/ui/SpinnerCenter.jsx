/**
 * @file SpinnerCenter.jsx
 * @description Spinner centrado para usarse a nivel de página o sección.
 * Reemplaza pantallas vacías cuando una vista está cargando sus datos iniciales.
 */
import React from 'react';
import Spinner from './Spinner';
import './Spinner.css';

/**
 * @param {Object} props
 * @param {string} props.label   Texto descriptivo debajo del spinner (opcional).
 * @param {'md'|'lg'|'xl'} props.size Tamaño del spinner.
 * @param {string} props.minHeight Altura mínima del contenedor (default '200px').
 */
function SpinnerCenter({ label = 'Cargando...', size = 'lg', minHeight = '200px' }) {
  return (
    <div className="spinner-center" style={{ minHeight }}>
      <Spinner size={size} />
      {label && <p className="spinner-center__label">{label}</p>}
    </div>
  );
}

export default SpinnerCenter;

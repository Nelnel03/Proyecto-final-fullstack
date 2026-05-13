/**
 * @file Spinner.jsx
 * @description Spinner SVG reutilizable con variantes de tamaño y color.
 * Compatible con el sistema de variables CSS del proyecto.
 */
import React from 'react';
import './Spinner.css';

/**
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'} props.size   Tamaño del spinner.
 * @param {string}               props.color  Color CSS (default: color-bosque-musgo).
 * @param {string}               props.className Clases adicionales.
 */
function Spinner({ size = 'md', color, className = '', style = {} }) {
  return (
    <span
      className={`spinner spinner--${size} ${className}`}
      role="status"
      aria-label="Cargando..."
      style={color ? { '--spinner-color': color, ...style } : style}
    >
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <circle
          className="spinner__track"
          cx="25" cy="25" r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="spinner__arc"
          cx="25" cy="25" r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default Spinner;

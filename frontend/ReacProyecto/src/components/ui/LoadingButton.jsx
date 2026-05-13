/**
 * @file LoadingButton.jsx
 * @description Botón reutilizable que se deshabilita automáticamente durante
 * operaciones async, muestra un spinner interno y cambia su texto dinámicamente.
 */
import React from 'react';
import Spinner from './Spinner';
import './LoadingButton.css';

/**
 * @param {Object}  props
 * @param {boolean} props.loading       Si true, muestra spinner y deshabilita el botón.
 * @param {string}  props.loadingText   Texto durante la carga (ej: "Guardando…").
 * @param {string}  props.children      Texto normal del botón.
 * @param {string}  props.variant       'primary' | 'secondary' | 'danger' | 'outline'
 * @param {string}  props.size          'sm' | 'md' | 'lg'
 * @param {string}  props.type          Tipo de botón HTML.
 * @param {string}  props.className     Clases adicionales.
 * @param {Function} props.onClick      Handler de click.
 */
function LoadingButton({
  loading = false,
  loadingText,
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  disabled,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`loading-btn loading-btn--${variant} loading-btn--${size} ${loading ? 'loading-btn--loading' : ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <Spinner
          size="sm"
          color="currentColor"
          className="loading-btn__spinner"
        />
      )}
      <span className="loading-btn__text">
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  );
}

export default LoadingButton;

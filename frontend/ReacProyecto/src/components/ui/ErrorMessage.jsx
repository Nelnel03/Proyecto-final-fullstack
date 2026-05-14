/**
 * @file ErrorMessage.jsx
 * @description Componente accesible para mostrar errores debajo de campos de formulario.
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorMessage.css';

/**
 * @param {Object} props
 * @param {string|Array} props.error Error string or array of errors for the field.
 * @param {string} props.id ID for aria-describedby binding.
 */
function ErrorMessage({ error, id }) {
  if (!error) return null;

  // Si el backend envía un array de errores para este campo, los unimos o mostramos el primero
  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className="form-error-message" id={id} role="alert">
      <AlertCircle size={14} className="form-error-icon" />
      <span>{errorMessage}</span>
    </div>
  );
}

export default ErrorMessage;

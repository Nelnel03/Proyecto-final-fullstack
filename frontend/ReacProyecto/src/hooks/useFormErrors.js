/**
 * @file useFormErrors.js
 * @description Hook para manejar el estado de errores en formularios.
 * Permite setear, limpiar y verificar errores campo por campo, y
 * hacer focus automático al primer campo con error.
 */
import { useState, useCallback } from 'react';
import { ValidationError } from '../utils/errors';

export function useFormErrors(initialErrors = {}) {
  const [errors, setErrors] = useState(initialErrors);

  const setFieldError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Procesa un error capturado del backend.
   * Si es ValidationError, mapea los errores a los campos.
   */
  const handleApiError = useCallback((error) => {
    if (error instanceof ValidationError) {
      if (typeof error.errors === 'object' && !Array.isArray(error.errors)) {
        setErrors(error.errors);
      } else if (Array.isArray(error.errors)) {
        // Fallback genérico si el backend envía array simple
        setErrors({ general: error.errors[0] });
      }
    } else {
      setErrors({ general: error.message });
    }
  }, []);

  /**
   * Helper para asignar propiedades a un input (clase y aria)
   */
  const getInputProps = useCallback((field) => {
    const hasError = !!errors[field];
    return {
      className: hasError ? 'input-error' : '',
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${field}-error` : undefined,
      onChange: () => {
        if (hasError) clearFieldError(field);
      }
    };
  }, [errors, clearFieldError]);

  return {
    errors,
    setErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    handleApiError,
    getInputProps,
    hasErrors: Object.keys(errors).length > 0
  };
}

/**
 * @file useErrorHandler.js
 * @description Hook global para manejar excepciones y mostrar toasts automáticos.
 */
import { useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { ApiError, AuthError, NetworkError, ValidationError } from '../utils/errors';
import { useNavigate } from 'react-router-dom';

export function useErrorHandler() {
  const { error: showErrorToast, warning } = useToast();
  const navigate = useNavigate();

  const handleError = useCallback((error) => {
    console.error('[ErrorHandler Capturado]:', error);

    if (error instanceof AuthError) {
      // Manejar token expirado/no autorizado
      warning(error.message);
      sessionStorage.clear();
      navigate('/login');
    } else if (error instanceof NetworkError) {
      showErrorToast(error.message);
    } else if (error instanceof ValidationError) {
      // Generalmente los errores de validación se muestran en el form,
      // pero si escapan aquí, mostramos un warning genérico
      warning(error.message);
    } else if (error instanceof ApiError) {
      showErrorToast(error.message);
    } else {
      // Errores inesperados (JS puro, etc)
      showErrorToast(error?.message || 'Ha ocurrido un error inesperado.');
    }
  }, [showErrorToast, warning, navigate]);

  return handleError;
}

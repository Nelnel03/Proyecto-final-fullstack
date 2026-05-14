/**
 * @file useErrorHandler.js
 * @description Hook global para manejar excepciones y mostrar toasts automáticos.
 */
import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { ApiError, AuthError, NetworkError, ValidationError } from '../utils/errors';
import { useNavigate } from 'react-router-dom';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export function useErrorHandler() {
  const navigate = useNavigate();

  const handleError = useCallback((error) => {
    console.error('[ErrorHandler Capturado]:', error);

    if (error instanceof AuthError) {
      // Manejar token expirado/no autorizado
      Toast.fire({ icon: 'warning', title: error.message });
      sessionStorage.clear();
      navigate('/login');
    } else if (error instanceof NetworkError) {
      Toast.fire({ icon: 'error', title: error.message });
    } else if (error instanceof ValidationError) {
      // Generalmente los errores de validación se muestran en el form,
      // pero si escapan aquí, mostramos un warning genérico
      Toast.fire({ icon: 'warning', title: error.message });
    } else if (error instanceof ApiError) {
      Toast.fire({ icon: 'error', title: error.message });
    } else {
      // Errores inesperados (JS puro, etc)
      Toast.fire({ icon: 'error', title: error?.message || 'Ha ocurrido un error inesperado.' });
    }
  }, [navigate]);

  return handleError;
}

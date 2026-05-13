/**
 * @file useRequestState.js
 * @description Hook global que integra una petición con el LoadingContext.
 * Registra el inicio/fin de la petición automáticamente en el store global
 * y muestra toasts de error vía SweetAlert2 (ya presente en el proyecto).
 */
import { useCallback } from 'react';
import { useLoadingContext } from '../context/LoadingContext';
import { useErrorHandler } from './useErrorHandler';

/**
 * @param {string} key     Clave única para identificar este loader (ej: 'arboles').
 * @param {Object} options
 * @param {boolean} options.blocking      Si true, activa el overlay bloqueante.
 * @param {boolean} options.showErrorToast Si true, muestra toast de error automáticamente.
 * @param {number}  options.minDelay      Delay mínimo en ms antes de ocultar el loader.
 */
export function useRequestState(
  key,
  { blocking = false, showErrorToast = true, minDelay = 300 } = {}
) {
  const { startLoading, stopLoading, isLoading, setBlockingOverlay } = useLoadingContext();
  const handleError = useErrorHandler();

  /**
   * Ejecuta una función async registrando el estado de carga en el contexto global.
   * @param {Function} fn     Función async a ejecutar.
   * @param {...any}   args   Argumentos que se pasarán a fn.
   */
  const run = useCallback(
    async (fn, ...args) => {
      startLoading(key);
      if (blocking) setBlockingOverlay(true);

      const startTime = Date.now();

      try {
        const result = await fn(...args);

        /* Garantizar delay mínimo para evitar flickering */
        const elapsed = Date.now() - startTime;
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed));
        }

        return result;
      } catch (err) {
        const elapsed = Date.now() - startTime;
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed));
        }

        if (showErrorToast) {
          handleError(err);
        }
        throw err;
      } finally {
        stopLoading(key, minDelay);
        if (blocking) setBlockingOverlay(false);
      }
    },
    [key, blocking, showErrorToast, minDelay, startLoading, stopLoading, setBlockingOverlay]
  );

  return { run, loading: isLoading(key) };
}

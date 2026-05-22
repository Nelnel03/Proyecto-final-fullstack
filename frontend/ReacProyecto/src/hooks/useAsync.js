/**
 * @file useAsync.js
 * @description Hook para encapsular cualquier operación asincrónica con manejo
 * automático de loading, resultado, error y reintentos.
 */
import { useState, useCallback, useRef } from 'react';

/**
 * Encapsula una función async con estados de loading / data / error.
 *
 * @param {Function} asyncFn  Función async que se ejecutará.
 * @param {Object}   options
 * @param {number}   options.minDelay   Delay mínimo antes de desactivar el loader (ms).
 * @param {Function} options.onSuccess  Callback al finalizar con éxito.
 * @param {Function} options.onError    Callback al producirse un error.
 * @returns {{ execute, loading, data, error, reset }}
 */
export function useAsync(asyncFn, { minDelay = 300, onSuccess, onError } = {}) {
  const [loading, setLoading]   = useState(false);
  const [data,    setData]      = useState(null);
  const [error,   setError]     = useState(null);

  // Evitamos actualizar estado si el componente desmontó
  const mountedRef = useRef(true);
  const startTime  = useRef(0);

  const execute = useCallback(
    async (...args) => {
      mountedRef.current = true;
      startTime.current  = Date.now();

      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);

        /* Garantizar delay mínimo para evitar flickering */
        const elapsed = Date.now() - startTime.current;
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed));
        }

        if (mountedRef.current) {
          setData(result);
          setLoading(false);
          onSuccess?.(result);
        }
        return result;
      } catch (err) { console.error(err);
        const elapsed = Date.now() - startTime.current;
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed));
        }

        if (mountedRef.current) {
          setError(err);
          setLoading(false);
          onError?.(err);
        }
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asyncFn, minDelay]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setData(null);
    setError(null);
  }, []);

  return { execute, loading, data, error, reset };
}

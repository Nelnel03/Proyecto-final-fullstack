/**
 * @file useLoading.js
 * @description Hook reutilizable para manejar un estado de carga local simple.
 * Útil cuando NO se necesita acceso al contexto global.
 */
import { useState, useCallback } from 'react';

/**
 * Hook local de loading con helpers para iniciar y detener.
 * @param {boolean} initialValue Estado inicial del loader.
 * @returns {{ loading: boolean, startLoading: Function, stopLoading: Function, setLoading: Function }}
 */
export function useLoading(initialValue = false) {
  const [loading, setLoading] = useState(initialValue);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return { loading, startLoading, stopLoading, setLoading };
}

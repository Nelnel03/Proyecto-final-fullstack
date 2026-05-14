/**
 * @file LoadingContext.jsx
 * @description Contexto global centralizado para el manejo de estados de carga.
 * Provee soporte para loaders globales, por clave (por módulo/componente)
 * y overlay de bloqueo para operaciones críticas.
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

/* ─── Estado inicial ─────────────────────────────────────────── */
const initialState = {
  globalLoading: false,       // Spinner/barra global (NProgress)
  blockingOverlay: false,     // Overlay semitransparente que bloquea la UI
  keys: {},                   // { [key: string]: boolean } → loaders por módulo
  activeRequests: 0,          // Contador de peticiones en vuelo
};

/* ─── Reducer ────────────────────────────────────────────────── */
function loadingReducer(state, action) {
  switch (action.type) {
    case 'SET_GLOBAL':
      return { ...state, globalLoading: action.payload };

    case 'SET_BLOCKING':
      return { ...state, blockingOverlay: action.payload };

    case 'SET_KEY':
      return {
        ...state,
        keys: { ...state.keys, [action.key]: action.payload },
      };

    case 'CLEAR_KEY': {
      const { [action.key]: _removed, ...rest } = state.keys;
      return { ...state, keys: rest };
    }

    case 'INC_REQUESTS':
      return { ...state, activeRequests: state.activeRequests + 1 };

    case 'DEC_REQUESTS': {
      const next = Math.max(0, state.activeRequests - 1);
      return { ...state, activeRequests: next, globalLoading: next > 0 };
    }

    default:
      return state;
  }
}

/* ─── Contexto ───────────────────────────────────────────────── */
const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  /** Activa / desactiva el loader global (barra + spinner) */
  const setGlobalLoading = useCallback((value) => {
    dispatch({ type: 'SET_GLOBAL', payload: value });
  }, []);

  /** Activa / desactiva el overlay bloqueante */
  const setBlockingOverlay = useCallback((value) => {
    dispatch({ type: 'SET_BLOCKING', payload: value });
  }, []);

  /** Activa un loader identificado por clave (e.g. 'arboles', 'login') */
  const startLoading = useCallback((key) => {
    dispatch({ type: 'SET_KEY', key, payload: true });
    dispatch({ type: 'INC_REQUESTS' });
  }, []);

  /** Detiene el loader de una clave con un delay mínimo para evitar flickering */
  const stopLoading = useCallback((key, minDelay = 300) => {
    setTimeout(() => {
      dispatch({ type: 'SET_KEY', key, payload: false });
      dispatch({ type: 'DEC_REQUESTS' });
    }, minDelay);
  }, []);

  /** Devuelve si una clave específica está cargando */
  const isLoading = useCallback((key) => !!state.keys[key], [state.keys]);

  const value = {
    globalLoading: state.globalLoading,
    blockingOverlay: state.blockingOverlay,
    activeRequests: state.activeRequests,
    keys: state.keys,
    setGlobalLoading,
    setBlockingOverlay,
    startLoading,
    stopLoading,
    isLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

/** Hook principal para consumir el contexto de loading */
// eslint-disable-next-line react-refresh/only-export-components
export function useLoadingContext() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoadingContext debe usarse dentro de <LoadingProvider>');
  }
  return ctx;
}

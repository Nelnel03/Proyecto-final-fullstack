/**
 * @file ToastContext.jsx
 * @description Contexto global para manejar notificaciones (toasts).
 * Provee un sistema unificado, accesible y con animaciones suaves.
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ToastContainer from '../components/ui/ToastContainer';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  /**
   * Agrega un nuevo toast al sistema.
   * Evita duplicados si tienen el mismo ID.
   */
  const addToast = useCallback(({ message, type = 'info', duration = 4000, id = null }) => {
    const toastId = id || `toast-${++idCounter.current}`;
    
    setToasts((currentToasts) => {
      // Evitar duplicados exactos si se pasa un id
      if (currentToasts.some(t => t.id === toastId)) return currentToasts;
      return [...currentToasts, { id: toastId, message, type, duration }];
    });

    return toastId;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
  }, []);

  // Métodos de conveniencia
  const success = useCallback((message, options) => addToast({ message, type: 'success', ...options }), [addToast]);
  const error = useCallback((message, options) => addToast({ message, type: 'error', ...options }), [addToast]);
  const warning = useCallback((message, options) => addToast({ message, type: 'warning', ...options }), [addToast]);
  const info = useCallback((message, options) => addToast({ message, type: 'info', ...options }), [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}

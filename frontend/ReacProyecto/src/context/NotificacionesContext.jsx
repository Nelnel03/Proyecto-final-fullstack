/**
 * @file NotificacionesContext.jsx
 * @description Context global para el estado de notificaciones leídas/no leídas.
 * Centraliza el badge, el summary y las acciones de marcar como leído,
 * eliminando prop-drilling y badges fantasma.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  getNotificacionesSummary,
  markNotificacionesRead,
  markAllNotificacionesRead
} from '../services/notificaciones.service.jsx';
import {
  subscribeToNotifications,
  unsubscribeFromNotifications
} from '../services/socketService.jsx';

const SUMMARY_INICIAL = { total: 0, soporte: 0, robos: 0, solicitudes: 0, labores: 0 };

const NotificacionesContext = createContext({
  summary: SUMMARY_INICIAL,
  total: 0,
  fetchSummary: async () => {},
  markRead: async () => {},
  markAllRead: async () => {}
});

export function NotificacionesProvider({ children }) {
  const [summary, setSummary] = useState(SUMMARY_INICIAL);
  const lastTotalRef = useRef(-1); // Para deduplicar eventos de socket consecutivos iguales

  // Carga el resumen desde el backend (se llama al montar y como fallback del evento legacy)
  const fetchSummary = useCallback(async () => {
    const data = await getNotificacionesSummary();
    if (data) {
      setSummary(data);
      lastTotalRef.current = data.total;
    }
  }, []);

  // Actualiza el summary desde un payload de socket (sin fetch adicional)
  const applySummary = useCallback((data) => {
    if (!data) return;
    // Deduplicar: ignorar si el total es exactamente el mismo que el último
    if (data.total === lastTotalRef.current) return;
    lastTotalRef.current = data.total;
    setSummary(data);
  }, []);

  // Marcar registros específicos como leídos con Optimistic UI
  const markRead = useCallback(async (ids = {}) => {
    // 1. Actualización optimista: restar del summary localmente
    setSummary(prev => {
      const delta = {
        soporte: (ids.reportes?.length ?? 0),
        robos: (ids.robos?.length ?? 0),
        solicitudes: (ids.solicitudes?.length ?? 0),
        labores: (ids.labores?.length ?? 0)
      };
      const nuevo = {
        soporte: Math.max(0, prev.soporte - delta.soporte),
        robos: Math.max(0, prev.robos - delta.robos),
        solicitudes: Math.max(0, prev.solicitudes - delta.solicitudes),
        labores: Math.max(0, prev.labores - delta.labores)
      };
      nuevo.total = nuevo.soporte + nuevo.robos + nuevo.solicitudes + nuevo.labores;
      lastTotalRef.current = nuevo.total;
      return nuevo;
    });

    // 2. Persistir en backend (el socket sincronizará a otros admins si los hay)
    const result = await markNotificacionesRead(ids);
    if (result?.summary) {
      // Reconciliar con el valor real del backend
      setSummary(result.summary);
      lastTotalRef.current = result.summary.total;
    }
  }, []);

  // Marcar TODAS como leídas
  const markAllRead = useCallback(async () => {
    // 1. Optimistic UI: badge a 0 inmediatamente
    setSummary(SUMMARY_INICIAL);
    lastTotalRef.current = 0;

    // 2. Persistir en backend
    const result = await markAllNotificacionesRead();
    if (result?.summary) {
      setSummary(result.summary);
      lastTotalRef.current = result.summary.total;
    }
  }, []);

  useEffect(() => {
    // Solo suscribir si el usuario es admin (el socket solo se conecta con token válido)
    const isAdmin = (() => {
      try {
        const u = JSON.parse(sessionStorage.getItem('user') || '{}');
        return u?.rol === 'admin';
      } catch {
        return false;
      }
    })();

    if (!isAdmin) return;

    // Carga inicial
    fetchSummary();

    const handleSocketEvent = (summaryPayload) => {
      if (summaryPayload && typeof summaryPayload === 'object') {
        // Evento enriquecido: actualizar directamente sin fetch
        applySummary(summaryPayload);
      } else {
        // Evento legacy: hacer GET /summary
        fetchSummary();
      }
    };

    subscribeToNotifications(handleSocketEvent);

    return () => {
      unsubscribeFromNotifications(handleSocketEvent);
    };
  }, [fetchSummary, applySummary]);

  return (
    <NotificacionesContext.Provider value={{
      summary,
      total: summary.total,
      fetchSummary,
      markRead,
      markAllRead
    }}>
      {children}
    </NotificacionesContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de notificaciones.
 * @returns {{ summary: object, total: number, fetchSummary: Function, markRead: Function, markAllRead: Function }}
 */
export function useNotificaciones() {
  return useContext(NotificacionesContext);
}

export default NotificacionesContext;

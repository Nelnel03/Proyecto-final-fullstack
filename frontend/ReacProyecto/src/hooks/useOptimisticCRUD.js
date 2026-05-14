import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

/**
 * Hook para manejar operaciones CRUD con actualizaciones optimistas y sin recarga de página.
 * 
 * @param {Array} initialState - Estado inicial de la lista de datos.
 * @param {Object} options - Opciones de configuración.
 * @param {Function} options.onSuccess - Callback opcional al completar una operación.
 * @param {Function} options.onError - Callback opcional al fallar una operación.
 */
export function useOptimisticCRUD(initialState = [], { onSuccess, onError } = {}) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  /**
   * CREATE: Agrega un nuevo elemento a la lista localmente.
   */
  const createItem = useCallback(async (serviceFn, newItemData) => {
    setLoading(true);
    try {
      const response = await serviceFn(newItemData);
      // Asumimos que la API devuelve el objeto creado con su ID real
      setData(prev => [...prev, response]);
      if (onSuccess) onSuccess('create', response);
      return response;
    } catch (error) {
      if (onError) onError('create', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  /**
   * UPDATE: Actualiza un elemento con soporte optimista.
   */
  const updateItem = useCallback(async (serviceFn, id, updatedFields) => {
    // Guardamos el estado previo para posible rollback
    const previousState = [...data];
    
    // Actualización Optimista: Actualizamos la UI inmediatamente
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedFields } : item
    ));

    try {
      const response = await serviceFn(updatedFields, id);
      if (onSuccess) onSuccess('update', response);
      return response;
    } catch (error) {
      // Rollback en caso de error
      setData(previousState);
      if (onError) onError('update', error);
      throw error;
    }
  }, [data, onSuccess, onError]);

  /**
   * DELETE: Elimina un elemento con soporte optimista.
   */
  const deleteItem = useCallback(async (serviceFn, id) => {
    const previousState = [...data];

    // Actualización Optimista: Eliminamos visualmente de inmediato
    setData(prev => prev.filter(item => item.id !== id));

    try {
      await serviceFn(id);
      if (onSuccess) onSuccess('delete', id);
    } catch (error) {
      // Rollback en caso de error
      setData(previousState);
      if (onError) onError('delete', error);
      throw error;
    }
  }, [data, onSuccess, onError]);

  /**
   * REFRESH/SYNC: Sincroniza el estado local con la base de datos de forma silenciosa.
   */
  const syncData = useCallback(async (serviceFn) => {
    try {
      const freshData = await serviceFn();
      setData(freshData || []);
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
    }
  }, []);

  return {
    data,
    setData,
    loading,
    createItem,
    updateItem,
    deleteItem,
    syncData
  };
}

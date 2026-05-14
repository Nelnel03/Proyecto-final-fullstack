import { useState, useMemo } from 'react';

/**
 * Hook para manejar la lógica de paginación.
 * 
 * @param {Array} items - La lista completa de elementos a paginar.
 * @param {number} itemsPerPage - Cantidad de elementos por página (por defecto 10).
 * @returns {Object} Objeto con el estado y funciones de paginación.
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Obtener los elementos de la página actual
  const currentItems = useMemo(() => {
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, indexOfFirstItem, indexOfLastItem]);

  // Calcular el total de páginas
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Resetear a la primera página cuando cambian los items (por filtros o búsquedas)
  useMemo(() => {
    setCurrentPage(1);
  }, [items.length]);

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    paginate,
    totalItems: items.length,
    itemsPerPage
  };
};

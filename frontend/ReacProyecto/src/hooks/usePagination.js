import { useMemo, useState, useCallback } from 'react';

/**
 * Custom hook for local data pagination.
 * @param {Array} data - The complete array of items to paginate.
 * @param {number} initialItemsPerPage - Default items per page.
 */
export const usePagination = (data = [], initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Reset to first page when data changes or items per page changes
  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  const changeItemsPerPage = useCallback((count) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  }, []);

  const pageInfo = {
    totalItems: data.length,
    totalPages,
    currentPage,
    itemsPerPage,
    startItem: (currentPage - 1) * itemsPerPage + 1,
    endItem: Math.min(currentPage * itemsPerPage, data.length)
  };

  return {
    currentData,
    pageInfo,
    goToPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
    setCurrentPage
  };
};

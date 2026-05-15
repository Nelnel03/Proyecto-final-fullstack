import React from 'react';
import './Pagination.css';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Componente de paginación visual reutilizable.
 * 
 * @param {number} currentPage - Página actual.
 * @param {number} totalPages - Total de páginas.
 * @param {function} onPageChange - Función que se ejecuta al cambiar de página.
 * @param {number} totalItems - Cantidad total de registros.
 * @param {number} itemsPerPage - Cantidad de registros por página.
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50]
}) => {
  if (totalItems === 0) return null;


  // Generar el rango de páginas a mostrar (máximo 5)
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container fade-in">
      <div className="pagination-info-group">
        <div className="pagination-info">
          Mostrando <span className="pagination-highlight">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
          </span> a <span className="pagination-highlight">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span> de <span className="pagination-highlight">{totalItems}</span> registros
        </div>

        {onItemsPerPageChange && (
          <div className="pagination-page-size">
            <select 
              value={itemsPerPage} 
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="ui-select-mini"
            >
              {itemsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt} por página</option>
              ))}
            </select>
          </div>
        )}
      </div>


      <nav className="pagination-nav">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-btn pagination-btn-step"
          title="Primera página"
        >
          <ChevronsLeft size={18} />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn pagination-btn-step"
          title="Anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="pagination-numbers">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`pagination-btn pagination-btn-number ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-btn-step"
          title="Siguiente"
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-btn-step"
          title="Última página"
        >
          <ChevronsRight size={18} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;

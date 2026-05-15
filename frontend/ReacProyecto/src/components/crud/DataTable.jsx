import React, { useState } from 'react';
import { Edit2, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { SkeletonTable } from '../ui/Skeleton';

export const DataTable = ({ 
  columns, 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  onView,
  emptyMessage = "No se encontraron registros",
  actionsHeader = "Acciones"
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Manejo de valores nulos o indefinidos
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  if (loading) return <SkeletonTable rows={5} cols={columns.length + (onEdit || onDelete || onView ? 1 : 0)} />;

  return (
    <div className="ui-table-container">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                onClick={() => col.sortable !== false && handleSort(col.key)}
                style={{ cursor: col.sortable !== false ? 'pointer' : 'default', userSelect: 'none' }}
              >
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '6px' }}>
                  {col.label}
                  {col.sortable !== false && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th className="text-right" style={{ textAlign: 'right' }}>{actionsHeader}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="text-center py-8">
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
                  {emptyMessage}
                </p>
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIdx) => (
              <tr key={row.id || rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {onView && (
                        <button className="crud-action-btn view-btn" onClick={() => onView(row)} title="Ver detalles">
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button className="crud-action-btn edit-btn" onClick={() => onEdit(row)} title="Editar">
                          <Edit2 size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button className="crud-action-btn delete-btn" onClick={() => onDelete(row)} title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style jsx="true">{`
        .crud-action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .view-btn { color: var(--ui-info); }
        .view-btn:hover { background: rgba(59, 130, 246, 0.1); transform: scale(1.1); }
        .edit-btn { color: var(--ui-warning); }
        .edit-btn:hover { background: rgba(245, 158, 11, 0.1); transform: scale(1.1); }
        .delete-btn { color: var(--ui-error); }
        .delete-btn:hover { background: rgba(239, 68, 68, 0.1); transform: scale(1.1); }
      `}</style>
    </div>
  );
};

export default DataTable;

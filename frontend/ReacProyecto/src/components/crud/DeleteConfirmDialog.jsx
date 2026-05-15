import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import FormModal from './FormModal';

export const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Eliminación", 
  message = "¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer.",
  itemName,
  isDeleting = false
}) => {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div className="delete-dialog-content">
        <div className="delete-icon-wrapper">
          <AlertTriangle size={56} className="delete-icon" />
        </div>
        <p className="delete-message">
          {message}
        </p>
        {itemName && (
          <p className="delete-item-name"><strong>{itemName}</strong></p>
        )}
        
        <div className="delete-actions mt-8">
          <button 
            className="ui-btn ui-btn--ghost" 
            onClick={onClose}
            disabled={isDeleting}
            style={{ width: '100%' }}
          >
            Cancelar
          </button>
          <button 
            className="ui-btn ui-btn--danger" 
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ width: '100%' }}
          >
            {isDeleting ? (
              <><Loader2 size={18} className="animate-spin" /> Eliminando...</>
            ) : (
              'Sí, eliminar'
            )}
          </button>
        </div>
      </div>
      <style jsx="true">{`
        .delete-dialog-content {
          text-align: center;
          padding: 10px 0;
        }
        .delete-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .delete-icon {
          color: var(--ui-error);
          background: rgba(239, 68, 68, 0.1);
          padding: 12px;
          border-radius: 50%;
        }
        .delete-message {
          color: var(--color-texto);
          font-size: 1.05rem;
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .delete-item-name {
          color: var(--color-tierra-sombra);
          font-size: 1.1rem;
          background: rgba(0,0,0,0.03);
          padding: 8px;
          border-radius: var(--radius-sm);
          display: inline-block;
        }
        [data-theme='dark'] .delete-item-name {
          background: rgba(255,255,255,0.05);
        }
        .delete-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
        }
      `}</style>
    </FormModal>
  );
};

export default DeleteConfirmDialog;

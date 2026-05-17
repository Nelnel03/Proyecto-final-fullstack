import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const FormModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = '600px'
}) => {
  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in" style={{ maxWidth }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }
        .modal-content {
          background: var(--color-caracola);
          width: 100%;
          max-height: 90vh;
          border-radius: var(--radius-md);
          box-shadow: var(--sombra-profunda);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        [data-theme='dark'] .modal-content {
          background: var(--color-arena);
          border: 1px solid var(--glass-border);
        }
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-title {
          margin: 0;
          font-size: 1.25rem;
          color: var(--color-tierra-sombra);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--color-tierra-sombra);
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
          padding: 4px;
          display: flex;
        }
        .modal-close-btn:hover { opacity: 1; }
        .modal-body {
          padding: 24px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default FormModal;

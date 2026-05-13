/**
 * @file Toast.jsx
 * @description Componente individual de notificación. Se cierra automáticamente
 * según su duration y provee accesibilidad.
 */
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const icons = {
  success: <CheckCircle size={20} className="toast-icon toast-icon--success" />,
  error: <AlertCircle size={20} className="toast-icon toast-icon--error" />,
  warning: <AlertTriangle size={20} className="toast-icon toast-icon--warning" />,
  info: <Info size={20} className="toast-icon toast-icon--info" />
};

function Toast({ id, message, type, duration, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsClosing(true);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleAnimationEnd = () => {
    if (isClosing) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    setIsClosing(true);
  };

  return (
    <div
      className={`toast toast--${type} ${isClosing ? 'toast--exit' : 'toast--enter'}`}
      onAnimationEnd={handleAnimationEnd}
      role="alert"
    >
      <div className="toast-content">
        {icons[type]}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={handleCloseClick} aria-label="Cerrar notificación">
        <X size={16} />
      </button>
      {duration > 0 && !isClosing && (
        <div className={`toast-progress toast-progress--${type}`} style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
}

export default Toast;

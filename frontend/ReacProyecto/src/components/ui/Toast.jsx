import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const Toast = ({ id, type = 'info', message, duration = 5000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const Icon = iconMap[type] || Info;
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingTimeRef = useRef(duration);

  const startTimer = () => {
    if (remainingTimeRef.current > 0) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        handleClose();
      }, remainingTimeRef.current);
    }
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current -= elapsed;
    }
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Coincide con la duración de la animación en CSS
  };

  return (
    <div 
      className={`toast toast-${type} ${isClosing ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
      aria-live="assertive"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <div className="toast-icon-wrapper">
        <Icon className="toast-icon" size={20} />
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button 
        className="toast-close-btn" 
        onClick={handleClose} 
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
      {duration > 0 && (
        <div 
          className="toast-progress" 
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

export default Toast;

/**
 * @file TopProgressBar.jsx
 * @description Barra de progreso tipo NProgress en la parte superior de la página.
 * Se activa automáticamente cuando hay peticiones activas en el LoadingContext.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLoadingContext } from '../../context/LoadingContext';
import './TopProgressBar.css';

function TopProgressBar() {
  const { activeRequests, globalLoading } = useLoadingContext();
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const fadeRef  = useRef(null);

  const isActive = activeRequests > 0 || globalLoading;

  useEffect(() => {
    if (isActive) {
      /* Mostrar barra e iniciar incremento progresivo */
      setVisible(true);
      setProgress(10);

      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          /* La barra sube rápido al principio y se ralentiza al acercarse a 85% */
          if (prev >= 85) return prev;
          const increment = Math.random() * (prev < 40 ? 12 : prev < 70 ? 5 : 2);
          return Math.min(prev + increment, 85);
        });
      }, 300);
    } else {
      /* Completar y ocultar con fade */
      clearInterval(timerRef.current);
      setProgress(100);

      fadeRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 500);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(fadeRef.current);
    };
  }, [isActive]);

  if (!visible) return null;

  return (
    <div
      className={`top-progress-bar ${progress >= 100 ? 'top-progress-bar--done' : ''}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Cargando..."
    >
      <div
        className="top-progress-bar__fill"
        style={{ width: `${progress}%` }}
      />
      <div className="top-progress-bar__glow" style={{ left: `${progress}%` }} />
    </div>
  );
}

export default TopProgressBar;

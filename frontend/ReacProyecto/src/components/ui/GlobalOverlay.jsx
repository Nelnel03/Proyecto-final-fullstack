/**
 * @file GlobalOverlay.jsx
 * @description Overlay semitransparente global que bloquea la interacción del usuario
 * durante operaciones críticas. Se activa desde el LoadingContext.
 */
import React from 'react';
import Spinner from './Spinner';
import { useLoadingContext } from '../../context/LoadingContext';
import './GlobalOverlay.css';

function GlobalOverlay() {
  const { blockingOverlay } = useLoadingContext();

  if (!blockingOverlay) return null;

  return (
    <div
      className="global-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Procesando operación..."
    >
      <div className="global-overlay__box">
        <Spinner size="lg" />
        <p className="global-overlay__text">Procesando, por favor espera…</p>
      </div>
    </div>
  );
}

export default GlobalOverlay;

/**
 * @file Skeleton.jsx
 * @description Componentes skeleton reutilizables para reemplazar contenido
 * mientras los datos se cargan, eliminando las pantallas en blanco.
 */
import React from 'react';
import './Skeleton.css';

/* ─── Skeleton base ──────────────────────────────────────────── */
/**
 * Bloque skeleton genérico (rectángulo animado).
 * @param {Object} props
 * @param {string} props.width    Ancho (CSS). Default '100%'
 * @param {string} props.height   Alto (CSS). Default '1rem'
 * @param {string} props.borderRadius Borde. Default '6px'
 * @param {string} props.className Clases adicionales.
 */
export function SkeletonBlock({ width = '100%', height = '1rem', borderRadius = '6px', className = '', style = {} }) {
  return (
    <span
      className={`skeleton-block ${className}`}
      style={{ width, height, borderRadius, ...style }}
      aria-hidden="true"
    />
  );
}

/* ─── Skeleton de texto (una o varias líneas) ────────────────── */
export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
  return (
    <div className="skeleton-text" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height="0.85rem"
        />
      ))}
    </div>
  );
}

/* ─── Skeleton de tarjeta genérica ──────────────────────────── */
export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <SkeletonBlock height="160px" borderRadius="10px" />
      <div className="skeleton-card__body">
        <SkeletonBlock width="70%" height="1rem" />
        <SkeletonBlock width="45%" height="0.8rem" />
        <SkeletonText lines={2} lastLineWidth="50%" />
        <div className="skeleton-card__actions">
          <SkeletonBlock width="70px" height="28px" borderRadius="50px" />
          <SkeletonBlock width="70px" height="28px" borderRadius="50px" />
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton de fila de tabla ──────────────────────────────── */
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr className="skeleton-table-row" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="skeleton-table-cell">
          <SkeletonBlock
            width={i === 0 ? '40px' : '80%'}
            height="0.85rem"
            borderRadius="4px"
          />
        </td>
      ))}
    </tr>
  );
}

/* ─── Skeleton de tabla completa ─────────────────────────────── */
export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <tbody aria-label="Cargando datos...">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </tbody>
  );
}

/* ─── Skeleton de Grid de tarjetas ──────────────────────────── */
export function SkeletonCardGrid({ count = 6 }) {
  return (
    <div className="skeleton-card-grid" aria-label="Cargando tarjetas...">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ─── Skeleton de perfil ─────────────────────────────────────── */
export function SkeletonProfile() {
  return (
    <div className="skeleton-profile" aria-hidden="true">
      <SkeletonBlock width="80px" height="80px" borderRadius="50%" />
      <div className="skeleton-profile__info">
        <SkeletonBlock width="180px" height="1.1rem" />
        <SkeletonBlock width="120px" height="0.8rem" />
      </div>
    </div>
  );
}

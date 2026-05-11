import React from 'react';
import { Compass } from 'lucide-react';
import '../styles/CorridorMap.css';

// ── Centro del mapa para el enlace a Google Maps ─────────────────────────
const MAP_CENTER = [9.9802, -84.78575];

// ── Componente principal ───────────────────────────────────────────────────────
const CorridorMap = () => {
  return (
    <div className="map-wrapper">

      {/* ── Contenedor principal ────────────────────────────────────────────── */}
      <div className="map-container-main static-container">
        
        {/* Imagen estática del mapa */}
        {/* NOTA: Asegúrate de guardar la imagen que enviaste en la carpeta "public" con el nombre "mapa-angostura.png" */}
        <img 
          src="/Nueva carpeta/Captura de pantalla 2026-03-27 144246.png" 
          alt="Mapa visual de inicio y fin de La Angostura" 
          className="static-map-image" 
        />

        {/* ── Botón brújula / abrir en Google Maps (Mantenido intacto) ────── */}
        <div className="map-floating-overlay">
          <a
            href={`https://www.google.com/maps/@${MAP_CENTER[0]},${MAP_CENTER[1]},15z/data=!3m1!1e3`}
            target="_blank"
            rel="noopener noreferrer"
            className="compass-btn-floating"
            title="Abrir en Google Maps"
          >
            <Compass size={24} />
          </a>
        </div>

        {/* Leyenda que indica dónde debe ir la imagen en caso de no existir */}
        <div className="placeholder-text-if-missing">
          <p>
            Por favor, guarda la imagen del mapa en la carpeta <strong>public</strong> <br/>
            con el nombre <strong>mapa-angostura.png</strong>
          </p>
        </div>

        {/* ── Leyenda de La Angostura (Esquina inferior izquierda) ────── */}
        <div className="angostura-legend static-legend">
          <p className="legend-title">La Angostura</p>
          
          <div className="legend-item">
            <div className="legend-row">
              <span className="legend-dot" style={{ background: '#22c55e' }} />
              <span className="legend-label-main">
                Playa de Chacarita <span className="legend-coords">9.9785°N, 84.7718°O</span>
              </span>
            </div>
          </div>

          <div className="legend-item">
            <div className="legend-row">
              <span className="legend-dot" style={{ background: '#f59e0b' }} />
              <span className="legend-label-main">
                Porto Bello <span className="legend-coords">9.9819°N, 84.7997°O</span>
              </span>
            </div>
          </div>

          <div className="legend-item corridor-item">
            <div className="legend-row">
              <span className="legend-dash" />
              <span className="legend-label-main">Corredor principal</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CorridorMap;

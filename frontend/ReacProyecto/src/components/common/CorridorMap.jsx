import React, { useState } from 'react';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/visitante/CorridorMap.css';

// ── Centro del mapa para el enlace a Google Maps ─────────────────────────
const MAP_CENTER = [9.9802, -84.78575];

// ── Componente principal ───────────────────────────────────────────────────────
const CorridorMap = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { 
      id: 1, 
      title: 'Mapa de la Costa de Chacarita', 
      desc: 'Mapa ilustrado de la costa y el estuario.',
      imagen: '/corredor/mapa1.png'
    },
    { 
      id: 2, 
      title: 'Vista Satelital (Nehalem Bay)', 
      desc: 'Monitoreo de puntos críticos desde vista satelital.',
      imagen: '/corredor/mapa2.png'
    },
    { 
      id: 3, 
      title: 'Vegetación y Costa', 
      desc: 'Estaciones de recolección en zona de playa.',
      imagen: '/corredor/mapa3.png'
    },
    { 
      id: 4, 
      title: 'Vista Nocturna de la Península', 
      desc: 'Vista aérea nocturna de la zona costera.',
      imagen: '/corredor/mapa4.png'
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="map-wrapper">

      {/* ── Contenedor principal ────────────────────────────────────────────── */}
      <div className="map-container-main static-container" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* ── CARRUSEL SIN IMÁGENES ── */}
        <div className="carousel-slide-content" style={{ textAlign: 'center', padding: '2rem', width: '100%', transition: 'opacity 0.3s' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{slides[currentSlide].title}</h3>
          <p style={{ opacity: 0.7, marginBottom: '2rem' }}>{slides[currentSlide].desc}</p>
          <div style={{ width: '100%', height: '350px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <img 
              key={currentSlide}
              src={slides[currentSlide].imagen} 
              alt={slides[currentSlide].title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeIn 0.4s ease-in-out' }}
            />
          </div>
        </div>

        {/* ── Controles del Carrusel ── */}
        <button 
          onClick={prevSlide} 
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 20, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={nextSlide} 
          style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 20, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          <ChevronRight size={24} />
        </button>

        {/* ── Indicadores del Carrusel ── */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
          {slides.map((_, idx) => (
            <span 
              key={idx} 
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentSlide === idx ? '#064e3b' : 'rgba(0,0,0,0.2)', transition: 'background 0.3s' }}
            />
          ))}
        </div>

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

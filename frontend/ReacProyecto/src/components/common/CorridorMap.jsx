import React, { useState } from 'react';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/visitante/CorridorMap.css';

// ── Centro del mapa para el enlace a Google Maps ─────────────────────────
const MAP_CENTER = [9.9802, -84.78575];

// ── Componente principal ───────────────────────────────────────────────────────
const CorridorMap = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isDark } = useTheme();

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
    <div className="map-wrapper" style={{ height: '100%', minHeight: '350px', margin: 0, borderRadius: '16px', overflow: 'hidden' }}>

      {/* ── Contenedor principal ────────────────────────────────────────────── */}
      <div className="map-container-main static-container" style={{ position: 'relative', overflow: 'hidden', display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* ── Imagen de mapa a pantalla completa dentro de su tarjeta ── */}
        <img 
          key={currentSlide}
          src={slides[currentSlide].imagen} 
          alt={slides[currentSlide].title}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center center',
            zIndex: 1, 
            animation: 'fadeIn 0.5s ease-in-out',
            imageRendering: 'auto',
            // Calidad mejorada mediante contraste optimizado de Webkit y aceleración por GPU
            WebkitImageRendering: 'optimize-contrast',
            transform: 'scale(1.02) translateZ(0)',
            backfaceVisibility: 'hidden',
            filter: isDark 
              ? 'contrast(1.12) saturate(1.2) brightness(0.85) hue-rotate(-2deg)' 
              : 'contrast(1.06) saturate(1.15) brightness(0.98)'
          }}
        />

        {/* ── Capa de sombreado (Overlay) para asegurar contraste en la parte superior y la leyenda ── */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* ── Título del mapa en la parte superior central (Flotante) ── */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          textAlign: 'center', 
          zIndex: 10,
          background: isDark ? 'rgba(10, 15, 20, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '0.6rem 1.5rem',
          borderRadius: '30px',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          color: isDark ? '#fff' : '#1e293b',
          maxWidth: '80%',
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: isDark ? '#00f0ff' : '#064e3b', letterSpacing: '0.05em' }}>{slides[currentSlide].title}</h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: '2px 0 0', color: isDark ? '#cbd5e1' : '#64748b' }}>{slides[currentSlide].desc}</p>
        </div>

        {/* ── Controles del Carrusel ── */}
        <button 
          onClick={prevSlide} 
          className="carousel-nav-btn"
          style={{ 
            position: 'absolute', 
            left: '1.5rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            background: isDark ? 'rgba(10, 15, 20, 0.65)' : 'rgba(255, 255, 255, 0.75)', 
            backdropFilter: 'blur(8px)',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)', 
            borderRadius: '50%', 
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#00f0ff' : '#1e293b',
            cursor: 'pointer', 
            zIndex: 20, 
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={nextSlide} 
          className="carousel-nav-btn"
          style={{ 
            position: 'absolute', 
            right: '1.5rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            background: isDark ? 'rgba(10, 15, 20, 0.65)' : 'rgba(255, 255, 255, 0.75)', 
            backdropFilter: 'blur(8px)',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)', 
            borderRadius: '50%', 
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#00f0ff' : '#1e293b',
            cursor: 'pointer', 
            zIndex: 20, 
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* ── Indicadores del Carrusel ── */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.6rem', zIndex: 20 }}>
          {slides.map((_, idx) => (
            <span 
              key={idx} 
              style={{ 
                width: currentSlide === idx ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: currentSlide === idx ? '#00f0ff' : 'rgba(255,255,255,0.4)', 
                boxShadow: currentSlide === idx ? '0 0 8px rgba(0,240,255,0.8)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
              }}
            />
          ))}
        </div>

        {/* ── Botón brújula / abrir en Google Maps (Mantenido intacto) ────── */}
        <div className="map-floating-overlay" style={{ top: '20px', left: '20px' }}>
          <a
            href={`https://www.google.com/maps/@${MAP_CENTER[0]},${MAP_CENTER[1]},15z/data=!3m1!1e3`}
            target="_blank"
            rel="noopener noreferrer"
            className="compass-btn-floating"
            title="Abrir en Google Maps"
            style={{
              background: isDark ? 'rgba(10, 15, 20, 0.85)' : 'white',
              border: isDark ? '2px solid rgba(255, 255, 255, 0.15)' : '2px solid white',
              color: isDark ? '#00f0ff' : '#1a4332',
              backdropFilter: 'blur(8px)',
              boxShadow: isDark ? '0 4px 15px rgba(0, 0, 0, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.3s ease'
            }}
          >
            <Compass size={24} />
          </a>
        </div>

        {/* ── Leyenda de La Angostura (Esquina inferior izquierda) ────── */}
        <div 
          className="angostura-legend static-legend"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: isDark ? 'rgba(10, 15, 20, 0.85)' : 'rgba(243, 244, 246, 0.85)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.4)',
            color: isDark ? '#cbd5e1' : '#1f2937',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease'
          }}
        >
          <p className="legend-title" style={{ color: isDark ? '#00f0ff' : '#1f3b2d' }}>La Angostura</p>
          
          <div className="legend-item">
            <div className="legend-row">
              <span className="legend-dot" style={{ background: '#22c55e' }} />
              <span className="legend-label-main" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
                Playa de Chacarita <span className="legend-coords" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>9.9785°N, 84.7718°O</span>
              </span>
            </div>
          </div>

          <div className="legend-item">
            <div className="legend-row">
              <span className="legend-dot" style={{ background: '#f59e0b' }} />
              <span className="legend-label-main" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
                Porto Bello <span className="legend-coords" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>9.9819°N, 84.7997°O</span>
              </span>
            </div>
          </div>

          <div className="legend-item corridor-item">
            <div className="legend-row">
              <span className="legend-dash" />
              <span className="legend-label-main" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>Corredor principal</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CorridorMap;

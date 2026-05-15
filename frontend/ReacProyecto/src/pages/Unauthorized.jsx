import React from 'react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page-premium fade-in">
      <div className="unauthorized-card">
        <div className="icon-wrapper">
          <ShieldAlert size={64} className="text-error pulse-animation" />
        </div>
        <h1 className="unauth-title">Acceso Restringido</h1>
        <p className="unauth-text">
          No tienes los permisos suficientes para acceder a esta sección. 
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
        
        <div className="unauth-actions">
          <button className="ui-btn ui-btn--ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="mr-2" />
            Regresar
          </button>
          <button className="ui-btn ui-btn--primary" onClick={() => navigate('/')}>
            <Home size={18} className="mr-2" />
            Ir al Inicio
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .unauthorized-page-premium {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-color);
          padding: 2rem;
        }
        .unauthorized-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          padding: 3rem;
          border-radius: 32px;
          text-align: center;
          max-width: 500px;
          box-shadow: var(--sombra-premium);
        }
        .icon-wrapper {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }
        .unauth-title {
          font-size: 2rem;
          font-weight: 900;
          color: var(--color-tierra-sombra);
          margin-bottom: 1rem;
        }
        .unauth-text {
          color: var(--color-tierra-sombra);
          opacity: 0.7;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .unauth-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .pulse-animation {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.4)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0)); }
        }
      `}</style>
    </div>
  );
};

export default Unauthorized;

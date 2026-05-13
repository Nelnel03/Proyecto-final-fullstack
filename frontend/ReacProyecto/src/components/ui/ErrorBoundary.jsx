/**
 * @file ErrorBoundary.jsx
 * @description Límite de errores de React para atrapar errores JS no controlados en el árbol
 * de componentes y mostrar una pantalla de fallo amigable en lugar de colapsar.
 */
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí podríamos registrar el error en un servicio como Sentry o Datadog
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <div className="error-boundary__icon-wrapper">
              <AlertTriangle size={48} className="error-boundary__icon" />
            </div>
            <h2 className="error-boundary__title">¡Ups! Algo salió mal.</h2>
            <p className="error-boundary__desc">
              Ocurrió un problema inesperado al cargar esta sección.
              Hemos registrado el error para solucionarlo pronto.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="error-boundary__details">
                {this.state.error.toString()}
              </pre>
            )}
            <button className="error-boundary__retry-btn" onClick={this.handleRetry}>
              <RefreshCcw size={16} />
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

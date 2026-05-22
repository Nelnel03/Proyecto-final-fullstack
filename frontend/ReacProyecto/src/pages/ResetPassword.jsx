import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../services/config.jsx';
import { 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { LoadingButton } from '../components/ui';
import '../styles/auth/Login.css';
import '../styles/auth/ResetPassword.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="login-premium-page fade-in">
        <div className="login-bg-decor-1"></div>
        <div className="login-container flex-center">
          <div className="login-form-card premium-card text-center">
            <div className="status-icon-container error">
              <AlertCircle size={48} />
            </div>
            <h2 className="mt-4">Enlace Inválido</h2>
            <p className="text-muted">El enlace de recuperación parece estar incompleto o ha expirado.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="ui-btn ui-btn--primary w-full mt-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe contener al menos 1 letra mayúscula, 1 minúscula y 1 número.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'No se pudo restablecer la contraseña.');
        return;
      }

      setSuccess('Tu contraseña ha sido actualizada correctamente.');
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) { console.error(err);
      console.error(err);
      setError('Hubo un problema al actualizar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-premium-page fade-in">
      <div className="login-bg-decor-1"></div>
      <div className="login-bg-decor-2"></div>

      <div className="login-container flex-center">
        <div className="login-form-card premium-card">
          <div className="form-header text-center">
            <div className="header-icon-badge">
              <ShieldCheck size={32} />
            </div>
            <h2>Seguridad de Cuenta</h2>
            <p className="text-muted">Crea una nueva contraseña para tu cuenta de BioMon.</p>
          </div>

          {error ? (
            <div className="status-box error fade-in">
              <AlertCircle size={20} />
              <p>{error}</p>
              <button onClick={() => navigate('/login')} className="text-link-small mt-2">
                ¿Prefieres volver al login?
              </button>
            </div>
          ) : success ? (
            <div className="status-box success fade-in">
              <CheckCircle size={32} className="mb-2" />
              <h3>¡Actualización Exitosa!</h3>
              <p>{success}</p>
              <div className="loading-dots mt-4">
                <span></span><span></span><span></span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group-premium">
                <label className="ui-label">Nueva Contraseña</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="ui-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="requirements-hint">
                  Debe incluir mayúsculas, minúsculas y números.
                </p>
              </div>

              <div className="form-group-premium">
                <label className="ui-label">Confirmar Contraseña</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="ui-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <LoadingButton 
                type="submit" 
                loading={loading} 
                className="ui-btn ui-btn--primary w-full mt-4"
                loadingText="Actualizando clave..."
              >
                <span>Restablecer Contraseña</span>
                {!loading && <RefreshCw size={18} className="ml-2" />}
              </LoadingButton>

              <div className="form-footer mt-6">
                <button 
                  type="button" 
                  onClick={() => navigate('/login')} 
                  className="text-link"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

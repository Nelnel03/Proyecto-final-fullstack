import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../services/config.jsx';
import '../styles/Login.css';
import '../styles/ResetPassword.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Restablecer Contraseña</h2>
          <div className="error-message reset-error-msg">
            Enlace inválido o incompleto.
            <div className="reset-error-footer">
              <button onClick={() => navigate('/login')} className="reset-back-link">
                Volver a iniciar sesión
              </button>
            </div>
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

    } catch (err) {
      console.error(err);
      setError('Hubo un problema al actualizar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-card">
          <h2>Restablecer Contraseña</h2>

          {error ? (
            <div className="error-message reset-error-msg">
              {error}
              <div className="reset-error-footer">
                <button onClick={() => navigate('/login')} className="reset-back-link">
                  Volver a iniciar sesión
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="success-message reset-success-msg">
              {success}
              <p className="reset-redirect-text">Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="reset-form-hint">
                Ingresa y confirma tu nueva contraseña.
              </p>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={8}
                />
                <small className="password-requirements">
                  Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.
                </small>
              </div>

              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

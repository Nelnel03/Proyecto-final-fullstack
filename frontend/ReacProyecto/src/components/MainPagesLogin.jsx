import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { BASE_URL } from '../services/config.jsx';
import DarkModeToggle from './DarkModeToggle';
import LoadingButton from './ui/LoadingButton';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/Login.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (PUBLIC_KEY && !PUBLIC_KEY.includes("tu_public_key_aqui")) {
  emailjs.init(PUBLIC_KEY);
}

const enviarCorreo = async (nombre, correo, token) => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY ||
        SERVICE_ID.includes("tu_") || TEMPLATE_ID.includes("tu_") || PUBLIC_KEY.includes("tu_")) {
      Swal.fire('Configuración Incompleta', 'Las llaves de EmailJS no están configuradas en el archivo .env.', 'warning');
      return false;
    }

    const resetLink = `${window.location.origin}/reset-password?token=${token}`;

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      site_name: "BioMon ADI",
      site_logo_url: "",
      user_name: nombre,
      user_email: correo,
      to_email: correo,
      email: correo,
      reset_link: resetLink
    }, PUBLIC_KEY);

    return true;
  } catch (error) {
    const mensajeReal = error?.text || error?.message || String(error);
    Swal.fire('Error de EmailJS', `Detalle técnico: ${mensajeReal}`, 'error');
    return false;
  }
};

function MainPagesLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (emailValue) => {
    return String(emailValue).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!validateEmail(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.status === 'baneado') {
          Swal.fire({
            title: 'Cuenta Suspendida',
            html: `<p>Tu acceso ha sido revocado por la administración.</p><div style="background:#f7f7f7; padding:15px; border-radius:10px; border-left:4px solid #ef4444; text-align:left; margin-top:15px;"><strong>Motivo:</strong><br/>"${data.motivoBan || 'Sin motivo especificado'}"</div>`,
            icon: 'error'
          });
        } else {
          Swal.fire('Error', data.message || 'Correo o contraseña incorrectos', 'error');
        }
        setLoading(false);
        return;
      }

      const { token, user } = data;

      // Manejar primer inicio de sesión de voluntario
      if (user.debeCambiarPassword) {
        const { value: newPassword } = await Swal.fire({
          title: 'Primer Inicio de Sesión',
          text: 'Como nuevo voluntario, debes cambiar tu contraseña temporal.',
          input: 'password',
          inputPlaceholder: 'Ingresa tu nueva contraseña',
          showCancelButton: true,
          confirmButtonText: 'Cambiar y Entrar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value) return 'La nueva contraseña es obligatoria';
            if (value.length < 6) return 'Mínimo 6 caracteres';
            if (value.length > 15) return 'Máximo 15 caracteres';
          }
        });

        if (!newPassword) {
          setLoading(false);
          return;
        }

        await fetch(`${BASE_URL}/auth/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ newPassword })
        });

        user.debeCambiarPassword = 0;
      }

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('user', JSON.stringify(user));

      Swal.fire({
        title: '¡Bienvenido!',
        text: `Sesión iniciada como ${user.nombre}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        if (user.rol === 'admin') {
          navigate('/admin');
        } else if (user.rol === 'voluntario') {
          navigate('/dashboard-voluntario');
        } else {
          navigate('/dashboard-user');
        }
      }, 1500);

    } catch (err) {
      console.error('Error en login:', err);
      Swal.fire('Error', 'Hubo un problema al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !email.trim() || !telefono.trim() || !password.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (!validateEmail(email.trim())) {
      Swal.fire('Error', 'Correo electrónico no válido', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    if (password.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    if (/\d/.test(nombre.trim())) {
      Swal.fire('Error', 'El nombre no debe contener números', 'error');
      return;
    }

    if (nombre.trim().length < 3) {
      Swal.fire('Error', 'El nombre debe tener al menos 3 caracteres', 'error');
      return;
    }

    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(telefono.trim())) {
      Swal.fire('Error', 'El número de teléfono debe tener exactamente 8 dígitos', 'error');
      return;
    }

    const vowelCount = (nombre.match(/[aeiouáéíóúü]/gi) || []).length;
    if (vowelCount < 2) {
      Swal.fire('Error', 'El nombre completo debe contener al menos dos vocales', 'error');
      return;
    }

    if (email.trim().length < 11) {
      Swal.fire('Error', 'El correo electrónico debe tener al menos 11 caracteres', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          password: password.trim(),
          telefono: telefono.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire('Error', data.message || 'No se pudo completar el registro', 'error');
        return;
      }

      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'Ahora puedes iniciar sesión con tus credenciales',
        icon: 'success',
        confirmButtonText: 'Genial'
      });

      setIsRegistering(false);
      setNombre('');
      setTelefono('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error('Error en registro:', err);
      Swal.fire('Error', 'No se pudo completar el registro', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail })
      });

      const data = await response.json();

      if (data.token) {
        const envioExitoso = await enviarCorreo(data.nombre || 'Usuario', trimmedEmail, data.token);

        if (envioExitoso) {
          Swal.fire({
            title: '¡Correo enviado!',
            text: 'Se han enviado las instrucciones de recuperación a tu correo.',
            icon: 'success',
            confirmButtonText: 'Entendido'
          });
          setIsRecovering(false);
          setEmail('');
        }
      } else {
        Swal.fire({
          title: 'Solicitud Enviada',
          text: 'Si existe una cuenta con ese correo, recibirás las instrucciones.',
          icon: 'info',
          confirmButtonText: 'Entendido'
        });
        setIsRecovering(false);
        setEmail('');
      }

    } catch (error) {
      console.error("Error general:", error);
      Swal.fire('Error', 'Problema inesperado al conectarse.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-minimal-wrapper">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <DarkModeToggle />
      </div>
      <div className="login-card">
        <button
          className="login-back-btn"
          onClick={() => navigate('/')}
          title="Volver a la página principal"
        >
          ← Volver al Inicio
        </button>

        <h2>
          {isRecovering ? 'Recuperar Contraseña' : isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>

        {error && (
          <div className="login-error-msg">
            {error}
          </div>
        )}

        <form onSubmit={isRecovering ? handleRecovery : isRegistering ? handleRegister : handleLogin}>
          {!isRecovering && isRegistering && (
            <>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="form-group">
                <label>Número de Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 8) setTelefono(val);
                  }}
                  required
                  placeholder="88888888"
                  maxLength="8"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          {!isRecovering && (
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                maxLength="15"
              />
            </div>
          )}

          {!isRecovering && isRegistering && (
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                maxLength="15"
              />
            </div>
          )}

          {!isRegistering && !isRecovering && (
            <div className="login-forgot-password" style={{ textAlign: 'right', marginBottom: '15px' }}>
              <button
                type="button"
                className="login-footer-link"
                onClick={() => {
                  setIsRecovering(true);
                  setError('');
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <LoadingButton
            type="submit"
            className="login-btn"
            loading={loading}
            loadingText={
              isRecovering ? 'Enviando…' :
              isRegistering ? 'Registrando…' :
              'Entrando…'
            }
          >
            {isRecovering ? 'Enviar Instrucciones' : isRegistering ? 'Registrarse' : 'Entrar'}
          </LoadingButton>
        </form>

        <div className="login-footer-container">
          <p className="login-footer-text">
            {isRecovering ? (
              <>
                ¿Recordaste tu contraseña?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRecovering(false); setError(''); }}
                  className="login-footer-link"
                >
                  Inicia Sesión
                </button>
              </>
            ) : isRegistering ? (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setError(''); }}
                  className="login-footer-link"
                >
                  Inicia Sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(true); setError(''); }}
                  className="login-footer-link"
                >
                  Regístrate aquí
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainPagesLogin;

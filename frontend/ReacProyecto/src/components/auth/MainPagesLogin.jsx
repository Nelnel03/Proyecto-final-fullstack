import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { BASE_URL } from '../../services/config.jsx';
import { DarkModeToggle } from '../common';
import { LoadingButton, ErrorMessage } from '../ui';
import { useFormErrors } from '../../hooks/useFormErrors';


import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Leaf,
  ChevronRight,
  LogIn,
  UserPlus,
  RefreshCw
} from 'lucide-react';

import '../../styles/visitante/MainPagesInicoVisitante.css';
import '../../styles/auth/Login.css';

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
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { errors, setFieldError, clearAllErrors, getInputProps } = useFormErrors();

  const navigate = useNavigate();

  const validateEmail = (emailValue) => {
    return String(emailValue).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearAllErrors();
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let hasErrors = false;
    if (!validateEmail(trimmedEmail)) {
      setFieldError('email', 'Por favor, ingresa un correo electrónico válido');
      hasErrors = true;
    }
    if (!trimmedPassword) {
      setFieldError('password', 'La contraseña es requerida');
      hasErrors = true;
    }

    if (hasErrors) {
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
    clearAllErrors();
    let hasErrors = false;

    if (!nombre.trim()) { setFieldError('nombre', 'El nombre es obligatorio'); hasErrors = true; }
    else if (nombre.trim().length < 3) { setFieldError('nombre', 'El nombre debe tener al menos 3 caracteres'); hasErrors = true; }
    else if (/\d/.test(nombre.trim())) { setFieldError('nombre', 'El nombre no debe contener números'); hasErrors = true; }
    else if ((nombre.match(/[aeiouáéíóúü]/gi) || []).length < 2) { setFieldError('nombre', 'El nombre completo debe contener al menos dos vocales'); hasErrors = true; }

    if (!email.trim()) { setFieldError('email', 'El correo es obligatorio'); hasErrors = true; }
    else if (!validateEmail(email.trim())) { setFieldError('email', 'Correo electrónico no válido'); hasErrors = true; }
    else if (email.trim().length < 11) { setFieldError('email', 'El correo debe tener al menos 11 caracteres'); hasErrors = true; }

    const phoneRegex = /^\d{8}$/;
    if (!telefono.trim()) { setFieldError('telefono', 'El teléfono es obligatorio'); hasErrors = true; }
    else if (!phoneRegex.test(telefono.trim())) { setFieldError('telefono', 'El número de teléfono debe tener exactamente 8 dígitos'); hasErrors = true; }

    if (!password.trim()) { setFieldError('password', 'La contraseña es obligatoria'); hasErrors = true; }
    else if (password.length < 8) { setFieldError('password', 'La contraseña debe tener al menos 8 caracteres'); hasErrors = true; }

    if (password !== confirmPassword) { setFieldError('confirmPassword', 'Las contraseñas no coinciden'); hasErrors = true; }

    if (hasErrors) return;


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
    clearAllErrors();
    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail)) {
      setFieldError('email', 'Por favor, ingresa un correo electrónico válido');
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
    <div className="login-premium-page fade-in">
      {/* Decorative Background Elements */}
      <div className="login-bg-decor-1"></div>
      <div className="login-bg-decor-2"></div>

      <div className="login-top-nav">
        <button className="login-back-pill" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Inicio</span>
        </button>
        <DarkModeToggle />
      </div>


      <div className="login-container">
        <div className="login-visual-side">
          <div className="visual-content">
            <div className="visual-logo">
              <Leaf size={48} className="logo-icon-leaf" />
              <h1>BioMon</h1>
            </div>
            <p className="visual-tagline">Tu conexión vital con la naturaleza y el monitoreo forestal.</p>
            
            <div className="visual-features">
              <div className="feature-item">
                <ShieldCheck size={20} />
                <span>Acceso Seguro y Protegido</span>
              </div>
              <div className="feature-item">
                <Leaf size={20} />
                <span>Gestión de Especies Nativas</span>
              </div>

            </div>
          </div>
          <div className="visual-footer">
            <p>&copy; 2026 BioMon System. Todos los derechos reservados.</p>
          </div>
        </div>

        <div className="login-form-side">
          <div className="login-form-card premium-card">
            <div className="form-header">
              <h2>
                {isRecovering ? 'Recuperación' : isRegistering ? 'Únete a BioMon' : 'Bienvenido de nuevo'}
              </h2>
              <p className="text-muted">
                {isRecovering ? 'Restablece tu acceso de forma segura' : 
                 isRegistering ? 'Crea tu perfil y comienza a monitorear' : 
                 'Ingresa tus credenciales para continuar'}
              </p>
            </div>

            <form onSubmit={isRecovering ? handleRecovery : isRegistering ? handleRegister : handleLogin} noValidate>
              {!isRecovering && isRegistering && (
                <div className="form-row">
                  <div className="form-group-premium">
                    <label className="ui-label">Nombre Completo</label>
                    <div className="input-with-icon">
                      <User size={18} className="field-icon" />
                      <input
                        {...getInputProps('nombre')}
                        type="text"
                        className={`ui-input ${errors.nombre ? 'input-error' : ''}`}
                        value={nombre}
                        onChange={(e) => { setNombre(e.target.value); errors.nombre && clearAllErrors(); }}
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    <ErrorMessage error={errors.nombre} id="nombre-error" />
                  </div>

                  <div className="form-group-premium">
                    <label className="ui-label">Teléfono</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="field-icon" />
                      <input
                        {...getInputProps('telefono')}
                        type="tel"
                        className={`ui-input ${errors.telefono ? 'input-error' : ''}`}
                        value={telefono}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 8) setTelefono(val);
                          errors.telefono && clearAllErrors();
                        }}
                        placeholder="88888888"
                        maxLength="8"
                      />
                    </div>
                    <ErrorMessage error={errors.telefono} id="telefono-error" />
                  </div>
                </div>
              )}

              <div className="form-group-premium">
                <label className="ui-label">Correo Electrónico</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    {...getInputProps('email')}
                    type="email"
                    className={`ui-input ${errors.email ? 'input-error' : ''}`}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); errors.email && clearAllErrors(); }}
                    placeholder="tu@correo.com"
                  />
                </div>
                <ErrorMessage error={errors.email} id="email-error" />
              </div>

              {!isRecovering && (
                <div className="form-group-premium">
                  <div className="flex-between">
                    <label className="ui-label">Contraseña</label>
                    {!isRegistering && (
                      <button 
                        type="button" 
                        className="text-link-small" 
                        onClick={() => { setIsRecovering(true); clearAllErrors(); }}
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    )}
                  </div>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    <input
                      {...getInputProps('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`ui-input ${errors.password ? 'input-error' : ''}`}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); errors.password && clearAllErrors(); }}
                      placeholder="••••••••"
                      maxLength="15"
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage error={errors.password} id="password-error" />
                </div>
              )}

              {!isRecovering && isRegistering && (
                <div className="form-group-premium">
                  <label className="ui-label">Confirmar Contraseña</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    <input
                      {...getInputProps('confirmPassword')}
                      type={showPassword ? 'text' : 'password'}
                      className={`ui-input ${errors.confirmPassword ? 'input-error' : ''}`}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); errors.confirmPassword && clearAllErrors(); }}
                      placeholder="••••••••"
                      maxLength="15"
                    />
                  </div>
                  <ErrorMessage error={errors.confirmPassword} id="confirmPassword-error" />
                </div>
              )}

              <LoadingButton
                type="submit"
                className="ui-btn ui-btn--primary login-submit-btn"
                loading={loading}
                loadingText={
                  isRecovering ? 'Procesando…' :
                  isRegistering ? 'Creando cuenta…' :
                  'Autenticando…'
                }
              >
                <span>
                  {isRecovering ? 'Restablecer Acceso' : isRegistering ? 'Unirse Ahora' : 'Entrar al Sistema'}
                </span>
                {!loading && (
                  isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />
                )}
              </LoadingButton>
            </form>

            <div className="form-footer">
              <p>
                {isRecovering ? (
                  <>
                    ¿Ya recordaste tu acceso?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRecovering(false); clearAllErrors(); }}
                      className="text-link"
                    >
                      Volver al Login
                    </button>
                  </>
                ) : isRegistering ? (
                  <>
                    ¿Ya eres parte de BioMon?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegistering(false); clearAllErrors(); }}
                      className="text-link"
                    >
                      Inicia Sesión
                    </button>
                  </>
                ) : (
                  <>
                    ¿Eres nuevo por aquí?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegistering(true); clearAllErrors(); }}
                      className="text-link"
                    >
                      Crea una cuenta gratis
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPagesLogin;

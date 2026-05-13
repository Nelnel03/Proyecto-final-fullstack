import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import services from '../services/services';
import DarkModeToggle from './DarkModeToggle';
import { LoadingButton, ErrorMessage } from './ui';
import { useFormErrors, useToast } from '../hooks';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/Login.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Inicialización global de EmailJS
if (PUBLIC_KEY && !PUBLIC_KEY.includes("tu_public_key_aqui")) {
  emailjs.init(PUBLIC_KEY);
}

const enviarCorreo = async (nombre, correo, token) => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || 
        SERVICE_ID.includes("tu_") || TEMPLATE_ID.includes("tu_") || PUBLIC_KEY.includes("tu_")) {
      Swal.fire('Configuración Incompleta', 'Las llaves de EmailJS no están configuradas correctamente en el archivo .env.', 'warning');
      return false;
    }

    if (!nombre || !correo || !token) {
      console.error("Datos incompletos");
      return false;
    }

    const resetLink = `${window.location.origin}/reset-password?token=${token}`;

    const templateParams = {
      site_name: "BioMon ADI",
      site_logo_url: "URL_DE_TU_LOGO_SUBIDO_A_INTERNET", // Reemplazar con una URL pública
      user_name: nombre,
      user_email: correo,
      to_email: correo,
      email: correo,
      reset_link: resetLink
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("✅ Enviado:", response);
    return true;

  } catch (error) {
    console.error("❌ Error completo:", error);
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
  const [loading, setLoading] = useState(false);
  const { errors, setFieldError, clearAllErrors, getInputProps } = useFormErrors();
  const { success, error: toastError } = useToast();

  const navigate = useNavigate();

  const validateEmail = (emailValue) => {
    return String(emailValue)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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




      const usuarios = await services.getUsuarios();
      const saltedPass = btoa(trimmedPassword + "_SECURE_SALT");
      const user = usuarios.find(u => u.email === trimmedEmail && (u.password === trimmedPassword || u.password === saltedPass));

      if (user) {
        if (user.status === 'banned') {
          Swal.fire({
            title: 'Cuenta Cancelada',
            html: `<p>Tu acceso ha sido revocado por la administración.</p><div style="background:#f7f7f7; padding:15px; border-radius:10px; border-left:4px solid #ef4444; text-align:left; margin-top:15px;"><strong>Motivo:</strong><br/>"${user.motivoBan}"</div>`,
            icon: 'error'
          });
          setLoading(false);
          return;
        }

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

          if (newPassword) {
            const updatedUser = { ...user, password: newPassword, debeCambiarPassword: false };
            await services.putUsuarios(updatedUser, user.id);
            user.password = newPassword;
            user.debeCambiarPassword = false;
          } else {
            setLoading(false);
            return;
          }
        }

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
          } else {
            navigate('/user');
          }
        }, 1500);
      } else {
        setFieldError('general', 'Correo o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error en login:', err);
      toastError('Hubo un problema al conectar con el servidor');
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
      const usuarios = await services.getUsuarios();
      if (usuarios.find(u => u.email === email.trim())) {
        setFieldError('email', 'El correo ya está registrado');
        setLoading(false);
        return;
      }

      const newUser = {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        password: password.trim(),
        rol: 'user'
      };

      await services.postUsuarios(newUser);

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
      toastError('No se pudo completar el registro');
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
      const usuarios = await services.getUsuarios();
      const user = usuarios.find(u => u.email === trimmedEmail);

      if (!user) {
        setFieldError('email', 'No existe una cuenta con este correo');
        setLoading(false);
        return;
      }

      // Generar token y expiración (1 hora)
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiry = new Date(Date.now() + 3600000).toISOString();

      // Guardar token en el perfil del usuario
      const updatedUser = { ...user, resetToken: token, resetTokenExpiry: expiry };
      await services.putUsuarios(updatedUser, user.id);

      const envioExitoso = await enviarCorreo(user.nombre, user.email, token);

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
    } catch (error) {
      console.error("Error general:", error);
      toastError('Problema inesperado al conectarse.');
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

        {errors.general && (
          <div className="login-error-msg" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={isRecovering ? handleRecovery : isRegistering ? handleRegister : handleLogin} noValidate>
          {!isRecovering && isRegistering && (
            <>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); errors.nombre && clearAllErrors(); }}
                  required
                  placeholder="Ej: Juan Pérez"
                  {...getInputProps('nombre')}
                />
                <ErrorMessage error={errors.nombre} id="nombre-error" />
              </div>
              <div className="form-group">
                <label>Número de Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 8) setTelefono(val);
                    errors.telefono && clearAllErrors();
                  }}
                  required
                  placeholder="88888888"
                  maxLength="8"
                  {...getInputProps('telefono')}
                />
                <ErrorMessage error={errors.telefono} id="telefono-error" />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); errors.email && clearAllErrors(); }}
              placeholder="tu@correo.com"
              required
              {...getInputProps('email')}
            />
            <ErrorMessage error={errors.email} id="email-error" />
          </div>

          {!isRecovering && (
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); errors.password && clearAllErrors(); }}
                required
                placeholder="••••••••"
                maxLength="15"
                {...getInputProps('password')}
              />
              <ErrorMessage error={errors.password} id="password-error" />
            </div>
          )}

          {!isRecovering && isRegistering && (
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); errors.confirmPassword && clearAllErrors(); }}
                required
                placeholder="••••••••"
                maxLength="15"
                {...getInputProps('confirmPassword')}
              />
              <ErrorMessage error={errors.confirmPassword} id="confirmPassword-error" />
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
                  onClick={() => {
                    setIsRecovering(false);
                    clearAllErrors();
                  }}
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
                  onClick={() => {
                    setIsRegistering(false);
                    clearAllErrors();
                  }}
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
                  onClick={() => {
                    setIsRegistering(true);
                    clearAllErrors();
                  }}
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

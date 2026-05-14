import React, { useState, useEffect } from "react";
import services, { uploadImage } from '../../services/services.jsx';
import Swal from 'sweetalert2';
import { UserCheck, Heart, ShieldCheck, Camera, Loader2 } from 'lucide-react';
import '../../styles/UserProfile.css';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData) {
  const errors = {};
  const nombre = formData.nombre.trim();
  const email  = formData.email.trim();
  const pass   = formData.password;

  if (!nombre)             errors.nombre   = "El nombre es obligatorio.";
  else if (nombre.length < 3) errors.nombre = "El nombre debe tener al menos 3 caracteres.";
  else if (nombre.length > 60) errors.nombre = "El nombre no puede exceder 60 caracteres.";
  else if (/\d/.test(nombre)) errors.nombre = "El nombre no debe contener números.";

  if (!email)              errors.email    = "El correo es obligatorio.";
  else if (!email.includes("@") || !email.includes("."))
                           errors.email    = 'El correo debe contener "@" y "."';
  else if (!EMAIL_REGEX.test(email)) errors.email = "Formato de correo inválido.";

  if (!pass)               errors.password = "La contraseña es obligatoria.";
  else if (pass.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres.";
  else if (pass.length > 15) errors.password = "La contraseña no puede exceder 15 caracteres.";

  return errors;
}

function UserProfile({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    fotoPerfil: "",
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const [solicitud, setSolicitud] = useState(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);

  const handleAvatarClick = () => {
    document.getElementById('profile-avatar-input').click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoAvatar(true);
    try {
      const response = await services.postFotoPerfil(file);
      const url = response.fotoPerfil; // La URL viene en la respuesta del backend
      
      setFormData(prev => ({ ...prev, fotoPerfil: url }));
      
      // Actualizar el estado local y la sesión (el backend ya guardó la nueva foto)
      const updatedUser = { ...user, ...formData, fotoPerfil: url };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);

      Swal.fire({
        title: '¡Foto actualizada!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo subir la foto', 'error');
    } finally {
      setSubiendoAvatar(false);
    }
  };



  useEffect(() => {
    if (user) {
      setFormData({
        nombre:   user.nombre   || "",
        email:    user.email    || "",
        password: user.password || "",
        fotoPerfil: user.fotoPerfil || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const checkSolicitud = async () => {
      if (user && user.rol === 'user') {
        try {
          const solicitudes = await services.getSolicitudesVoluntariado();
          const miSolicitud = solicitudes.find(s => (s.usuario_id === user.id || s.userId === user.id) && (s.estado || '').toLowerCase() === 'pendiente');
          setSolicitud(miSolicitud);
        } catch (e) {
          console.error("Error al buscar solicitud:", e);
        }
      }
    };
    checkSolicitud();
  }, [user]);


  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    // Revalidar el campo modificado en tiempo real si ya fue tocado
    if (touched[e.target.name]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Marcar todos como tocados y validar
    const allTouched = { nombre: true, email: true, password: true };
    setTouched(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setMensaje({ tipo: "", texto: "" });
    try {
      const updatedUser = { ...user, ...formData };
      await services.putUsuarios(updatedUser, user.id);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);

      setMensaje({ tipo: "success", texto: "Perfil actualizado correctamente." });
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Hubo un error al actualizar el perfil." });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    touched[name] && errors[name] ? "input-error" : "";

  return (
    <div className="user-profile-container">
      <h2>Mi Perfil</h2>
      <p>Aquí puedes ver o editar tu información personal.</p>

      <div style={{ textAlign: "center", marginBottom: "20px", display: 'flex', justifyContent: 'center' }}>
        <div 
          className={`interactive-avatar ${subiendoAvatar ? 'loading' : ''}`}
          onClick={handleAvatarClick}
          style={{ width: '120px', height: '120px', borderRadius: '50%', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '3px solid var(--primary-color)' }}
        >
          {subiendoAvatar ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(0,0,0,0.1)' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary-color)" />
            </div>
          ) : formData.fotoPerfil ? (
            <img 
              src={formData.fotoPerfil} 
              alt="Perfil" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#fff' }}>
              {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <div className="avatar-overlay">
            <Camera size={24} color="#fff" />
          </div>
          <input 
            type="file" 
            id="profile-avatar-input" 
            accept="image/*" 
            onChange={handleAvatarChange} 
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      {/* Sección Voluntariado (ARRIBA) */}
      {user.rol === 'user' && !solicitud && (
        <div className="volunteer-application-box" style={{ marginBottom: '2rem' }}>
          <div className="volunteer-icon">
            <Heart size={32} color="#1a4d2e" />
          </div>
          <div className="volunteer-text">
            <h3>Conviértete en Voluntario</h3>
            <p>Sube de nivel tu impacto. Podrás registrar árboles, reportar incidentes y mucho más.</p>
          </div>
          <button 
            type="button" 
            className="btn-apply-volunteer"
            onClick={() => onTabChange && onTabChange('solicitud_voluntariado')}
          >
            Postularse Ahora
          </button>
        </div>
      )}

      {solicitud && solicitud.estado === 'pendiente' && (
        <div className="volunteer-application-box pending" style={{ marginBottom: '2rem', border: '1px dashed #f59e0b', background: '#fffbeb' }}>
          <div className="volunteer-icon">
            <UserCheck size={32} color="#d97706" />
          </div>
          <div className="volunteer-text">
            <h3 style={{ color: '#92400e' }}>Solicitud en Revisión</h3>
            <p style={{ color: '#92400e' }}>Tu solicitud como voluntario está pendiente de aprobación por el administrador.</p>
          </div>
        </div>
      )}


      {user.rol === 'voluntario' && (
        <div className="volunteer-status-badge" style={{ marginBottom: '2rem' }}>
          <ShieldCheck size={20} color="#059669" />
          <span>Ya eres parte del equipo de Voluntarios</span>
        </div>
      )}


      <form onSubmit={handleSubmit} className="profile-form" noValidate>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre: <span className="required-star">*</span></label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("nombre")}
            maxLength={60}
            placeholder="Ej: Juan Pérez"
          />
          {touched.nombre && errors.nombre && (
            <span className="field-error-msg">⚠ {errors.nombre}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Correo Electrónico: <span className="required-star">*</span></label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("email")}
            placeholder="tu@correo.com"
          />
          {touched.email && errors.email && (
            <span className="field-error-msg">⚠ {errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Contraseña: <span className="required-star">*</span></label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("password")}
            placeholder="••••••"
            maxLength={15}
          />
          {touched.password && errors.password && (
            <span className="field-error-msg">⚠ {errors.password}</span>
          )}
          <span className="password-hint">
            Mínimo 6 caracteres, máximo 15.
          </span>
        </div>


        <button type="submit" disabled={loading} className={`btn-save ${loading ? 'opacity-50' : ''}`}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>


  );
}

export default UserProfile;

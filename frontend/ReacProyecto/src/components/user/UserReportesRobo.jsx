import React, { useState } from "react";
import services from '../../services/services.jsx';
import { MapPin, User, FileText, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import '../../styles/user/UserReports.css';

function validate(reporte) {
  const errors = {};
  const tipo_arbol  = reporte.tipo_arbol.trim();
  const ubicacion   = reporte.ubicacion.trim();
  const descripcion = reporte.descripcion.trim();

  if (!tipo_arbol)                errors.tipo_arbol  = "El tipo de árbol es obligatorio.";
  else if (tipo_arbol.length < 3)  errors.tipo_arbol  = "Debe tener al menos 3 caracteres.";
  else if (tipo_arbol.length > 100) errors.tipo_arbol = "No puede exceder 100 caracteres.";

  if (!ubicacion)                  errors.ubicacion   = "La ubicación es obligatoria.";
  else if (ubicacion.length < 5)   errors.ubicacion   = "La ubicación debe tener al menos 5 caracteres.";

  if (!descripcion)                errors.descripcion = "La descripción es obligatoria.";
  else if (descripcion.length < 15) errors.descripcion = "La descripción debe tener al menos 15 caracteres.";

  return errors;
}

function UserReportesRobo({ user, onDone }) {
  const [reporte, setReporte] = useState({
    tipo_arbol:  "",
    ubicacion:   "",
    descripcion: "",
  });


  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [estadoEnvio, setEstadoEnvio] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    const updated = { ...reporte, [e.target.name]: e.target.value };
    setReporte(updated);
    if (touched[e.target.name]) {
      const newErr = validate(updated);
      setErrors((prev) => ({ ...prev, [e.target.name]: newErr[e.target.name] }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const newErr = validate(reporte);
    setErrors((prev) => ({ ...prev, [e.target.name]: newErr[e.target.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ tipo_arbol: true, ubicacion: true, descripcion: true });
    const newErr = validate(reporte);
    setErrors(newErr);
    if (Object.keys(newErr).length > 0) return;

    const confirm = await Swal.fire({
      title: '¿Confirmar Envío?',
      text: '¿Estás seguro de que deseas enviar este reporte de sustracción? El equipo de control será alertado de inmediato.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, enviar reporte',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    setEstadoEnvio({ tipo: "", texto: "" });
    try {
      const nuevoReporte = {
        ...reporte,
        userId: user?.id || 'anonimo',
        userName: user?.nombre || 'Anónimo',
        userEmail: user?.email || 'Sin correo',
        fecha: new Date().toISOString(),
        estado: "Pendiente"
      };
      await services.postReportesRobados(nuevoReporte);
      
      Swal.fire({
        title: 'Reporte Enviado',
        text: 'Tu reporte de árbol robado ha sido registrado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });

      setEstadoEnvio({ tipo: "success", texto: "Reporte de árbol robado enviado exitosamente." });

      setReporte({ tipo_arbol: "", ubicacion: "", descripcion: "" }); 
      if (onDone) setTimeout(onDone, 1500);

      setErrors({});
      setTouched({});
    } catch (error) {
      console.error(error);
      
      Swal.fire({
        title: 'Error',
        text: 'Hubo un inconveniente al enviar el reporte. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });

      setEstadoEnvio({ tipo: "error", texto: "Hubo un error al enviar el reporte." });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    touched[name] && errors[name] ? "input-error" : "";

  return (
    <div className="user-reports-container container-danger">
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div className="flex-center" style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444' 
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="title-danger" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Reportar Árbol Robado</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Ayúdanos a proteger el corredor biológico</p>
        </div>
      </div>
      <p style={{ marginBottom: '2rem', fontSize: '0.92rem', lineHeight: 1.5 }}>
        Utiliza este formulario para reportar un árbol que ha sido sustraído o talado ilegalmente. Cada campo está estructurado para registrar datos precisos del incidente.
      </p>

      {estadoEnvio.texto && (
        <div className={`mensaje ${estadoEnvio.tipo === "success" ? "success-alt" : "error-alt"}`} style={{ borderRadius: '12px', fontWeight: 600 }}>
          {estadoEnvio.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form" noValidate>
        {/* Tipo de árbol */}
        <div className="form-card-section form-species-card">
          <div className="form-section-header">
            <User size={18} className="robo-icon-green" style={{ color: '#10b981' }} />
            <span className="form-section-title">👤 Especie / Tipo de Árbol</span>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Tipo de Árbol (o Nombre): <span className="required-star">*</span></label>
            <input
              type="text"
              name="tipo_arbol"
              value={reporte.tipo_arbol}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldClass("tipo_arbol")}
              placeholder="Ej: Almendro de playa, Roble, etc."
              maxLength={100}
              style={{ borderRadius: '10px' }}
            />
            {touched.tipo_arbol && errors.tipo_arbol && (
              <span className="field-error-msg">⚠ {errors.tipo_arbol}</span>
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div className="form-card-section form-location-card">
          <div className="form-section-header">
            <MapPin size={18} className="robo-icon-orange" style={{ color: '#f59e0b' }} />
            <span className="form-section-title">📍 Ubicación del Incidente</span>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Ubicación del Árbol (Dirección o Coordenadas): <span className="required-star">*</span></label>
            <input
              type="text"
              name="ubicacion"
              value={reporte.ubicacion}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldClass("ubicacion")}
              placeholder="Ej: Entrada norte, junto al sendero principal"
              style={{ borderRadius: '10px' }}
            />
            {touched.ubicacion && errors.ubicacion && (
              <span className="field-error-msg">⚠ {errors.ubicacion}</span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="form-card-section form-description-card">
          <div className="form-section-header">
            <FileText size={18} className="robo-icon-grey" style={{ color: '#6b7280' }} />
            <span className="form-section-title">📝 Descripción del Reporte</span>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Reseña o Descripción Detallada: <span className="required-star">*</span></label>
            <textarea
              name="descripcion"
              value={reporte.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldClass("descripcion")}
              placeholder="Agrega cualquier contexto, fecha aproximada del suceso o detalles relevantes..."
              rows="5"
              style={{ borderRadius: '10px' }}
            />
            {touched.descripcion && errors.descripcion && (
              <span className="field-error-msg">⚠ {errors.descripcion}</span>
            )}
            <span className="char-counter">
              {reporte.descripcion.length} caracteres (mínimo 15)
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-send btn-danger-report"
          style={{ borderRadius: '12px' }}
        >
          {loading ? "Enviando Reporte..." : "Enviar Reporte de Robo"}
        </button>
      </form>
    </div>
  );
}

export default UserReportesRobo;

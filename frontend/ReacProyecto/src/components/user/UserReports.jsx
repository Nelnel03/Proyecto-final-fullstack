import React, { useState } from "react";
import services from '../../services/services.jsx';
import '../../styles/UserReports.css';

function validate(reporte) {
  const errors = {};
  const asunto = reporte.asunto.trim();
  const mensaje = reporte.mensaje.trim();

  if (!asunto)                  errors.asunto  = "El asunto es obligatorio.";

  if (!mensaje)                 errors.mensaje = "El mensaje es obligatorio.";
  else if (mensaje.length < 15) errors.mensaje = "El mensaje debe tener al menos 15 caracteres.";

  return errors;
}

function UserReports({ user, onDone }) {
  const [reporte, setReporte] = useState({
    asunto: "",
    mensaje: "",
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
    setTouched({ asunto: true, mensaje: true });
    const newErr = validate(reporte);
    setErrors(newErr);
    if (Object.keys(newErr).length > 0) return;

    setLoading(true);
    setEstadoEnvio({ tipo: "", texto: "" });
    try {
      const nuevoReporte = {
        ...reporte,
        userId:    user.id,
        userName:  user.nombre,
        userEmail: user.email,
        fecha:     new Date().toISOString(),
        estado:    "Pendiente",
      };
      await services.postReportes(nuevoReporte);
      setEstadoEnvio({ tipo: "success", texto: "Reporte enviado exitosamente." });

      setReporte({ asunto: "", mensaje: "" }); 
      if (onDone) setTimeout(onDone, 1500);

    } catch (error) {
      console.error(error);
      setEstadoEnvio({ tipo: "error", texto: "Hubo un error al enviar el reporte." });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    touched[name] && errors[name] ? "input-error" : "";

  return (
    <div className="user-reports-container">
      <h2>Enviar Reporte o Mensaje</h2>
      <p>Utiliza este medio para contactar al administrador y reportar problemas o dudas.</p>

      {estadoEnvio.texto && (
        <div className={`mensaje ${estadoEnvio.tipo}`}>{estadoEnvio.texto}</div>
      )}

      <form onSubmit={handleSubmit} className="report-form" noValidate>
        {/* Asunto */}
        <div className="form-group">
          <label>Asunto: <span className="required-star">*</span></label>
          <select
            name="asunto"
            value={reporte.asunto}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("asunto")}
          >
            <option value="">Seleccione un asunto...</option>
            <option value="árbol seco">árbol seco</option>
            <option value="mucha basura al rededor del corredor">mucha basura al rededor del corredor</option>
            <option value="animal muerto en la zona">animal muerto en la zona</option>
            <option value="falta de mantenimiento">falta de mantenimiento</option>
          </select>
          {touched.asunto && errors.asunto && (
            <span className="field-error-msg">⚠ {errors.asunto}</span>
          )}
        </div>

        {/* Mensaje */}
        <div className="form-group">
          <label>Mensaje: <span className="required-star">*</span></label>
          <textarea
            name="mensaje"
            value={reporte.mensaje}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("mensaje")}
            placeholder="Describe detalladamente el motivo de tu mensaje..."
            rows="5"
          />
          {touched.mensaje && errors.mensaje && (
            <span className="field-error-msg">⚠ {errors.mensaje}</span>
          )}
          <span className="char-counter">
            {reporte.mensaje.length} caracteres (mínimo 15)
          </span>
        </div>

        <button type="submit" disabled={loading} className="btn-send">
          {loading ? "Enviando..." : "Enviar Reporte"}
        </button>
      </form>
    </div>
  );
}

export default UserReports;

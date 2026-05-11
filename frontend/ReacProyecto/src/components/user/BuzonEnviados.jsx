import React, { useEffect, useState } from "react";
import services from "../../services/services.jsx";
import "../../styles/UserReports.css";
import "../../styles/BuzonEnviados.css";

// Formatea una fecha ISO a formato legible en español
function formatFecha(isoString) {
  if (!isoString) return "—";
  const fecha = new Date(isoString);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Badge de estado con color según valor
function EstadoBadge({ estado }) {
  const colores = {
    Pendiente:  { bg: "#fef9c3", color: "#92400e", border: "#fde68a" },
    Revisado:   { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
    Resuelto:   { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
    Rechazado:  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  };
  const estilo = colores[estado] || colores["Pendiente"];
  return (
    <span
      className="buzon-estado-badge"
      style={{
        backgroundColor: estilo.bg,
        color: estilo.color,
        border: `1px solid ${estilo.border}`,
      }}
    >
      {estado || "Pendiente"}
    </span>
  );
}

function BuzonEnviados({ user }) {
  const [reportes, setReportes] = useState([]);
  const [reportesRobo, setReportesRobo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // "todos" | "soporte" | "robo"

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const [todos, robos] = await Promise.all([
          services.getReportes(),
          services.getReportesRobados(),
        ]);
        // Filtrar solo los del usuario actual
        setReportes((todos || []).filter((r) => r.userId === user?.id));
        setReportesRobo((robos || []).filter((r) => r.userId === user?.id));
      } catch (err) {
        console.error("Error al cargar buzón:", err);
      } finally {
        setCargando(false);
      }
    };
    if (user?.id) cargar();
  }, [user]);

  // Unir y ordenar por fecha descendente
  const mensajesSoporte = reportes.map((r) => ({
    ...r,
    titulo: r.asunto || "(Sin asunto)",
    tipo: "Soporte",
    tipoBadgeBg: "#ede9fe",
    tipoBadgeColor: "#5b21b6",
    tipoBadgeBorder: "#c4b5fd",
  }));

  const mensajesRobo = reportesRobo.map((r) => ({
    ...r,
    titulo: `Árbol robado: ${r.tipo_arbol || "—"}`,
    tipo: "Robo",
    tipoBadgeBg: "#fee2e2",
    tipoBadgeColor: "#991b1b",
    tipoBadgeBorder: "#fca5a5",
  }));

  const todos = [...mensajesSoporte, ...mensajesRobo].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  const listaMostrar =
    filtro === "soporte"
      ? mensajesSoporte
      : filtro === "robo"
      ? mensajesRobo
      : todos;

  return (
    <div className="user-reports-container container-wide">
      {/* Encabezado */}
      <h2 className="buzon-enviados-title">
        Buzón de Enviados
      </h2>
      <p>Aquí puedes ver todos los mensajes y reportes que has enviado al administrador.</p>

      {/* Filtros */}
      <div className="buzon-filters">
        {[
          { key: "todos", label: "Todos" },
          { key: "soporte", label: "Soporte" },
          { key: "robo",    label: "Robos" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`filter-buzon-btn ${filtro === key ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {cargando ? (
        <div className="buzon-loading">
          Cargando mensajes...
        </div>
      ) : listaMostrar.length === 0 ? (
        <div className="buzon-empty">
          <div className="buzon-empty-icon"></div>
          <p className="buzon-empty-text">No hay mensajes enviados aún.</p>
        </div>
      ) : (
        <div className="buzon-list">
          {listaMostrar.map((item) => (
            <div
              key={`${item.tipo}-${item.id}`}
              className="buzon-item-card"
            >
              {/* Fila superior: título + badges */}
              <div className="buzon-item-top">
                <span className="buzon-item-title">
                  {item.titulo}
                </span>
                <div className="buzon-item-badges">
                  {/* Tipo badge */}
                  <span
                    className="buzon-tipo-badge"
                    style={{
                      backgroundColor: item.tipoBadgeBg,
                      color: item.tipoBadgeColor,
                      border: `1px solid ${item.tipoBadgeBorder}`,
                    }}
                  >
                    {item.tipo}
                  </span>
                  <EstadoBadge estado={item.estado} />
                </div>
              </div>

              {/* Fecha */}
              <div className="buzon-item-date">
                Enviado el {formatFecha(item.fecha)}
              </div>

              {/* Detalle opcional */}
              {item.mensaje && (
                <p className="buzon-item-preview">
                  {item.mensaje.length > 120 ? item.mensaje.slice(0, 120) + "…" : item.mensaje}
                </p>
              )}
              {item.descripcion && (
                <p className="buzon-item-preview">
                  {item.descripcion.length > 120 ? item.descripcion.slice(0, 120) + "…" : item.descripcion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuzonEnviados;

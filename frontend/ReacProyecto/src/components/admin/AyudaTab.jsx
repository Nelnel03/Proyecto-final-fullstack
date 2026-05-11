import React from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Info,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import '../../styles/AdminControlCenter.css';

function AyudaTab() {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      pregunta: "¿Cómo registro una nueva especie de árbol?",
      respuesta: "Dirígete a la pestaña 'Gestión de Especies' y haz clic en 'Agregar Nueva Especie'. Completa el formulario con el nombre científico, familia, altura y una descripción detallada. No olvides subir una imagen clara para facilitar la identificación."
    },
    {
      pregunta: "¿Qué significa el estado 'Emergencia' en el mapa?",
      respuesta: "Indica que un sector requiere atención inmediata, usualmente debido a reportes de plagas, falta de riego o daños estructurales detectados por los sensores o voluntarios en campo."
    },
    {
      pregunta: "¿Cómo convierto un usuario regular en voluntario?",
      respuesta: "En la sección 'Gestión de Usuarios', busca al usuario y haz clic en 'Convertir a Voluntario'. El sistema te pedirá asignar un área de trabajo y un número de contacto."
    },
    {
      pregunta: "¿Cómo descargo los reportes de reforestación?",
      respuesta: "Actualmente puedes visualizar las estadísticas en tiempo real en el 'Panel de Control'. Para exportar datos a PDF/Excel, estamos trabajando en la integración de la pestaña 'Reportes Especializados'."
    }
  ];

  const secciones = [
    {
      titulo: 'Guía de Inicio Rápido',
      icon: <BookOpen className="text-emerald-500" />,
      contenido: 'Bienvenido al panel BioMon ADI. Aquí puedes monitorear el crecimiento del corredor biológico, gestionar el inventario de árboles y coordinar a los voluntarios.'
    },
    {
      titulo: 'Protocolo de Seguridad',
      icon: <ShieldCheck className="text-emerald-500" />,
      contenido: 'Todos los cambios en el censo deben ser verificados. Si detectas un error en los datos de un sensor, utiliza la función de edición en el Panel de Control.'
    },
    {
      titulo: 'Soporte Técnico',
      icon: <MessageCircle className="text-emerald-500" />,
      contenido: 'Si experimentas problemas con la plataforma, contacta al equipo de IT a través del correo soporte@biomonadi.org o abre un ticket en el Buzón de Sugerencias.'
    }
  ];

  return (
    <div className="admin-content-view">
      <div className="admin-section-header-flex">
        <div>
          <h2 className="admin-section-title-white">Centro de Ayuda y Soporte</h2>
          <p className="admin-section-subtitle-green">Guías, preguntas frecuentes y recursos para administradores</p>
        </div>
        <HelpCircle size={48} className="text-emerald-500 opacity-20" />
      </div>

      <div className="admin-stats-grid">
        {secciones.map((sec, idx) => (
          <div key={idx} className="admin-stat-main-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                {sec.icon}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--admin-text-main)' }}>{sec.titulo}</h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
              {sec.contenido}
            </p>
          </div>
        ))}
      </div>

      <div className="admin-form-card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--admin-text-main)' }}>
          <Lightbulb size={20} className="text-amber-500" />
          Preguntas Frecuentes (FAQs)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              style={{ 
                border: '1px solid var(--admin-border-color)', 
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ 
                  width: '100%', 
                  padding: '1rem 1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: openFaq === idx ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{faq.pregunta}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--admin-border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--admin-text-muted)', lineHeight: '1.6' }}>
                    {faq.respuesta}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-tracking-panel" style={{ marginTop: '1rem' }}>
        <div className="admin-tracking-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            ¿No encuentras lo que buscas?
          </h3>
          <button 
            className="admin-btn-user-submit" 
            style={{ width: 'auto', padding: '8px 20px' }}
            onClick={() => window.location.href = 'mailto:soporte@biomonadi.org'}
          >
            Contactar Soporte
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
          Nuestro equipo de respuesta rápida está disponible de Lunes a Viernes (8:00 AM - 5:00 PM).
        </p>
      </div>
    </div>
  );
}

export default AyudaTab;

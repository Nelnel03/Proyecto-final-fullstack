import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Info,
  Lightbulb,
  AlertCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import '../../styles/admin/AdminControlCenter.css';

function AyudaTab() {
  const [openFaq, setOpenFaq] = useState(null);

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
      icon: <BookOpen size={24} />,
      color: 'var(--ui-primary)',
      bg: 'rgba(58, 90, 64, 0.1)',
      contenido: 'Bienvenido al panel BioMon. Aquí puedes monitorear el crecimiento del corredor biológico, gestionar el inventario de árboles y coordinar a los voluntarios.'
    },
    {
      titulo: 'Protocolo de Seguridad',
      icon: <ShieldCheck size={24} />,
      color: 'var(--ui-info)',
      bg: 'rgba(59, 130, 246, 0.1)',
      contenido: 'Todos los cambios en el censo deben ser verificados. Si detectas un error en los datos, utiliza la función de edición en el Panel de Control.'
    },
    {
      titulo: 'Soporte Técnico',
      icon: <MessageCircle size={24} />,
      color: 'var(--ui-success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      contenido: 'Si experimentas problemas con la plataforma, contacta al equipo de IT o abre un ticket detallado en el Buzón de Sugerencias.'
    }
  ];

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card flex-between" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0 }}>Centro de Soporte BioMon</h2>
          <p className="text-muted">Recursos, guías y asistencia técnica para administradores del ecosistema</p>
        </div>
        <HelpCircle size={60} className="text-muted" style={{ opacity: 0.1 }} />
      </div>

      <div className="admin-stats-grid" style={{ marginBottom: '2.5rem' }}>
        {secciones.map((sec, idx) => (
          <div key={idx} className="premium-card fade-in" style={{ animationDelay: `${idx * 0.1}s`, padding: '2rem' }}>
            <div className="flex-center" style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: sec.bg, 
              color: sec.color,
              marginBottom: '1.5rem'
            }}>
              {sec.icon}
            </div>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: 800 }}>{sec.titulo}</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {sec.contenido}
            </p>
            <button className="ui-btn ui-btn--ghost" style={{ marginTop: '1.5rem', padding: '0', fontSize: '0.85rem', fontWeight: 700 }}>
              Leer más <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        ))}
      </div>

      <div className="premium-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--ui-warning)' }}>
            <Lightbulb size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Preguntas Frecuentes</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="premium-card"
              style={{ 
                background: openFaq === idx ? 'rgba(58, 90, 64, 0.03)' : 'rgba(0,0,0,0.02)',
                border: openFaq === idx ? '1px solid var(--ui-primary-bg)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '1rem', color: openFaq === idx ? 'var(--ui-primary)' : 'inherit' }}>{faq.pregunta}</span>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: openFaq === idx ? 'var(--ui-primary)' : 'rgba(0,0,0,0.05)',
                  color: openFaq === idx ? '#fff' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              {openFaq === idx && (
                <div className="fade-in" style={{ padding: '0 1.5rem 1.5rem', marginTop: '-0.5rem' }}>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', marginBottom: '1rem' }}></div>
                  <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {faq.respuesta}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="premium-card" style={{ 
        padding: '2.5rem', 
        background: 'linear-gradient(135deg, #1f3b2b 0%, #1a2f23 100%)',
        color: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 0.8rem', fontSize: '1.5rem', fontWeight: 900 }}>
            <AlertCircle size={28} className="text-amber-400" />
            ¿Necesitas asistencia directa?
          </h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '1rem', lineHeight: 1.6 }}>
            Nuestro equipo de soporte técnico está disponible para resolver dudas complejas o fallos del sistema en tiempo real.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button 
             className="ui-btn" 
             style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
             onClick={() => window.open('https://biomonadi.org/docs', '_blank')}
           >
             <BookOpen size={18} style={{ marginRight: '8px' }} /> Documentación
           </button>
           <button 
             className="ui-btn" 
             style={{ background: '#fff', color: 'var(--color-bosque-oscuro)', fontWeight: 800 }}
             onClick={() => window.location.href = 'mailto:soporte@biomonadi.org'}
           >
             <MessageCircle size={18} style={{ marginRight: '8px' }} /> Contactar Ahora
           </button>
        </div>
      </div>
    </div>
  );
}

export default AyudaTab;

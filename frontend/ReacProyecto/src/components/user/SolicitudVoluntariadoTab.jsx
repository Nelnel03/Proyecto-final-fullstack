import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { UserCheck, Clock, Send, ShieldCheck, Mail } from 'lucide-react';
import '../../styles/UserReports.css';

function SolicitudVoluntariadoTab({ user, onDone }) {
  const [loading, setLoading] = useState(false);
  const [estaSolicitando, setEstaSolicitando] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [diasRestantes, setDiasRestantes] = useState(0);

  useEffect(() => {
    checkSolicitud();
  }, [user?.id]);

  const checkSolicitud = async () => {
    if (!user?.id) return;
    try {
      const solicitudes = await services.getSolicitudesVoluntariado();
      // Obtener la más reciente
      const misSolicitudes = (solicitudes || [])
        .filter(s => s.userId === user.id)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      const miSolicitud = misSolicitudes[0];
      
      if (miSolicitud) {
        if (miSolicitud.estado === 'Rechazada') {
          const fechaRechazo = new Date(miSolicitud.fecha);
          const ahora = new Date();
          const diffMs = ahora - fechaRechazo;
          const diffDias = diffMs / (1000 * 60 * 60 * 24);
          
          if (diffDias < 15) {
            setDiasRestantes(Math.ceil(15 - diffDias));
            setSolicitudEnviada(miSolicitud);
          } else {
            // Ya pasaron los 15 días, puede volver a intentar
            setSolicitudEnviada(null);
          }
        } else {
          setSolicitudEnviada(miSolicitud);
        }
      }
    } catch (err) {
      console.error("Error al verificar solicitudes:", err);
    }
  };

  const handleEnviarSolicitud = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      Swal.fire('Atención', 'Por favor describe por qué te gustaría ser voluntario.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const nuevaSolicitud = {
        userId: user.id,
        userName: user.nombre,
        userEmail: user.email,
        mensaje: mensaje.trim(),
        fecha: new Date().toISOString(),
        estado: 'Pendiente'
      };
      await services.postSolicitudVoluntariado(nuevaSolicitud);
      setSolicitudEnviada(nuevaSolicitud);
      setDiasRestantes(0);
      Swal.fire({
        title: 'Postulación Enviada',
        text: 'Tu solicitud ha sido recibida correctamente. El administrador la revisará pronto.',
        icon: 'success',
        confirmButtonColor: '#064e3b'
      });
    } catch (err) {
      Swal.fire('Error', 'No se pudo enviar la solicitud. Intenta de nuevo más tarde.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (solicitudEnviada) {
    return (
      <div className={`user-reports-container ${solicitudEnviada.estado === 'Rechazada' ? 'container-error' : 'container-success'}`}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="status-badge" style={{ 
            display: 'inline-flex', padding: '1rem', marginBottom: '1.5rem',
            backgroundColor: solicitudEnviada.estado === 'Pendiente' ? '#fef9c3' : (solicitudEnviada.estado === 'Aprobada' ? '#d1fae5' : '#fee2e2'),
            color: solicitudEnviada.estado === 'Pendiente' ? '#92400e' : (solicitudEnviada.estado === 'Aprobada' ? '#065f46' : '#991b1b'),
            borderRadius: '50%'
          }}>
            {solicitudEnviada.estado === 'Pendiente' ? <Clock size={40} /> : <ShieldCheck size={40} />}
          </div>
          
          <h2 style={{ color: solicitudEnviada.estado === 'Pendiente' ? '#92400e' : (solicitudEnviada.estado === 'Aprobada' ? '#065f46' : '#991b1b') }}>
            {solicitudEnviada.estado === 'Pendiente' && 'Postulación en Revisión'}
            {solicitudEnviada.estado === 'Aprobada' && '¡Solicitud Aprobada!'}
            {solicitudEnviada.estado === 'Rechazada' && 'Solicitud Rechazada'}
          </h2>

          {solicitudEnviada.estado === 'Rechazada' && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#c2410c', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '10px' }}>
                <Clock size={24} />
                <span>Tiempo de espera obligatorio</span>
              </div>
              <p style={{ color: '#9a3412', marginBottom: '15px' }}>
                Lo sentimos, tu solicitud no fue aceptada en esta ocasión. Podrás postularte nuevamente en:
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ea580c' }}>
                {diasRestantes} {diasRestantes === 1 ? 'Día' : 'Días'}
              </div>
            </div>
          )}

          {solicitudEnviada.estado !== 'Rechazada' && (
            <p style={{ maxWidth: '500px', margin: '1rem auto' }}>
              {solicitudEnviada.estado === 'Pendiente' 
                ? 'Tu solicitud para ser Guardián del Bosque está siendo evaluada por nuestro equipo administrativo. Serás notificado una vez que se tome una decisión.'
                : '¡Felicidades! Ya eres un voluntario oficial. Ahora tienes acceso a todas las herramientas de Guardián del Bosque.'}
            </p>
          )}

          <div className="message-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left', marginTop: '1.5rem' }}>
            <p className="meta-text"><Mail size={12} /> Tu mensaje enviado:</p>
            <p style={{ fontStyle: 'italic', color: '#64748b' }}>"{solicitudEnviada.mensaje}"</p>
          </div>

          <button onClick={onDone} className="btn-send" style={{ marginTop: '2rem', maxWidth: '200px', alignSelf: 'center' }}>
            Ir a mis solicitudes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reports-container">
      <div className="section-header-flex" style={{marginBottom: '1rem'}}>
        <h2>Postularme como Voluntario</h2>
        <UserCheck color="var(--color-bosque-helecho)" />
      </div>
      <p>Conviértete en un <strong>Guardián del Bosque</strong>. Los voluntarios tienen acceso a herramientas avanzadas de siembra, monitoreo y gestión de especies en nuestro corredor biológico.</p>
      
      <div className="impact-banner" style={{background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)', padding: '1.5rem', borderRadius: '15px', color: 'white', marginBottom: '1.5rem', border: 'none'}}>
        <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Beneficios del Voluntariado:</h3>
        <ul style={{fontSize: '0.9rem', listStyle: 'disc', paddingLeft: '1.2rem'}}>
          <li>Registro oficial de labores de conservación.</li>
          <li>Acceso a herramientas avanzadas en la plataforma.</li>
          <li>Certificación digital de horas de impacto ambiental.</li>
          <li>Acceso prioritario a expediciones guiadas.</li>
        </ul>
      </div>

      <form onSubmit={handleEnviarSolicitud} className="report-form">
        <div className="form-group">
          <label>¿Por qué te gustaría ser parte de nuestro equipo de voluntarios? *</label>
          <textarea 
            placeholder="Cuéntanos sobre tu interés, experiencia previa o cómo planeas contribuir al bosque..."
            rows="5"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            minLength={20}
          />
        </div>
        
        <button type="submit" className="btn-send" disabled={loading} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
          {loading ? 'Procesando...' : <><Send size={18} /> Enviar Mi Candidatura</>}
        </button>
        <p className="meta-text" style={{marginTop: '1rem', textAlign: 'center'}}>
          * Al enviar tu solicitud, aceptas que el administrador revise tu historial de actividad en BioMon.
        </p>
      </form>
    </div>
  );
}

export default SolicitudVoluntariadoTab;

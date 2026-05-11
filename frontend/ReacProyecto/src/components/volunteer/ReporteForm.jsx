import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { CalendarDays, Clock, CheckCircle2, Link } from 'lucide-react';
import '../../styles/ReporteForm.css';

function ReporteForm({ user, onReportSubmitted, tareaAsignada, onCancel, busqueda }) {
  const [fase, setFase] = useState('inicio'); // 'inicio', 'revision'
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [pruebas, setPruebas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [loadingTareas, setLoadingTareas] = useState(true);

  useEffect(() => {
    if (tareaAsignada) {
      setTareaSeleccionada({ titulo: tareaAsignada.tipoTarea, horas: tareaAsignada.horas, dias: 'Asignado' });
      setFase('revision');
    } else {
      cargarTareasDisponibles();
    }
  }, [tareaAsignada]);

  const cargarTareasDisponibles = async () => {
    setLoadingTareas(true);
    try {
      const data = await services.getTareasDisponibles();
      setTareas(data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    } finally {
      setLoadingTareas(false);
    }
  };

  const handleSeleccionar = async (t) => {
    const result = await Swal.fire({
      title: 'Solicitar Tarea',
      text: `¿Estás seguro de solicitar la labor "${t.titulo}"? El administrador decidirá si aprobarla y te asignará la fecha correspondiente.`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, enviar solicitud',
      confirmButtonColor: '#10b981'
    });

    if (result.isConfirmed) {
      setEnviando(true);
      const nuevoReporte = {
        voluntarioId: user?.id || 'anonimo',
        voluntarioNombre: user?.nombre || 'Anónimo',
        voluntarioEmail: user?.email || 'Sin correo',
        tipoTarea: t.titulo,
        horaInicio: 'Predefinido',
        horaFin: 'Predefinido',
        horas: parseFloat(t.horas),
        tareas: `Solicitud de asignación: ${t.titulo}`,
        pruebas: '',
        fecha: '-',
        timestamp: new Date().toISOString(),
        estado: 'solicitado'
      };

      try {
        await services.postReporteVoluntariado(nuevoReporte);
        Swal.fire('¡Enviada!', 'Tu solicitud está pendiente de aprobación por el administrador.', 'success');
        if (onReportSubmitted) onReportSubmitted();
      } catch (error) {
        Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
      } finally {
        setEnviando(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pruebas) {
      Swal.fire('Atención', 'Debes adjuntar un enlace de evidencia de tu trabajo.', 'warning');
      return;
    }

    setEnviando(true);

    const reporteActualizado = {
      ...(tareaAsignada || {}),
      voluntarioId: user?.id || 'anonimo',
      voluntarioNombre: user?.nombre || 'Anónimo',
      voluntarioEmail: user?.email || 'Sin correo',
      tipoTarea: tareaSeleccionada.titulo,
      horaInicio: 'Predefinido',
      horaFin: 'Predefinido',
      horas: parseFloat(tareaSeleccionada.horas),
      tareas: comentarios || `Trabajo asignado: ${tareaSeleccionada.titulo}`,
      pruebas,
      visto: false,
      estado: 'enviado'
    };

    try {
      if (tareaAsignada) {
        await services.putReporteVoluntariado(reporteActualizado, tareaAsignada.id);
      } else {
        await services.postReporteVoluntariado({ ...reporteActualizado, fecha: new Date().toISOString().split('T')[0], timestamp: new Date().toISOString() });
      }
      Swal.fire('¡Éxito!', 'Tu evidencia ha sido enviada al administrador para su validación final.', 'success');
      if (onReportSubmitted) onReportSubmitted();
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar el reporte.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    if (tareaAsignada && onCancel) {
      onCancel();
    } else {
      setFase('inicio');
      setTareaSeleccionada(null);
      setPruebas('');
      setComentarios('');
    }
  };

  return (
    <div className="reporte-form-card" style={{ padding: '0', background: 'transparent', boxShadow: 'none' }}>
      
      {fase === 'inicio' && (
        <div>
          <h2 className="form-main-title" style={{ marginTop: 0 }}>Tareas Disponibles</h2>
          <p className="form-subtitle" style={{ marginBottom: '1.5rem' }}>Selecciona una labor predeterminada. Todas tienen horas y días asignados por el administrador.</p>
          
          {loadingTareas ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Cargando tareas disponibles...</div>
          ) : (tareas.filter(t => t.titulo.toLowerCase().includes(busqueda?.toLowerCase() || '') || t.descripcion.toLowerCase().includes(busqueda?.toLowerCase() || '')).length === 0) ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb' }}>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{busqueda ? 'No se encontraron tareas que coincidan con tu búsqueda.' : 'No hay tareas disponibles en este momento.'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {tareas.filter(t => t.titulo.toLowerCase().includes(busqueda?.toLowerCase() || '') || t.descripcion.toLowerCase().includes(busqueda?.toLowerCase() || '')).map(t => (
                <div key={t.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.2rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer' }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                     onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                     onClick={() => handleSeleccionar(t)}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#1f2937' }}>{t.titulo}</h3>
                  <p style={{ margin: '0 0 15px', fontSize: '0.8rem', color: '#6b7280', flex: 1 }}>{t.descripcion}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>
                      <Clock size={14} color="#10b981" /> {t.horas} h
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>
                      <CalendarDays size={14} color="#10b981" /> {t.dias || 'Cualquier día'}
                    </div>
                  </div>
                  
                  <button style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: '#f0fdf4', color: '#059669', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Solicitar esta labor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {fase === 'revision' && tareaSeleccionada && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '2rem' }}>
          <h2 className="form-main-title form-content-center" style={{ marginTop: 0 }}>Entregar Evidencias</h2>
          
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '15px', marginBottom: '1.5rem', border: '1px solid #f3f4f6' }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 700, color: '#1f2937' }}>Labor: {tareaSeleccionada.titulo}</p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> Tiempo predeterminado: {tareaSeleccionada.horas}h</span>
              <span style={{ fontSize: '0.85rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}><CalendarDays size={14} /> Días: {tareaSeleccionada.dias || 'Cualquier día'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Link size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Enlace de la Evidencia (URL de la foto)
              </label>
              <input
                type="text"
                value={pruebas}
                onChange={(e) => setPruebas(e.target.value)}
                placeholder="Pegue aquí el enlace de su foto (Imgur, Google Drive, etc.)"
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
                  background: '#f9fafb', fontSize: '0.85rem'
                }}
              />
              {pruebas && (
                <div style={{ marginTop: '15px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <img src={pruebas} alt="Vista previa" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', display: 'block', background: '#f3f4f6' }} />
                </div>
              )}
            </div>

            <div className="form-group-margin" style={{ marginBottom: '2rem' }}>
              <label className="obs-label-gray" style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 600, fontSize: '0.9rem' }}>
                Comentarios adicionales (Opcional):
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Describe qué lograste o cualquier inconveniente..."
                rows="3"
                className="obs-textarea"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleCancelar}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
              >
                {tareaAsignada ? 'Volver a Mis Labores' : 'Volver a Tareas'}
              </button>
              <button
                type="submit"
                disabled={enviando}
                style={{ flex: 2, padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', opacity: enviando ? 0.7 : 1, transition: 'background 0.2s' }}
                onMouseEnter={e => !enviando && (e.currentTarget.style.background = '#059669')}
                onMouseLeave={e => !enviando && (e.currentTarget.style.background = '#10b981')}
              >
                {enviando ? 'Enviando Reporte...' : 'Enviar Reporte para Aprobación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReporteForm;

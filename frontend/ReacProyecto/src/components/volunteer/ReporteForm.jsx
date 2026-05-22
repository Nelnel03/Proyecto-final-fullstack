import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import { CalendarDays, Clock, CheckCircle2, Link } from 'lucide-react';

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
    } catch (error) { console.error(error);
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
<<<<<<< HEAD
      } catch (error) { console.error(error);
=======
      } catch {
>>>>>>> 5b861daa75d3cefc80e8a9f272c668bc7b6969ce
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
<<<<<<< HEAD
    } catch (error) { console.error(error);
=======
    } catch {
>>>>>>> 5b861daa75d3cefc80e8a9f272c668bc7b6969ce
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
    <div className="bg-transparent p-0 shadow-none">
      
      {fase === 'inicio' && (
        <div>
          <h2 className="mt-0 text-[1.4rem] font-black text-premium-text-main mb-[8px]">Tareas Disponibles</h2>
          <p className="mb-6 text-[0.85rem] text-premium-text-muted">Selecciona una labor predeterminada. Todas tienen horas y días asignados por el administrador.</p>
          
          {loadingTareas ? (
            <div className="text-center p-8 text-gray-600">Cargando tareas disponibles...</div>
          ) : (tareas.filter(t => t.titulo.toLowerCase().includes(busqueda?.toLowerCase() || '') || t.descripcion.toLowerCase().includes(busqueda?.toLowerCase() || '')).length === 0) ? (
            <div className="text-center p-12 bg-white rounded-[14px] border border-gray-200">
              <p className="text-gray-500 text-[0.95rem]">{busqueda ? 'No se encontraron tareas que coincidan con tu búsqueda.' : 'No hay tareas disponibles en este momento.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[15px]">
              {tareas.filter(t => t.titulo.toLowerCase().includes(busqueda?.toLowerCase() || '') || t.descripcion.toLowerCase().includes(busqueda?.toLowerCase() || '')).map(t => (
                <div key={t.id} className="bg-white rounded-[12px] border border-gray-200 p-[1.2rem] flex flex-col transition-all duration-200 cursor-pointer hover:border-emerald-500" onClick={() => handleSeleccionar(t)}>
                  <h3 className="m-0 mb-2 text-[1rem] text-gray-800 font-bold">{t.titulo}</h3>
                  <p className="m-0 mb-4 text-[0.8rem] text-gray-500 flex-1">{t.descripcion}</p>
                  
                  <div className="flex items-center gap-[12px] mb-[15px] pb-[15px] border-b border-gray-100">
                    <div className="flex items-center gap-[5px] text-[0.8rem] text-gray-600 font-semibold">
                      <Clock size={14} className="text-emerald-500" /> {t.horas} h
                    </div>
                    <div className="flex items-center gap-[5px] text-[0.8rem] text-gray-600 font-semibold">
                      <CalendarDays size={14} className="text-emerald-500" /> {t.dias || 'Cualquier día'}
                    </div>
                  </div>
                  
                  <button className="w-full p-2 rounded-lg border-none bg-emerald-50 text-emerald-600 font-bold text-[0.85rem] cursor-pointer flex justify-center items-center gap-1.5 transition-colors hover:bg-emerald-100">
                    <CheckCircle2 size={16} /> Solicitar esta labor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {fase === 'revision' && tareaSeleccionada && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-[800px] mx-auto">
          <h2 className="mt-0 text-[1.4rem] font-black text-premium-text-main mb-6 text-center">Entregar Evidencias</h2>
          
          <div className="bg-gray-50 rounded-xl p-[15px] mb-6 border border-gray-100">
            <p className="m-0 mb-2 text-[0.95rem] font-bold text-gray-800">Labor: {tareaSeleccionada.titulo}</p>
            <div className="flex gap-[15px] flex-wrap">
              <span className="text-[0.85rem] text-gray-600 flex items-center gap-[5px]"><Clock size={14} /> Tiempo predeterminado: {tareaSeleccionada.horas}h</span>
              <span className="text-[0.85rem] text-gray-600 flex items-center gap-[5px]"><CalendarDays size={14} /> Días: {tareaSeleccionada.dias || 'Cualquier día'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[0.82rem] font-extrabold text-gray-700 uppercase mb-2">
                <Link size={14} className="align-middle mr-1" /> Enlace de la Evidencia (URL de la foto)
              </label>
              <input
                type="text"
                value={pruebas}
                onChange={(e) => setPruebas(e.target.value)}
                placeholder="Pegue aquí el enlace de su foto (Imgur, Google Drive, etc.)"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-[0.85rem] outline-none focus:border-emerald-500 transition-colors"
              />
              {pruebas && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                  <img src={pruebas} alt="Vista previa" className="w-full max-h-[250px] object-contain block bg-gray-100" />
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-gray-700 font-semibold text-[0.9rem]">
                Comentarios adicionales (Opcional):
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Describe qué lograste o cualquier inconveniente..."
                rows="3"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-[0.85rem] font-sans resize-y outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex gap-[10px]">
              <button
                type="button"
                onClick={handleCancelar}
                className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 border-none rounded-lg font-semibold cursor-pointer transition-colors"
              >
                {tareaAsignada ? 'Volver a Mis Labores' : 'Volver a Tareas'}
              </button>
              <button
                type="submit"
                disabled={enviando}
                className={`flex-[2] p-3 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg font-bold cursor-pointer transition-colors ${enviando ? 'opacity-70' : ''}`}
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

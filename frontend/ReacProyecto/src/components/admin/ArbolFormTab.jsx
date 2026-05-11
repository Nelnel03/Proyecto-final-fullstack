import { Info, Leaf, Camera, Calendar, AlignLeft, Thermometer, ArrowUp, Zap } from 'lucide-react';
import ImageUploadField from '../ImageUploadField';
import '../../styles/MainPagesInicoAdmin.css';

function ArbolFormTab({ 
  modoEdicion, 
  handleSubmit, 
  form, 
  handleChange, 
  modoNuevoTipo, 
  tiposDisponibles, 
  setModoNuevoTipo, 
  setForm, 
  resetForm, 
  setTab 
}) {
  // Si no hay tipos registrados en el sistema, forzamos el modo "Nuevo Tipo"
  React.useEffect(() => {
    if (tiposDisponibles.length === 0 && !modoNuevoTipo && !modoEdicion) {
      setModoNuevoTipo(true);
    }
  }, [tiposDisponibles, modoNuevoTipo, modoEdicion, setModoNuevoTipo]);

  return (
    <div className="admin-form-card premium-form">
      <div className="admin-form-split">
        {/* Lado Izquierdo: Preview y Guía */}
        <div className="admin-form-preview-side">
          <div className="admin-preview-sticky">
            <h3 className="admin-preview-title">Previsualización en Vivo</h3>
            <div className={`admin-live-preview-card ${form.estado}`}>
              <div className="admin-preview-img-container">
                {form.imagenUrl ? (
                  <img src={form.imagenUrl} alt="Preview" className="admin-preview-img" />
                ) : (
                  <div className="admin-preview-img-placeholder">
                    <Camera size={40} />
                    <span>Sin imagen seleccionada</span>
                  </div>
                )}
                <div className="admin-preview-badge">ID: {form.id || 'NUEVO'}</div>
              </div>
              
              <div className="admin-preview-content">
                <h4 className="admin-preview-name">{form.nombre || 'Nombre de la Especie'}</h4>
                <p className="admin-preview-scien">{form.nombreCientifico || '— Nombre Científico —'}</p>
                
                <div className="admin-preview-meta-grid">
                  <div className="admin-prev-meta-item">
                    <Leaf size={14} />
                    <span>{form.tipo || 'Tipo'}</span>
                  </div>
                  <div className="admin-prev-meta-item">
                    <Thermometer size={14} />
                    <span>{form.clima || 'Clima'}</span>
                  </div>
                  <div className="admin-prev-meta-item">
                    <ArrowUp size={14} />
                    <span>{form.altura || 'Altura'}</span>
                  </div>
                </div>

                <div className="admin-preview-status-strip">
                   <Zap size={14} />
                   <span>Estado: {form.estado ? form.estado.toUpperCase() : 'VIVO'}</span>
                </div>
              </div>
            </div>

            <div className="admin-form-guide">
              <div className="admin-guide-header">
                <Info size={16} />
                <span>Guía de Registro</span>
              </div>
              <ul className="admin-guide-list">
                <li>Usa imágenes en formato <strong>JPG</strong> o <strong>PNG</strong> de alta resolución.</li>
                <li>El nombre científico es clave para la clasificación biológica.</li>
                <li>Asegúrate de marcar el estado real para las alertas de hábitat.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario Real */}
        <div className="admin-form-inputs-side">
          <div className="admin-form-header-area">
            <h2 className="admin-form-title-main">
              {modoEdicion ? 'Actualizar Información' : 'Registrar Nueva Especie'}
            </h2>
            <p className="admin-form-subtitle">Completa los campos para mantener la base de datos actualizada.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-actual-form">
            <div className="admin-form-grid">
              
              <div className="admin-form-group">
                <label><Leaf size={14} /> Nombre común *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Roble, Ceiba..."
                  required
                />
              </div>

              <div className="admin-form-group">
                <label><Zap size={14} /> Tipo de Árbol *</label>
                {!modoNuevoTipo ? (
                  <select
                    name="tipoSelector"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                  >
                    {tiposDisponibles.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                    ))}
                    <option value="___nuevo___">Añadir otro tipo...</option>
                  </select>
                ) : (
                  <div className="admin-type-input-group">
                    <input
                      name="tipo"
                      type="text"
                      value={form.tipo}
                      onChange={handleChange}
                      placeholder="Nuevo tipo..."
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => { setModoNuevoTipo(false); setForm({ ...form, tipo: tiposDisponibles[0] || '' }); }}
                    >×</button>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label><AlignLeft size={14} /> Nombre científico</label>
                <input
                  type="text"
                  name="nombreCientifico"
                  value={form.nombreCientifico}
                  onChange={handleChange}
                  placeholder="Ej: Quercus robur"
                />
              </div>

              <div className="admin-form-group">
                <label><Info size={14} /> Familia botánica</label>
                <input
                  type="text"
                  name="familia"
                  value={form.familia}
                  onChange={handleChange}
                  placeholder="Ej: Fagaceae"
                />
              </div>

              <div className="admin-form-group">
                <label><ArrowUp size={14} /> Altura promedio</label>
                <input
                  type="text"
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                  placeholder="Ej: 20m"
                />
              </div>

              <div className="admin-form-group">
                <label><Calendar size={14} /> Fecha de registro</label>
                <input
                  type="date"
                  name="fechaRegistro"
                  value={form.fechaRegistro}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label><Thermometer size={14} /> Clima</label>
                <input
                  type="text"
                  name="clima"
                  value={form.clima}
                  onChange={handleChange}
                  placeholder="Ej: Tropical"
                />
              </div>

              <div className="admin-form-group">
                <label>Estado actual</label>
                <select name="estado" value={form.estado} onChange={handleChange}>
                  <option value="vivo">🟢 Vivo / Saludable</option>
                  <option value="en_riesgo">🟡 En Riesgo</option>
                  <option value="muerto">🔴 Muerto / Baja</option>
                  <option value="protegido">💎 Protegido</option>
                </select>
              </div>

              <ImageUploadField 
                label="Foto del Árbol" 
                value={form.imagenUrl} 
                onChange={(url) => setForm({...form, imagenUrl: url})} 
                placeholder="Seleccionar imagen del árbol"
              />

              <div className="admin-form-group admin-form-full">
                <label>Descripción detallada</label>
                <textarea
                  name="descripcion"
                  rows={3}
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Historia e importancia ecológica..."
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-btn-cancelar"
                onClick={() => { resetForm(); setTab('lista'); }}
              >
                Descartar Cambios
              </button>
              <button type="submit" className="admin-btn-guardar">
                {modoEdicion ? 'Actualizar Registro' : 'Completar Registro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArbolFormTab;

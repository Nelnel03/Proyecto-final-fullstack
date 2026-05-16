import React from 'react';
import { Info, Leaf, Camera, Calendar, AlignLeft, Thermometer, ArrowUp, Zap, X, Save } from 'lucide-react';
import ImageUploadField from '../common/ImageUploadField';
import LoadingButton from '../ui/LoadingButton';
import '../../styles/admin/MainPagesInicoAdmin.css';

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
  setTab,
  isSubmitting = false
}) {
  React.useEffect(() => {
    if (tiposDisponibles.length === 0 && !modoNuevoTipo && !modoEdicion) {
      setModoNuevoTipo(true);
    }
  }, [tiposDisponibles, modoNuevoTipo, modoEdicion, setModoNuevoTipo]);

  return (
    <div className="admin-tab-content-wrapper fade-in">
      <div className="admin-section-header premium-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>
            {modoEdicion ? 'Editor de Espécimen' : 'Nuevo Registro Biológico'}
          </h2>
          <p className="text-muted">Gestión de la ficha técnica y monitoreo del ejemplar</p>
        </div>
      </div>

      <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
        
        {/* PREVIEW SIDE */}
        <div className="admin-preview-side">
          <div className="premium-card" style={{ position: 'sticky', top: '100px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, opacity: 0.6 }}>VISTA PREVIA</h3>
            
            <div className={`card-preview-container ${form.estado}`} style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--ui-primary-bg)' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                {form.imagenUrl ? (
                  <img src={form.imagenUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="flex-center" style={{ width: '100%', height: '100%', flexDirection: 'column', opacity: 0.2 }}>
                    <Camera size={48} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '10px' }}>SIN IMAGEN</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--ui-primary)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800 }}>
                  ID: {form.id || 'NUEVO'}
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{form.nombre || 'Nombre Común'}</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>{form.nombreCientifico || 'Nombre científico'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                   <div className="flex-center" style={{ flexDirection: 'column', padding: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                     <Leaf size={14} className="text-muted" />
                     <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px' }}>{form.tipo || '—'}</span>
                   </div>
                   <div className="flex-center" style={{ flexDirection: 'column', padding: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                     <Thermometer size={14} className="text-muted" />
                     <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px' }}>{form.clima || '—'}</span>
                   </div>
                   <div className="flex-center" style={{ flexDirection: 'column', padding: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                     <ArrowUp size={14} className="text-muted" />
                     <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px' }}>{form.altura || '—'}</span>
                   </div>
                </div>

                <div className="flex-between" style={{ padding: '8px 12px', background: 'var(--ui-primary)', color: '#fff', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>ESTADO: {(form.estado || 'vivo').toUpperCase()}</span>
                  <Zap size={14} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(58, 90, 64, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--ui-primary)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                 <Info size={16} color="var(--ui-primary)" />
                 <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>CONSEJO BIO</span>
               </div>
               <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.7 }}>
                 Mantén las descripciones precisas para ayudar a los voluntarios en su labor diaria de cuidado.
               </p>
            </div>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="admin-form-side">
          <div className="premium-card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Nombre Común *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="ui-input"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Roble, Ceiba..."
                    required
                  />
                </div>

                <div className="ui-field">
                  <label>Tipo de Árbol *</label>
                  {!modoNuevoTipo ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select
                        name="tipoSelector"
                        className="ui-select"
                        value={form.tipo}
                        onChange={handleChange}
                        required
                        style={{ flex: 1 }}
                      >
                        {tiposDisponibles.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                        ))}
                        <option value="___nuevo___">Añadir otro tipo...</option>
                      </select>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <input
                        name="tipo"
                        type="text"
                        className="ui-input"
                        value={form.tipo}
                        onChange={handleChange}
                        placeholder="Nuevo tipo..."
                        required
                        autoFocus
                      />
                      <button 
                        type="button" 
                        onClick={() => { setModoNuevoTipo(false); setForm({ ...form, tipo: tiposDisponibles[0] || '' }); }}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="ui-field">
                  <label>Estado Actual</label>
                  <select name="estado" className="ui-select" value={form.estado} onChange={handleChange}>
                    <option value="vivo">🟢 Vivo / Saludable</option>
                    <option value="enfermo">🟡 En Riesgo / Enfermo</option>
                    <option value="muerto">🔴 Muerto / Baja</option>
                  </select>
                </div>

                <div className="ui-field">
                  <label>Nombre Científico</label>
                  <input
                    type="text"
                    name="nombreCientifico"
                    className="ui-input"
                    value={form.nombreCientifico}
                    onChange={handleChange}
                    placeholder="Ej: Quercus robur"
                  />
                </div>

                <div className="ui-field">
                  <label>Familia Botánica</label>
                  <input
                    type="text"
                    name="familia"
                    className="ui-input"
                    value={form.familia}
                    onChange={handleChange}
                    placeholder="Ej: Fagaceae"
                  />
                </div>

                <div className="ui-field">
                  <label>Altura Promedio</label>
                  <input
                    type="text"
                    name="altura"
                    className="ui-input"
                    value={form.altura}
                    onChange={handleChange}
                    placeholder="Ej: 20m"
                  />
                </div>

                <div className="ui-field">
                  <label>Clima</label>
                  <input
                    type="text"
                    name="clima"
                    className="ui-input"
                    value={form.clima}
                    onChange={handleChange}
                    placeholder="Ej: Tropical"
                  />
                </div>

                <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                  <ImageUploadField 
                    label="Imagen del Ejemplar" 
                    value={form.imagenUrl} 
                    onChange={(url) => setForm({...form, imagenUrl: url})} 
                  />
                </div>

                <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Descripción y Cuidados</label>
                  <textarea
                    name="descripcion"
                    className="ui-input"
                    rows={4}
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Historia, importancia ecológica y requerimientos específicos..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="ui-btn ui-btn--ghost"
                    onClick={() => { resetForm(); setTab('lista'); }}
                  >
                    Descartar
                  </button>
                  <LoadingButton
                    type="submit"
                    className="ui-btn ui-btn--primary"
                    loading={isSubmitting}
                    style={{ padding: '12px 32px' }}
                  >
                    <Save size={18} style={{ marginRight: '8px' }} />
                    {modoEdicion ? 'Actualizar Ficha' : 'Guardar Registro'}
                  </LoadingButton>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArbolFormTab;

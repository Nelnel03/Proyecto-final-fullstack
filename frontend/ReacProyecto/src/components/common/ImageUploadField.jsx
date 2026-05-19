import React, { useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../services/services.jsx';

import Swal from 'sweetalert2';

/**
 * Componente reutilizable para subir imágenes a Cloudinary.
 * @param {string} label Etiqueta del campo.
 * @param {string} value URL de la imagen actual.
 * @param {function} onChange Función que recibe la nueva URL.
 * @param {string} placeholder Texto de ayuda.
 */
function ImageUploadField({ label, value, onChange, placeholder = "Seleccionar imagen", circular = false }) {
  const [subiendo, setSubiendo] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'El archivo debe ser una imagen', 'error');
      return;
    }

    setSubiendo(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      Swal.fire({
        title: '¡Subida!',
        text: 'Imagen lista',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        error.message || 'No se pudo subir la imagen',
        'error'
      );
    } finally {
      setSubiendo(false);
    }
  };

  if (circular) {
    return (
      <div className="admin-form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {label && <label className="admin-user-input-label">{label}</label>}
        <div 
          className={`interactive-avatar ${subiendo ? 'loading' : ''}`}
          style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f3f4f6', border: '2px dashed #10b981' }}
          onClick={() => !subiendo && document.getElementById(`upload-${label?.replace(/\s/g, '-')}`).click()}
        >
          {subiendo ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Loader2 className="animate-spin" size={30} color="#10b981" />
            </div>
          ) : value ? (
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
              <Upload size={24} />
              <span style={{ fontSize: '0.7rem' }}>Subir</span>
            </div>
          )}
          <div className="avatar-overlay">
            <Upload size={20} color="#fff" />
          </div>
          <input
            type="file"
            id={`upload-${label?.replace(/\s/g, '-')}`}
            accept="image/*"
            onChange={handleFileChange}
            disabled={subiendo}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-group admin-form-full">
      {label && <label>{label}</label>}
      <div className="admin-file-upload-wrapper">
        <div className={`admin-file-input-container ${subiendo ? 'uploading' : ''}`}>
          <input
            type="file"
            id={`upload-${label?.replace(/\s/g, '-')}`}
            accept="image/*"
            onChange={handleFileChange}
            disabled={subiendo}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor={`upload-${label?.replace(/\s/g, '-')}`} 
            className="admin-file-label"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 20px',
              background: '#f3f4f6',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#374151'
            }}
          >
            {subiendo ? (
              <><Loader2 className="animate-spin" size={20} /> Subiendo...</>
            ) : (
              <><Upload size={20} /> {value ? 'Cambiar Imagen' : placeholder}</>
            )}
          </label>
        </div>
        
        {value && (
          <div className="admin-file-current-url" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ecfdf5',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #10b981',
            marginTop: '8px'
          }}>
            <span style={{
              fontSize: '0.8rem',
              color: '#059669',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1
            }}>{value}</span>
            <button 
              type="button" 
              onClick={() => onChange('')} 
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploadField;

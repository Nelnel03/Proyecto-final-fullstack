import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * Reusable Dynamic Form Component.
 * @param {Array} fields - Array of field configurations.
 * @param {Object} form - The form object from useForm hook.
 * @param {String} submitLabel - Label for the submit button.
 * @param {Boolean} loading - Global loading state.
 */
const DynamicForm = ({ 
  fields, 
  form, 
  submitLabel = 'Guardar Cambios', 
  loading = false,
  onCancel,
  gridColumns = 1
}) => {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} className="dynamic-form-wrapper">
      <div 
        className="form-fields-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: '1.2rem'
        }}
      >
        {fields.map((field) => {
          const { 
            name, 
            label, 
            type = 'text', 
            placeholder, 
            options, 
            required, 
            disabled,
            fullWidth,
            className = ''
          } = field;

          const hasError = !!errors[name];

          return (
            <div 
              key={name} 
              className={`form-group ${fullWidth ? 'grid-full-width' : ''} ${className}`}
              style={fullWidth ? { gridColumn: '1 / -1' } : {}}
            >
              <label className="form-label">
                {label} {required && <span className="text-error">*</span>}
              </label>

              {type === 'select' ? (
                <select
                  name={name}
                  value={values[name] || ''}
                  onChange={handleChange}
                  disabled={disabled || loading || isSubmitting}
                  className={`ui-input ${hasError ? 'border-error' : ''}`}
                >
                  <option value="" disabled>{placeholder || `Seleccionar ${label}`}</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : type === 'textarea' ? (
                <textarea
                  name={name}
                  value={values[name] || ''}
                  onChange={handleChange}
                  placeholder={placeholder}
                  disabled={disabled || loading || isSubmitting}
                  className={`ui-input ${hasError ? 'border-error' : ''}`}
                  rows={4}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={values[name] || ''}
                  onChange={handleChange}
                  placeholder={placeholder}
                  disabled={disabled || loading || isSubmitting}
                  className={`ui-input ${hasError ? 'border-error' : ''}`}
                />
              )}

              {hasError && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors[name]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="form-actions mt-8 flex-end gap-4">
        {onCancel && (
          <button 
            type="button" 
            className="ui-btn ui-btn--ghost" 
            onClick={onCancel}
            disabled={loading || isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          className="ui-btn ui-btn--primary"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Procesando...
            </>
          ) : submitLabel}
        </button>
      </div>

      <style jsx="true">{`
        .dynamic-form-wrapper { width: 100%; }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-tierra-sombra);
          margin-bottom: 8px;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-error-msg {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--ui-error);
          font-size: 0.75rem;
          font-weight: 700;
          margin-top: 6px;
          animation: slideInDown 0.2s ease;
        }
        .border-error {
          border-color: var(--ui-error) !important;
          background-color: rgba(239, 68, 68, 0.02) !important;
        }
        .grid-full-width { grid-column: 1 / -1; }
        
        @keyframes slideInDown {
          from { transform: translateY(-5px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </form>
  );
};

export default DynamicForm;

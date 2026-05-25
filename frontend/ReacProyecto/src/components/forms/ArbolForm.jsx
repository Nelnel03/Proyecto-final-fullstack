import React from 'react';
import { useForm } from '../../hooks/useForm';
import DynamicForm from '../common/DynamicForm';
import Swal from 'sweetalert2';

/**
 * Reusable Tree Management Form.
 */
const ArbolForm = ({ 
  initialData = {}, 
  onSubmitSuccess, 
  onCancel,
  isEditing = false 
}) => {
  
  // 1. Define Validations
  const validate = (values) => {
    const errors = {};
    if (!values.nombre) errors.nombre = 'El nombre es obligatorio';
    if (!values.tipo) errors.tipo = 'El tipo de especie es obligatorio';
    if (!values.clima) errors.clima = 'El clima es obligatorio';
    if (values.edad && values.edad < 0) errors.edad = 'La edad no puede ser negativa';
    return errors;
  };

  // 2. Initialize Hook
  const form = useForm(
    {
      nombre: '',
      nombreCientifico: '',
      tipo: '',
      familia: '',
      clima: '',
      descripcion: '',
      estado: 'vivo',
      ...initialData
    },
    validate,
    async (values) => {
      try {
        await onSubmitSuccess(values);
        Swal.fire({
          icon: 'success',
          title: isEditing ? '¡Actualizado!' : '¡Creado!',
          text: `El árbol "${values.nombre}" ha sido procesado correctamente.`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } catch (err) { console.error(err);
        Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error');
        throw err;
      }
    }
  );

  // 3. Define Form Configuration
  const fields = [
    {
      name: 'nombre',
      label: 'Nombre Común',
      placeholder: 'Ej: Guanacaste',
      required: true
    },
    {
      name: 'nombreCientifico',
      label: 'Nombre Científico',
      placeholder: 'Ej: Enterolobium cyclocarpum'
    },
    {
      name: 'tipo',
      label: 'Tipo / Especie',
      type: 'select',
      required: true,
      options: [
        { label: 'Frutal', value: 'frutal' },
        { label: 'Maderable', value: 'maderable' },
        { label: 'Ornamental', value: 'ornamental' },
        { label: 'Nativo', value: 'nativo' }
      ]
    },
    {
      name: 'familia',
      label: 'Familia',
      placeholder: 'Ej: Fabaceae'
    },
    {
      name: 'clima',
      label: 'Clima Preferente',
      type: 'select',
      required: true,
      options: [
        { label: 'Tropical Seco', value: 'tropical_seco' },
        { label: 'Tropical Húmedo', value: 'tropical_humedo' },
        { label: 'Templado', value: 'templado' }
      ]
    },
    {
      name: 'estado',
      label: 'Estado de Salud',
      type: 'select',
      options: [
        { label: 'Vigoroso / Vivo', value: 'vivo' },
        { label: 'Enfermo / En Tratamiento', value: 'enfermo' },
        { label: 'Muerto / Seco', value: 'muerto' }
      ]
    },
    {
      name: 'descripcion',
      label: 'Descripción Detallada',
      type: 'textarea',
      placeholder: 'Características físicas, historia o notas de cuidado...',
      fullWidth: true
    }
  ];

  return (
    <div className="premium-card p-6">
      <h2 className="text-xl font-black mb-6 flex items-center gap-2">
        {isEditing ? 'Editar Ejemplar' : 'Nuevo Registro Forestal'}
      </h2>
      <DynamicForm 
        fields={fields} 
        form={form} 
        gridColumns={2}
        submitLabel={isEditing ? 'Actualizar Registro' : 'Crear Registro'}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ArbolForm;

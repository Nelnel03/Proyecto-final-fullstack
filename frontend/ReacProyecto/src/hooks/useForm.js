import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state and validation.
 * @param {Object} initialValues - Initial state of the form.
 * @param {Function} validate - Validation function that returns an errors object.
 * @param {Function} onSubmit - Function to call on successful submission.
 */
export const useForm = (initialValues = {}, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: val,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) { console.error(err);
        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
};

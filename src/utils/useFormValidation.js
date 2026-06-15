// src/utils/useFormValidation.js
import { useState, useCallback } from 'react';
import { PATTERNS } from './constants';

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    if (rule.required && !value.trim()) return `${rule.label} is required`;
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) return rule.message;
    return '';
  }, [validationRules]);    

  const validateAll = useCallback(() => {
    const newErrors = {};
    // Safely iterate over validationRules keys if it exists
    if (validationRules && typeof validationRules === 'object') {
      Object.keys(validationRules).forEach((name) => {
        const error = validateField(name, values[name] ?? '');
        if (error) newErrors[name] = error;
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField, values, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    validateAll,
    isValid: Object.keys(errors).length === 0 && Object.values(values).every(v => v !== undefined),
  };
};
/**
 * useForm Hook
 * 
 * Manages entire form state, validation, and submission.
 * Orchestrates multiple form fields and provides centralized form management.
 */

import { useState, useCallback, useMemo } from 'react';
import { ValidationRules, validateForm } from '../validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (data: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  formData: T;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | undefined) => void;
  setErrors: (errors: Record<string, string>) => void;
  validateForm: () => boolean;
  validateField: (field: keyof T) => boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
  clearErrors: () => void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form has been modified
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialValues);
  }, [formData, initialValues]);

  // Check if form is valid (no errors)
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when value changes
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string | undefined) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [field as string]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      }
    });
  }, []);

  const validateFormData = useCallback((): boolean => {
    const result = validateForm(formData, validationRules);
    setErrors(result.errors);
    return result.isValid;
  }, [formData, validationRules]);

  const validateSingleField = useCallback((field: keyof T): boolean => {
    const fieldRules = validationRules[field as string];
    if (!fieldRules) return true;

    const result = validateForm({ [field]: formData[field] }, { [field as string]: fieldRules });
    
    if (result.errors[field as string]) {
      setFieldError(field, result.errors[field as string]);
      return false;
    } else {
      setFieldError(field, undefined);
      return true;
    }
  }, [formData, validationRules, setFieldError]);

  const handleSubmit = useCallback(async () => {
    console.log('🎯 useForm.handleSubmit called, isSubmitting:', isSubmitting);
    
    if (isSubmitting) {
      console.log('⏸️ Submission already in progress, ignoring duplicate call');
      return;
    }

    const isFormValid = validateFormData();
    if (!isFormValid) {
      console.log('❌ Form validation failed, not submitting');
      return;
    }
    
    if (!onSubmit) {
      console.log('⚠️ No onSubmit handler provided');
      return;
    }

    console.log('🚀 Starting form submission...');
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      console.log('✅ Form submission completed successfully');
    } catch (error) {
      console.error('❌ Form submission error:', error);
      // Let the parent component handle submission errors
      throw error;
    } finally {
      console.log('🏁 Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  }, [formData, validateFormData, onSubmit, isSubmitting]);

  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isValid,
    isSubmitting,
    isDirty,
    setFieldValue,
    setFieldError,
    setErrors,
    validateForm: validateFormData,
    validateField: validateSingleField,
    handleSubmit,
    reset,
    clearErrors,
  };
};

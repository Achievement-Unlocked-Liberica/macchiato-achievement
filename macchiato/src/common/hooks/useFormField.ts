/**
 * useFormField Hook
 * 
 * Manages individual form field state, validation, and error handling.
 * Follows Single Responsibility Principle by focusing only on field-level concerns.
 */

import { useState, useCallback } from 'react';
import { ValidationRule, validateField } from '../validation';

interface UseFormFieldOptions {
  initialValue: any;
  validationRules?: ValidationRule | ValidationRule[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormFieldReturn {
  value: any;
  error: string | undefined;
  isValid: boolean;
  hasBeenTouched: boolean;
  setValue: (value: any) => void;
  setError: (error: string | undefined) => void;
  validate: (formData?: any) => boolean;
  onBlur: () => void;
  reset: () => void;
}

export const useFormField = ({
  initialValue,
  validationRules,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormFieldOptions): UseFormFieldReturn => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const validate = useCallback((formData?: any): boolean => {
    if (!validationRules) {
      setError(undefined);
      return true;
    }

    const result = validateField(value, validationRules, formData);
    setError(result.error);
    return result.isValid;
  }, [value, validationRules]);

  const handleSetValue = useCallback((newValue: any) => {
    setValue(newValue);
    
    // Clear error when user starts typing (unless validateOnChange is true)
    if (!validateOnChange && error) {
      setError(undefined);
    }
    
    // Validate on change if enabled
    if (validateOnChange) {
      const result = validateField(newValue, validationRules || []);
      setError(result.error);
    }
  }, [validateOnChange, error, validationRules]);

  const handleBlur = useCallback(() => {
    setHasBeenTouched(true);
    
    if (validateOnBlur) {
      validate();
    }
  }, [validateOnBlur, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setHasBeenTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    isValid: !error,
    hasBeenTouched,
    setValue: handleSetValue,
    setError,
    validate,
    onBlur: handleBlur,
    reset,
  };
};

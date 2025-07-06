/**
 * Validation utilities
 * Core validation engine that processes rules and returns results
 */

import { ValidationRules, ValidationResult, FieldValidationResult, ValidationRule } from './types';

/**
 * Validates a single field against its validation rules
 */
export const validateField = (
  value: any,
  rules: ValidationRule | ValidationRule[],
  formData?: any
): FieldValidationResult => {
  const rulesToProcess = Array.isArray(rules) ? rules : [rules];
  
  for (const rule of rulesToProcess) {
    const error = rule(value, formData);
    if (error) {
      return { isValid: false, error };
    }
  }
  
  return { isValid: true };
};

/**
 * Validates an entire form against validation rules
 */
export const validateForm = (
  formData: Record<string, any>,
  validationRules: ValidationRules
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const fieldValue = formData[fieldName];
    const result = validateField(fieldValue, rules, formData);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Common validation types and interfaces
 * Provides type definitions for validation rules and results
 */

export type ValidationRule<T = any> = (value: T, formData?: any) => string | undefined;

export interface ValidationRules {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

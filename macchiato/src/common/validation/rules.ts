/**
 * Common validation rules
 * Reusable validation functions that can be composed for form validation
 */

import { ValidationRule } from './types';

/**
 * Validates that a field is required (not empty/null/undefined)
 */
export const required: ValidationRule<string> = (value: string) => {
  if (!value || !value.trim()) {
    return 'This field is required';
  }
};

/**
 * Validates minimum string length
 */
export const minLength = (min: number, customMessage?: string): ValidationRule<string> => 
  (value: string) => {
    if (value && value.trim().length < min) {
      return customMessage || `Must be at least ${min} characters`;
    }
  };

/**
 * Validates maximum string length
 */
export const maxLength = (max: number, customMessage?: string): ValidationRule<string> => 
  (value: string) => {
    if (value && value.trim().length > max) {
      return customMessage || `Must not exceed ${max} characters`;
    }
  };

/**
 * Validates email format
 */
export const email: ValidationRule<string> = (value: string) => {
  if (value && value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address';
    }
  }
};

/**
 * Validates that two fields match (e.g., password confirmation)
 */
export const matchField = (fieldToMatch: string, fieldLabel?: string): ValidationRule => 
  (value: any, formData: any) => {
    if (value && formData && value !== formData[fieldToMatch]) {
      const label = fieldLabel || fieldToMatch;
      return `Must match ${label}`;
    }
  };

/**
 * Validates date is not in the future
 */
export const notFutureDate: ValidationRule<Date> = (value: Date) => {
  if (value && value > new Date()) {
    return 'Date cannot be in the future';
  }
};

/**
 * Validates minimum age
 */
export const minAge = (minYears: number): ValidationRule<Date> => 
  (value: Date) => {
    if (value) {
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      const monthDiff = today.getMonth() - value.getMonth();
      const dayDiff = today.getDate() - value.getDate();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      if (actualAge < minYears) {
        return `You must be at least ${minYears} years old`;
      }
    }
  };

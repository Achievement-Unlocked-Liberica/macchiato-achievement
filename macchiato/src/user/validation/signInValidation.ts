/**
 * Sign in form validation configuration
 * Defines validation rules specific to user sign in
 */

import { ValidationRules, required, minLength, maxLength } from '../../common/validation';

export interface SignInFormData {
  username: string;
  password: string;
}

export const signInValidationRules: ValidationRules = {
  username: [
    required,
    minLength(5, 'Username must be at least 5 characters'),
    maxLength(50, 'Username must not exceed 50 characters'),
  ],
  password: [
    required,
    minLength(8, 'Password must be at least 8 characters'),
    maxLength(100, 'Password must not exceed 100 characters'),
  ],
};

/**
 * Registration form validation configuration
 * Defines validation rules specific to user registration
 */

import { ValidationRules, required, minLength, maxLength, email, matchField } from '../../common/validation';

export interface RegistrationFormData {
  username: string;
  password: string;
  passwordConfirmation: string;
  email: string;
  emailConfirmation: string;
}

export const registrationValidationRules: ValidationRules = {
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
  passwordConfirmation: [
    required,
    matchField('password', 'Passwords do not match'),
  ],
  email: [
    required,
    email,
  ],
  emailConfirmation: [
    required,
    matchField('email', 'Email addresses do not match'),
  ],
};

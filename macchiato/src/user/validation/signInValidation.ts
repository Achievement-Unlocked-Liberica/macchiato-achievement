/**
 * Sign in form validation configuration
 * Defines validation rules specific to user sign in
 */

import { ValidationRules, required } from '../../common/validation';

export interface SignInFormData {
  username: string;
  password: string;
}

export const signInValidationRules: ValidationRules = {
  username: [
    required,
  ],
  password: [
    required,
  ],
};

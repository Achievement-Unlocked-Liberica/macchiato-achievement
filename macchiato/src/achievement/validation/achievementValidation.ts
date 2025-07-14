/**
 * Achievement form validation configuration
 */

import { ValidationRules, required, maxLength, minLength } from '../../common/validation';

export interface AchievementFormData {
  title: string;
  description: string;
  completedDate: string;
  skills: string[];
  isPublic: boolean;
}

export const achievementValidationRules: ValidationRules = {
  title: [
    required,
    maxLength(200),
  ],
  description: [
    required,
    maxLength(1000),
  ],
  completedDate: [
    required,
    (value: string) => {
      if (!value) return 'Date is required';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (selectedDate > today) {
        return 'Date cannot be in the future';
      }
      return undefined;
    },
  ],
  skills: [
    (value: string[]) => {
      if (!value || value.length === 0) {
        return 'At least one skill must be selected';
      }
      return undefined;
    },
  ],
};

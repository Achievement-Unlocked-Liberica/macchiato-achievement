/**
 * Centralized Button Styles
 * 
 * Standardized button styles for consistent UI across the application
 * Usage: Import and use the pre-defined button style combinations
 */

import { ViewStyle } from 'react-native';

// Base button style - common properties for all buttons
const baseButton: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  margin: 8, // Standard spacing around all buttons
};

// Button size variants
const buttonSizes: Record<string, ViewStyle> = {
  xs: { width: 24, height: 24, borderRadius: 12 },
  sm: { width: 32, height: 32, borderRadius: 16 },
  md: { width: 48, height: 48, borderRadius: 24 },
  lg: { width: 64, height: 64, borderRadius: 32 },
  xl: { width: 72, height: 72, borderRadius: 36 },
};

// Button color variants
const buttonColors: Record<string, ViewStyle> = {
  primary: { backgroundColor: '#F8C825' },
  secondary: { backgroundColor: '#5F6B78' },
  alert: { backgroundColor: '#EF4444' }, // Red hex color
  disabled: { 
    backgroundColor: '#5F6B78', 
    elevation: 1, 
    shadowOpacity: 0.1 
  },
};

// Combined button styles - all size and color combinations
export const buttonStyles: Record<string, ViewStyle> = {
  // Extra Small (24px) buttons
  buttonXsPrimary: { ...baseButton, ...buttonSizes.xs, ...buttonColors.primary },
  buttonXsSecondary: { ...baseButton, ...buttonSizes.xs, ...buttonColors.secondary },
  buttonXsAlert: { ...baseButton, ...buttonSizes.xs, ...buttonColors.alert },
  buttonXsDisabled: { ...baseButton, ...buttonSizes.xs, ...buttonColors.disabled },

  // Small (32px) buttons
  buttonSmPrimary: { ...baseButton, ...buttonSizes.sm, ...buttonColors.primary },
  buttonSmSecondary: { ...baseButton, ...buttonSizes.sm, ...buttonColors.secondary },
  buttonSmAlert: { ...baseButton, ...buttonSizes.sm, ...buttonColors.alert },
  buttonSmDisabled: { ...baseButton, ...buttonSizes.sm, ...buttonColors.disabled },

  // Medium (48px) buttons
  buttonMdPrimary: { ...baseButton, ...buttonSizes.md, ...buttonColors.primary },
  buttonMdSecondary: { ...baseButton, ...buttonSizes.md, ...buttonColors.secondary },
  buttonMdAlert: { ...baseButton, ...buttonSizes.md, ...buttonColors.alert },
  buttonMdDisabled: { ...baseButton, ...buttonSizes.md, ...buttonColors.disabled },

  // Large (64px) buttons
  buttonLgPrimary: { ...baseButton, ...buttonSizes.lg, ...buttonColors.primary },
  buttonLgSecondary: { ...baseButton, ...buttonSizes.lg, ...buttonColors.secondary },
  buttonLgAlert: { ...baseButton, ...buttonSizes.lg, ...buttonColors.alert },
  buttonLgDisabled: { ...baseButton, ...buttonSizes.lg, ...buttonColors.disabled },

  // Extra Large (72px) buttons
  buttonXlPrimary: { ...baseButton, ...buttonSizes.xl, ...buttonColors.primary },
  buttonXlSecondary: { ...baseButton, ...buttonSizes.xl, ...buttonColors.secondary },
  buttonXlAlert: { ...baseButton, ...buttonSizes.xl, ...buttonColors.alert },
  buttonXlDisabled: { ...baseButton, ...buttonSizes.xl, ...buttonColors.disabled },
};

// Export individual components for custom combinations if needed
export const baseButtonStyle = baseButton;
export const buttonSizeStyles = buttonSizes;
export const buttonColorStyles = buttonColors;

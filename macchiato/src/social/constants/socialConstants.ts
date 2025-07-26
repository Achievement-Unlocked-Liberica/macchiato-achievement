/**
 * Social Constants
 * 
 * Centralized social configuration including button sizes and colors
 * for use across multiple social display components.
 */

// Social button sizes configuration for consistent sizing across components
export const SOCIAL_BUTTON_SIZES = {
  xs: 10,  // Achievement card widget
  sm: 16,  // Current default
  md: 24,  // Achievement details widget
  lg: 36,  // Large displays
  xl: 48,  // Extra large for special displays
} as const;

// Social interaction colors
export const SOCIAL_COLORS = {
  heart: '#FF6B6B',      // Like/favorite color
  lightning: '#FFD93D',  // Energy/power color  
  star: '#6BCF7F',       // Star/rating color
} as const;

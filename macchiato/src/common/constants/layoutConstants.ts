/**
 * Layout Constants
 * 
 * Centralized constants for consistent spacing, margins, and padding
 * throughout the application.
 */

export const LAYOUT_CONSTANTS = {
  // Button spacing
  BUTTON_SPACING: 24, // Space between action buttons in footers
  
  // Container padding
  CONTAINER_PADDING: 16,
  FORM_PADDING: 20,
  
  // Field spacing
  FIELD_MARGIN_BOTTOM: 20,
  
  // Border radius
  BORDER_RADIUS: 8,
  CIRCULAR_BORDER_RADIUS: 30,
  
  // Shadow properties
  SHADOW: {
    elevation: 4, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
} as const;

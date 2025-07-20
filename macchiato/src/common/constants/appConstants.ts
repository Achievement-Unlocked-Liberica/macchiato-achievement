/**
 * App Constants
 * 
 * Configuration values for application behavior and lifecycle management.
 */

export const APP_CONSTANTS = {
  /**
   * Time in milliseconds before clearing authentication tokens
   * when app remains in background/inactive state
   */
  BACKGROUND_TIMEOUT: 300000, // 5 minutes
  
  /**
   * Timeout display name for logging and debugging
   */
  BACKGROUND_TIMEOUT_DISPLAY: '5 minutes',
} as const;

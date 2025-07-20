/**
 * App State Service
 * 
 * Handles application state changes and lifecycle events.
 * Provides automatic token cleanup when app is closed or backgrounded.
 */

import { AppState, AppStateStatus } from 'react-native';
import { TokenStorageService } from './tokenStorage';
import { APP_CONSTANTS } from '../constants';

export class AppStateService {
  private static appStateSubscription: any = null;
  private static clearAuthCallback: (() => Promise<void>) | null = null;
  private static backgroundTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize app state monitoring
   * @param onAppClose - Callback to execute when app is closed/backgrounded for extended period
   */
  static initialize(onAppClose: () => Promise<void>) {
    console.log('🔄 AppStateService: Initializing app state monitoring...');
    
    this.clearAuthCallback = onAppClose;
    
    // Subscribe to app state changes
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );
    
    console.log('✅ AppStateService: App state monitoring initialized');
  }

  /**
   * Handle app state changes
   * @param nextAppState - The new app state
   */
  private static handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('🔄 AppStateService: App state changed to:', nextAppState);
    
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('🚪 AppStateService: App going to background, starting timeout...');
      
      // Start a timer - only clear tokens if app stays in background for extended period
      this.backgroundTimer = setTimeout(async () => {
        console.log(`⏰ AppStateService: App has been in background for ${APP_CONSTANTS.BACKGROUND_TIMEOUT_DISPLAY}, clearing auth tokens...`);
        
        try {
          // Clear tokens from secure storage
          await TokenStorageService.clearAuthData();
          
          // Call the provided callback (usually to update context state)
          if (this.clearAuthCallback) {
            await this.clearAuthCallback();
          }
          
          console.log('✅ AppStateService: Auth tokens cleared due to extended background time');
        } catch (error) {
          console.error('❌ AppStateService: Failed to clear tokens on extended background:', error);
        }
      }, APP_CONSTANTS.BACKGROUND_TIMEOUT);
      
    } else if (nextAppState === 'active') {
      console.log('🔄 AppStateService: App became active, cancelling background timer');
      
      // App came back to foreground, cancel the timeout
      if (this.backgroundTimer) {
        clearTimeout(this.backgroundTimer);
        this.backgroundTimer = null;
        console.log('✅ AppStateService: Background timer cancelled - app returned to foreground');
      }
    }
  };

  /**
   * Cleanup app state monitoring
   */
  static cleanup() {
    console.log('🧹 AppStateService: Cleaning up app state monitoring...');
    
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    
    // Clear any pending background timer
    if (this.backgroundTimer) {
      clearTimeout(this.backgroundTimer);
      this.backgroundTimer = null;
    }
    
    this.clearAuthCallback = null;
    console.log('✅ AppStateService: Cleanup completed');
  }

  /**
   * Get current app state
   */
  static getCurrentState(): AppStateStatus {
    return AppState.currentState;
  }

  /**
   * Manually cancel background timer (useful for critical operations)
   */
  static cancelBackgroundTimer() {
    if (this.backgroundTimer) {
      clearTimeout(this.backgroundTimer);
      this.backgroundTimer = null;
      console.log('✅ AppStateService: Background timer manually cancelled');
    }
  }
}

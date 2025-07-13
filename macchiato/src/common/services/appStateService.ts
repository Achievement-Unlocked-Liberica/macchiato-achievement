/**
 * App State Service
 * 
 * Handles application state changes and lifecycle events.
 * Provides automatic token cleanup when app is closed or backgrounded.
 */

import { AppState, AppStateStatus } from 'react-native';
import { TokenStorageService } from './tokenStorage';

export class AppStateService {
  private static appStateSubscription: any = null;
  private static clearAuthCallback: (() => Promise<void>) | null = null;

  /**
   * Initialize app state monitoring
   * @param onAppClose - Callback to execute when app is closed/backgrounded
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
    
    // Clear tokens when app goes to background or becomes inactive
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('🚪 AppStateService: App going to background, clearing auth tokens...');
      
      try {
        // Clear tokens from secure storage
        await TokenStorageService.clearAuthData();
        
        // Call the provided callback (usually to update context state)
        if (this.clearAuthCallback) {
          await this.clearAuthCallback();
        }
        
        console.log('✅ AppStateService: Auth tokens cleared on app exit');
      } catch (error) {
        console.error('❌ AppStateService: Failed to clear tokens on app exit:', error);
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
    
    this.clearAuthCallback = null;
    console.log('✅ AppStateService: Cleanup completed');
  }

  /**
   * Get current app state
   */
  static getCurrentState(): AppStateStatus {
    return AppState.currentState;
  }
}

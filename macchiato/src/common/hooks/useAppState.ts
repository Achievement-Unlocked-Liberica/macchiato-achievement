/**
 * App State Hook
 * 
 * Custom React hook for monitoring app state changes and handling
 * authentication cleanup on app lifecycle events.
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = (onAppStateChange?: (nextAppState: AppStateStatus) => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('🔄 useAppState: App state changed from', appState.current, 'to', nextAppState);
      
      if (onAppStateChange) {
        onAppStateChange(nextAppState);
      }
      
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [onAppStateChange]);

  return appState.current;
};

/**
 * Hook specifically for handling authentication cleanup on app backgrounding
 */
export const useAuthCleanupOnExit = (clearAuthFunction: () => Promise<void>) => {
  useAppState(async (nextAppState) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('🚪 useAuthCleanupOnExit: Clearing auth due to app state change');
      try {
        await clearAuthFunction();
        console.log('✅ useAuthCleanupOnExit: Auth cleared successfully');
      } catch (error) {
        console.error('❌ useAuthCleanupOnExit: Failed to clear auth:', error);
      }
    }
  });
};

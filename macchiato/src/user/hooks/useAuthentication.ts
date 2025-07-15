/**
 * useAuthentication Hook
 * 
 * Handles user authentication API calls with centralized loading/error states.
 * Single responsibility: user authentication operations.
 */

import { useCallback, useRef } from 'react';
import { useAPI } from '../../common/hooks';
import { UserService } from '../services/UserService';
import { AuthCredentialsCommand, AuthResponse } from '../services/commands/AuthCredentialsCommand';

interface UseAuthenticationReturn {
  loading: boolean;
  error: any;
  authenticate: (credentials: AuthCredentialsCommand) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useAuthentication = (): UseAuthenticationReturn => {
  const isExecutingRef = useRef(false);
  
  const {
    loading,
    error,
    execute,
    clearError,
    reset,
  } = useAPI<AuthResponse>({
    onSuccess: (data) => {
      console.log('✅ User authentication successful:', {
        success: data.success,
        userKey: data.data?.userKey,
        username: data.data?.username,
        tokenType: data.data?.tokenType,
      });
      isExecutingRef.current = false;
    },
    onError: (error) => {
      console.error('❌ User authentication failed:');
      console.error('  - Error type:', error.constructor.name);
      console.error('  - Message:', error.message);
      console.error('  - Status code:', error.statusCode);
      console.error('  - Response data:', error.response);
      isExecutingRef.current = false;
    },
  });

  const logout = useCallback(async (): Promise<void> => {
    console.log('🎯 useAuthentication.logout() called');
    
    try {
      await UserService.logout();
      console.log('✅ Logout completed successfully');
      
      // Reset the hook state
      reset();
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  }, [reset]);

  const authenticate = useCallback(async (credentials: AuthCredentialsCommand): Promise<AuthResponse | null> => {
    console.log('🎯 useAuthentication.authenticate() called');
    console.log('📊 Current state - loading:', loading, 'isExecuting:', isExecutingRef.current);
    console.log('📋 Credentials to authenticate:', JSON.stringify({ username: credentials.username, password: '[REDACTED]' }, null, 2));
    
    // Prevent duplicate calls
    if (loading || isExecutingRef.current) {
      console.log('⏸️ Authentication already in progress, ignoring duplicate call');
      return null;
    }
    
    try {
      // Validate the command using UserService validation
      console.log('🔍 Validating authentication credentials...');
      UserService.validateAuthCredentialsCommand(credentials);
      console.log('✅ Authentication credentials validation passed');
    } catch (validationError) {
      console.error('❌ Authentication credentials validation failed:', validationError);
      throw validationError;
    }
    
    isExecutingRef.current = true;
    
    return execute(() => {
      console.log('🔄 Executing UserService.authenticate...');
      return UserService.authenticate(credentials);
    });
  }, [execute, loading]);

  return {
    loading,
    error,
    authenticate,
    logout,
    clearError,
    reset,
  };
};

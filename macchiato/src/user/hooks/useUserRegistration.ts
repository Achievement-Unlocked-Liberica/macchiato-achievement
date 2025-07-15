/**
 * useUserRegistration Hook
 * 
 * Handles user registration API calls with centralized loading/error states.
 * Single responsibility: user registration operations.
 */

import { useCallback, useRef } from 'react';
import { useAPI } from '../../common/hooks';
import { UserService } from '../services/UserService';
import { RegisterUserCommand, RegisterUserResponse } from '../services/commands/RegisterUserCommand';

interface UseUserRegistrationReturn {
  loading: boolean;
  error: any;
  registerUser: (userData: RegisterUserCommand) => Promise<RegisterUserResponse | null>;
  clearError: () => void;
  reset: () => void;
}

export const useUserRegistration = (): UseUserRegistrationReturn => {
  const isExecutingRef = useRef(false);
  
  const {
    loading,
    error,
    execute,
    clearError,
    reset,
  } = useAPI<RegisterUserResponse>({
    onSuccess: (data) => {
      console.log('✅ User registration successful:', JSON.stringify(data, null, 2));
      isExecutingRef.current = false;
    },
    onError: (error) => {
      console.error('❌ User registration failed:');
      console.error('  - Error type:', error.constructor.name);
      console.error('  - Message:', error.message);
      console.error('  - Status code:', error.statusCode);
      console.error('  - Response data:', error.response);
      isExecutingRef.current = false;
    },
  });

  const registerUser = useCallback(async (userData: RegisterUserCommand): Promise<RegisterUserResponse | null> => {
    console.log('🎯 useUserRegistration.registerUser() called');
    console.log('📊 Current state - loading:', loading, 'isExecuting:', isExecutingRef.current);
    console.log('📋 User data to register:', JSON.stringify(userData, null, 2));
    
    // Prevent duplicate calls
    if (loading || isExecutingRef.current) {
      console.log('⏸️ Registration already in progress, ignoring duplicate call');
      return null;
    }
    
    try {
      // Validate the command using UserService validation
      console.log('🔍 Validating user command...');
      UserService.validateRegisterUserCommand(userData);
      console.log('✅ User command validation passed');
    } catch (validationError) {
      console.error('❌ User command validation failed:', validationError);
      throw validationError;
    }
    
    isExecutingRef.current = true;
    
    return execute(() => {
      console.log('🔄 Executing UserService.registerUser...');
      return UserService.registerUser(userData);
    });
  }, [execute, loading]);

  return {
    loading,
    error,
    registerUser,
    clearError,
    reset,
  };
};

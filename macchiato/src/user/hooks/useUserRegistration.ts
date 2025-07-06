/**
 * useUserRegistration Hook
 * 
 * Ha  const registerUser = useCallback(async (userData: AddUserCommand): Promise<AddUserResponse | null> => {
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
      UserService.validateAddUserCommand(userData);
      console.log('✅ User command validation passed');
    } catch (validationError) {
      console.error('❌ User command validation failed:', validationError);
      throw validationError;
    }
    
    isExecutingRef.current = true;
    
    return execute(() => {
      console.log('🔄 Executing UserService.addUser...');
      return UserService.addUser(userData);
    });
  }, [execute, loading]);ation API calls with centralized loading/error states.
 * Single responsibility: user registration operations.
 */

import { useCallback, useRef } from 'react';
import { useAPI } from '../../common/hooks';
import { UserService } from '../services/UserService';
import { AddUserCommand, AddUserResponse } from '../services/commands/AddUserCommand';

interface UseUserRegistrationReturn {
  loading: boolean;
  error: any;
  registerUser: (userData: AddUserCommand) => Promise<AddUserResponse | null>;
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
  } = useAPI<AddUserResponse>({
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

  const registerUser = useCallback(async (userData: AddUserCommand): Promise<AddUserResponse | null> => {
    console.log('🎯 useUserRegistration.registerUser() called');
    console.log('� Current state - loading:', loading, 'isExecuting:', isExecutingRef.current);
    console.log('�📋 User data to register:', JSON.stringify(userData, null, 2));
    
    // Prevent duplicate calls
    if (loading || isExecutingRef.current) {
      console.log('⏸️ Registration already in progress, ignoring duplicate call');
      return null;
    }
    
    isExecutingRef.current = true;
    
    return execute(() => {
      console.log('🔄 Executing UserService.addUser...');
      return UserService.addUser(userData);
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

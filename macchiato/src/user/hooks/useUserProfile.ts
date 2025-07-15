/**
 * useUserProfile Hook
 * 
 * Handles user profile API calls with centralized loading/error states.
 * Single responsibility: user profile operations.
 */

import { useCallback, useRef } from 'react';
import { useAPI } from '../../common/hooks';
import { UserService } from '../services/UserService';
import { UserDto } from '../models/UserDto';

interface UseUserProfileReturn {
  loading: boolean;
  error: any;
  userProfile: UserDto | null;
  getUserProfile: () => Promise<UserDto | null>;
  clearError: () => void;
  reset: () => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const isExecutingRef = useRef(false);
  
  const {
    loading,
    error,
    data: userProfile,
    execute,
    clearError,
    reset,
  } = useAPI<UserDto>({
    onSuccess: (data) => {
      console.log('✅ User profile retrieved successfully:', {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        entityKey: data.entityKey,
      });
      isExecutingRef.current = false;
    },
    onError: (error) => {
      console.error('❌ User profile retrieval failed:');
      console.error('  - Error type:', error.constructor.name);
      console.error('  - Message:', error.message);
      console.error('  - Status code:', error.statusCode);
      console.error('  - Response data:', error.response);
      isExecutingRef.current = false;
    },
  });

  const getUserProfile = useCallback(async (): Promise<UserDto | null> => {
    console.log('🎯 useUserProfile.getUserProfile() called');
    console.log('📊 Current state - loading:', loading, 'isExecuting:', isExecutingRef.current);
    
    // Prevent duplicate calls
    if (loading || isExecutingRef.current) {
      console.log('⏸️ Profile retrieval already in progress, ignoring duplicate call');
      return null;
    }
    
    isExecutingRef.current = true;
    
    return execute(() => {
      console.log('🔄 Executing UserService.getUserProfile...');
      return UserService.getUserProfile();
    });
  }, [execute, loading]);

  return {
    loading,
    error,
    userProfile,
    getUserProfile,
    clearError,
    reset,
  };
};

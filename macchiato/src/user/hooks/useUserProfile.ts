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
  const profileFetchedRef = useRef(false);
  
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
      profileFetchedRef.current = true;
    },
    onError: (error) => {
      console.error('❌ User profile retrieval failed:');
      console.error('  - Error type:', error.constructor.name);
      console.error('  - Message:', error.message);
      console.error('  - Status code:', error.statusCode);
      console.error('  - Response data:', error.response);
      isExecutingRef.current = false;
      profileFetchedRef.current = false;
    },
  });

  const getUserProfile = useCallback(async (): Promise<UserDto | null> => {
    console.log('🎯 useUserProfile.getUserProfile() called');
    console.log('📊 Current state - loading:', loading, 'isExecuting:', isExecutingRef.current, 'profileFetched:', profileFetchedRef.current);
    
    // If we already have the profile and it was successfully fetched, don't fetch again
    if (userProfile && profileFetchedRef.current) {
      console.log('✅ Profile already available, skipping fetch');
      return userProfile;
    }
    
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
  }, [execute, loading, userProfile]);

  const customReset = useCallback(() => {
    console.log('🔄 Resetting user profile state and cache...');
    profileFetchedRef.current = false;
    isExecutingRef.current = false;
    reset();
  }, [reset]);

  return {
    loading,
    error,
    userProfile,
    getUserProfile,
    clearError,
    reset: customReset,
  };
};

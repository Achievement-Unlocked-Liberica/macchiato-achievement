/**
 * Authentication Context
 * 
 * Provides global authentication state management across the app.
 * Handles login status, user info, and token management.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { TokenStorageService, StoredAuthData } from '../services/tokenStorage';
import { AppStateService } from '../services/appStateService';
import { UserDto } from '../../user/models/UserDto';
import { UserService } from '../../user/services/UserService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredAuthData | null;
  userProfile: UserDto | null;
  loading: boolean;
  profileLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  setAuthData: (data: StoredAuthData) => void;
  setUserProfile: (profile: UserDto) => void;
  clearAuth: () => Promise<void>;
  getUserProfile: () => Promise<UserDto | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredAuthData | null>(null);
  const [userProfile, setUserProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileFetchedRef = useRef(false);

  const checkAuthStatus = async () => {
    console.log('🔍 AuthProvider: Checking authentication status...');
    setLoading(true);
    
    try {
      const authData = await TokenStorageService.getAuthData();
      if (authData) {
        console.log('✅ AuthProvider: User is authenticated:', authData.username);
        setIsAuthenticated(true);
        setUser(authData);
      } else {
        console.log('📭 AuthProvider: No authentication data found');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ AuthProvider: Failed to check auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setAuthData = (data: StoredAuthData) => {
    console.log('🔐 AuthProvider: Setting auth data for user:', data.username);
    setIsAuthenticated(true);
    setUser(data);
  };

  const getUserProfile = async (): Promise<UserDto | null> => {
    console.log('🎯 AuthProvider.getUserProfile() called');
    
    // If we already have the profile and it was successfully fetched, don't fetch again
    if (userProfile && profileFetchedRef.current) {
      console.log('✅ Profile already available in AuthContext, skipping fetch');
      return userProfile;
    }
    
    // Prevent duplicate calls
    if (profileLoading) {
      console.log('⏸️ Profile retrieval already in progress, ignoring duplicate call');
      return null;
    }
    
    try {
      setProfileLoading(true);
      console.log('🔄 Fetching user profile from API...');
      const profile = await UserService.getUserProfile();
      setUserProfile(profile);
      profileFetchedRef.current = true;
      console.log('✅ User profile retrieved and cached in AuthContext');
      return profile;
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      profileFetchedRef.current = false;
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const clearAuth = async () => {
    console.log('🚪 AuthProvider: Clearing authentication...');
    try {
      await TokenStorageService.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      setUserProfile(null);
      profileFetchedRef.current = false;
      console.log('✅ AuthProvider: Authentication and profile cleared');
    } catch (error) {
      console.error('❌ AuthProvider: Failed to clear auth:', error);
      throw error;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
    
    // Initialize app state monitoring for automatic sign out
    AppStateService.initialize(async () => {
      console.log('🚪 AuthProvider: App state triggered auth clear');
      setIsAuthenticated(false);
      setUser(null);
      setUserProfile(null);
      profileFetchedRef.current = false;
    });
    
    // Cleanup on unmount
    return () => {
      AppStateService.cleanup();
    };
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    userProfile,
    loading,
    profileLoading,
    checkAuthStatus,
    setAuthData,
    setUserProfile,
    clearAuth,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

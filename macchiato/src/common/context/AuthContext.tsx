/**
 * Authentication Context
 * 
 * Provides global authentication state management across the app.
 * Handles login status, user info, and token management.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TokenStorageService, StoredAuthData } from '../services/tokenStorage';
import { AppStateService } from '../services/appStateService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredAuthData | null;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
  setAuthData: (data: StoredAuthData) => void;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredAuthData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const clearAuth = async () => {
    console.log('🚪 AuthProvider: Clearing authentication...');
    try {
      await TokenStorageService.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      console.log('✅ AuthProvider: Authentication cleared');
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
    });
    
    // Cleanup on unmount
    return () => {
      AppStateService.cleanup();
    };
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    checkAuthStatus,
    setAuthData,
    clearAuth,
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

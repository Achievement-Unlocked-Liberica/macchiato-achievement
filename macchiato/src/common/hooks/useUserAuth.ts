/**
 * useUserAuth Hook
 * 
 * Manages user authentication state, token storage, and session management.
 * Provides a centralized authentication interface across the app.
 * 
 * Note: Currently simplified without AsyncStorage dependency
 */

import { useState, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseUserAuthReturn extends AuthState {
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  clearError: () => void;
  error: string | null;
}

export const useUserAuth = (): UseUserAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });
  
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sign in user (simplified without persistence for now)
  const signIn = useCallback(async (user: User, token: string) => {
    setError(null);
    
    try {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Sign out user
  const signOut = useCallback(async () => {
    setError(null);
    
    try {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
    }
  }, []);

  // Update user information
  const updateUser = useCallback(async (userUpdates: Partial<User>) => {
    if (!authState.user) {
      throw new Error('No user is currently signed in');
    }

    setError(null);
    const updatedUser = { ...authState.user, ...userUpdates };
    
    try {
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [authState.user]);

  return {
    ...authState,
    signIn,
    signOut,
    updateUser,
    clearError,
    error,
  };
};

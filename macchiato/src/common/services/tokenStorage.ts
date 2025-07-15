/**
 * Token Storage Service
 * 
 * Provides secure storage and retrieval of JWT tokens using Expo SecureStore.
 * Handles token persistence across app sessions with encryption.
 */

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_jwt_token';
const TOKEN_TYPE_KEY = 'user_token_type';
const USER_KEY = 'user_key';
const USERNAME_KEY = 'username';
const EMAIL_KEY = 'user_email';

export interface StoredAuthData {
  token: string;
  tokenType: string;
  userKey: string;
  username: string;
  email: string;
}

export class TokenStorageService {
  /**
   * Store authentication data securely
   * 
   * @param authData - The authentication data to store
   */
  static async storeAuthData(authData: StoredAuthData): Promise<void> {
    console.log('🔐 TokenStorageService.storeAuthData() called');
    console.log('📝 Storing auth data for user:', authData.username);
    
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, authData.token),
        SecureStore.setItemAsync(TOKEN_TYPE_KEY, authData.tokenType),
        SecureStore.setItemAsync(USER_KEY, authData.userKey),
        SecureStore.setItemAsync(USERNAME_KEY, authData.username),
        SecureStore.setItemAsync(EMAIL_KEY, authData.email),
      ]);
      
      console.log('✅ Auth data stored securely');
    } catch (error) {
      console.error('❌ Failed to store auth data:', error);
      throw new Error('Failed to store authentication data securely');
    }
  }

  /**
   * Retrieve stored authentication data
   * 
   * @returns Promise with stored auth data or null if not found
   */
  static async getAuthData(): Promise<StoredAuthData | null> {
    console.log('🔐 TokenStorageService.getAuthData() called');
    
    try {
      const [token, tokenType, userKey, username, email] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(TOKEN_TYPE_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(USERNAME_KEY),
        SecureStore.getItemAsync(EMAIL_KEY),
      ]);

      if (!token || !tokenType || !userKey || !username || !email) {
        console.log('📭 No complete auth data found in secure storage');
        return null;
      }

      const authData: StoredAuthData = {
        token,
        tokenType,
        userKey,
        username,
        email,
      };

      console.log('✅ Auth data retrieved successfully for user:', username);
      return authData;
    } catch (error) {
      console.error('❌ Failed to retrieve auth data:', error);
      return null;
    }
  }

  /**
   * Get only the authorization header value
   * 
   * @returns Promise with authorization header value or null
   */
  static async getAuthorizationHeader(): Promise<string | null> {
    console.log('🔐 TokenStorageService.getAuthorizationHeader() called');
    
    try {
      const [token, tokenType] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(TOKEN_TYPE_KEY),
      ]);

      if (!token || !tokenType) {
        console.log('📭 No token found for authorization header');
        return null;
      }

      const authHeader = `${tokenType} ${token}`;
      console.log('✅ Authorization header prepared:', `${tokenType} ${token.substring(0, 20)}...`);
      return authHeader;
    } catch (error) {
      console.error('❌ Failed to get authorization header:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   * 
   * @returns Promise with boolean indicating authentication status
   */
  static async isAuthenticated(): Promise<boolean> {
    console.log('🔐 TokenStorageService.isAuthenticated() called');
    
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const isAuth = !!token;
      console.log('🔍 Authentication status:', isAuth);
      return isAuth;
    } catch (error) {
      console.error('❌ Failed to check authentication status:', error);
      return false;
    }
  }

  /**
   * Clear all stored authentication data (logout)
   */
  static async clearAuthData(): Promise<void> {
    console.log('🔐 TokenStorageService.clearAuthData() called');
    
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(TOKEN_TYPE_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
        SecureStore.deleteItemAsync(USERNAME_KEY),
        SecureStore.deleteItemAsync(EMAIL_KEY),
      ]);
      
      console.log('✅ Auth data cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear auth data:', error);
      throw new Error('Failed to clear authentication data');
    }
  }

  /**
   * Get current user information from stored data
   * 
   * @returns Promise with user info or null
   */
  static async getCurrentUser(): Promise<{ userKey: string; username: string; email: string } | null> {
    console.log('🔐 TokenStorageService.getCurrentUser() called');
    
    try {
      const [userKey, username, email] = await Promise.all([
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(USERNAME_KEY),
        SecureStore.getItemAsync(EMAIL_KEY),
      ]);

      if (!userKey || !username || !email) {
        console.log('📭 No user info found in secure storage');
        return null;
      }

      const userInfo = { userKey, username, email };
      console.log('✅ Current user info retrieved:', { username, userKey });
      return userInfo;
    } catch (error) {
      console.error('❌ Failed to get current user info:', error);
      return null;
    }
  }
}

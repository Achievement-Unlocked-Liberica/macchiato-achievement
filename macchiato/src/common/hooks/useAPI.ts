/**
 * useAPI Hook
 * 
 * Centralized API call management with loading states, error handling, and caching.
 * Provides a consistent interface for all API operations.
 */

import { useState, useCallback, useRef } from 'react';
import { ApiResponse, ApiError } from '../services/apiConfig';

interface UseAPIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  cacheKey?: string;
}

interface UseAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
  clearError: () => void;
}

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAPI = <T = any>(options: UseAPIOptions = {}): UseAPIReturn<T> => {
  const { onSuccess, onError, cacheKey } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  // Prevent multiple simultaneous requests
  const requestRef = useRef<Promise<T | null> | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    requestRef.current = null;
  }, []);

  const getCachedData = useCallback((key: string): T | null => {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: T) => {
    apiCache.set(key, { data, timestamp: Date.now() });
  }, []);

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    console.log('🔄 useAPI.execute() called');
    console.log('📊 Current state - loading:', loading, 'hasActiveRequest:', !!requestRef.current);
    
    // Return existing promise if request is already in progress
    if (requestRef.current) {
      console.log('⏳ Request already in progress, returning existing promise');
      return requestRef.current;
    }

    // Check cache first
    if (cacheKey) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log('📦 Returning cached data for key:', cacheKey);
        setData(cachedData);
        return cachedData;
      }
    }

    console.log('🚀 Starting new API request...');
    setLoading(true);
    setError(null);

    const request = (async () => {
      try {
        console.log('📞 Calling API function...');
        const result = await apiCall();
        console.log('✅ API call successful in useAPI');
        setData(result);
        
        // Cache the result if cacheKey is provided
        if (cacheKey) {
          console.log('💾 Caching result with key:', cacheKey);
          setCachedData(cacheKey, result);
        }
        
        onSuccess?.(result);
        return result;
      } catch (err) {
        console.error('❌ API call failed in useAPI:');
        
        const apiError = err instanceof ApiError ? err : new ApiError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        
        console.error('  - Final ApiError details:');
        console.error('    - Message:', apiError.message);
        console.error('    - Status Code:', apiError.statusCode);
        console.error('    - Response:', apiError.response);
        
        setError(apiError);
        onError?.(apiError);
        return null;
      } finally {
        console.log('🏁 API request completed, setting loading to false');
        setLoading(false);
        requestRef.current = null;
      }
    })();

    requestRef.current = request;
    return request;
  }, [cacheKey, getCachedData, setCachedData, onSuccess, onError]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    clearError,
  };
};

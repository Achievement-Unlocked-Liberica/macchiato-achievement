/**
 * useAsyncStorage Hook
 * 
 * Wrapper for React Native's AsyncStorage with better error handling and TypeScript support.
 * Provides a consistent interface for local data persistence.
 */

import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAsyncStorageReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setItem: (value: T) => Promise<void>;
  getItem: () => Promise<T | null>;
  removeItem: () => Promise<void>;
  clearError: () => void;
}

export const useAsyncStorage = <T = any>(key: string): UseAsyncStorageReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setItem = useCallback(async (value: T) => {
    setLoading(true);
    setError(null);
    
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      setData(value);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save data';
      setError(errorMessage);
      console.error(`AsyncStorage setItem error for key "${key}":`, err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const getItem = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const parsedValue = jsonValue != null ? JSON.parse(jsonValue) : null;
      setData(parsedValue);
      return parsedValue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve data';
      setError(errorMessage);
      console.error(`AsyncStorage getItem error for key "${key}":`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [key]);

  const removeItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await AsyncStorage.removeItem(key);
      setData(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove data';
      setError(errorMessage);
      console.error(`AsyncStorage removeItem error for key "${key}":`, err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  return {
    data,
    loading,
    error,
    setItem,
    getItem,
    removeItem,
    clearError,
  };
};

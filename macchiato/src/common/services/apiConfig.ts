/**
 * Common API Configuration
 * 
 * Contains shared configuration for all API service calls including
 * base URL, headers, and common request settings.
 */

import { secureDevFetch, logNetworkError, isTrustedDevIP } from '../utils/networkSecurity';

export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.14:8080',
  ENDPOINTS: {
    USER: '/api/cmd/user',
    REGISTER: '/api/cmd/security/register',
    AUTH: '/api/cmd/security/auth',
  },
} as const;

/**
 * Common headers for all API requests
 */
export const getCommonHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'accept': 'application/json',
  'X-API-Version': '1',
});

/**
 * Common fetch options that can be extended by specific services
 */
export const getCommonFetchOptions = (): RequestInit => ({
  headers: getCommonHeaders(),
});

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('🔗 Building API URL:', {
    baseUrl: API_CONFIG.BASE_URL,
    endpoint: endpoint,
    fullUrl: fullUrl,
    isTrustedDev: isTrustedDevIP(fullUrl)
  });
  return fullUrl;
};

/**
 * Enhanced API fetch function that handles development SSL issues
 */
export const apiSecureFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  console.log('🌐 apiSecureFetch called:', {
    url,
    method: options.method || 'GET',
    hasBody: !!options.body
  });

  try {
    const response = await secureDevFetch(url, {
      ...getCommonFetchOptions(),
      ...options,
      headers: {
        ...getCommonHeaders(),
        ...options.headers,
      }
    });

    console.log('✅ apiSecureFetch completed successfully:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });

    return response;
  } catch (error) {
    logNetworkError(error, 'apiSecureFetch');
    throw error;
  }
};

/**
 * Common API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

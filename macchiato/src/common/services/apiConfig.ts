/**
 * Common API Configuration
 * 
 * Contains shared configuration for all API service calls including
 * base URL, headers, and common request settings.
 */

import { secureDevFetch, logNetworkError, isTrustedDevIP } from '../utils/networkSecurity';
import { TokenStorageService } from './tokenStorage';

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
 * 
 * @param includeAuth - Whether to include authorization header (default: true)
 */
export const getCommonHeaders = async (includeAuth: boolean = true): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'X-API-Version': '1',
  };

  // Add authorization header if requested and available
  if (includeAuth) {
    try {
      const authHeader = await TokenStorageService.getAuthorizationHeader();
      if (authHeader) {
        headers['Authorization'] = authHeader;
        console.log('🔐 Authorization header added to request');
      } else {
        console.log('📭 No authorization token available');
      }
    } catch (error) {
      console.error('❌ Failed to get authorization header:', error);
    }
  } else {
    console.log('🔓 Request configured to skip authorization header');
  }

  return headers;
};

/**
 * Common fetch options that can be extended by specific services
 * 
 * @param includeAuth - Whether to include authorization header (default: true)
 */
export const getCommonFetchOptions = async (includeAuth: boolean = true): Promise<RequestInit> => ({
  headers: await getCommonHeaders(includeAuth),
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
 * and automatically includes authentication headers
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options, can override defaults
 * @param includeAuth - Whether to include authorization header (default: true)
 */
export const apiSecureFetch = async (
  url: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<Response> => {
  console.log('🌐 apiSecureFetch called:', {
    url,
    method: options.method || 'GET',
    hasBody: !!options.body,
    includeAuth
  });

  try {
    const commonOptions = await getCommonFetchOptions(includeAuth);
    const commonHeaders = await getCommonHeaders(includeAuth);
    
    const response = await secureDevFetch(url, {
      ...commonOptions,
      ...options,
      headers: {
        ...commonHeaders,
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

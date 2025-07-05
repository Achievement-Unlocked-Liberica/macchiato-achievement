/**
 * Common API Configuration
 * 
 * Contains shared configuration for all API service calls including
 * base URL, headers, and common request settings.
 */

export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.14:8080',
  ENDPOINTS: {
    USER: '/api/cmd/user',
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
  return `${API_CONFIG.BASE_URL}${endpoint}`;
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

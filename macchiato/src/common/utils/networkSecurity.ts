/**
 * Network Security Utilities
 * 
 * Utilities for handling network security in development environments,
 * including self-signed certificates and HTTPS configuration.
 */

import { Platform } from 'react-native';

/**
 * Configuration for development network security
 */
export const DEV_NETWORK_CONFIG = {
  // Allow self-signed certificates in development
  allowSelfSignedCerts: __DEV__,
  // Allow HTTP traffic in development
  allowInsecureTraffic: __DEV__,
  // Development server IP addresses that should be trusted
  trustedDevIPs: ['192.168.0.14', 'localhost', '127.0.0.1', '10.0.2.2'] as string[],
};

/**
 * Enhanced fetch function that handles self-signed certificates in development
 */
export const secureDevFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  console.log('🔐 secureDevFetch called with:', {
    url,
    method: options.method || 'GET',
    isDev: __DEV__,
    platform: Platform.OS
  });

  // In development, we need to handle self-signed certificates
  if (__DEV__) {
    // Add development-specific headers if needed
    const devHeaders = {
      ...options.headers,
      'User-Agent': `Macchiato-Mobile/${Platform.OS}`,
    };

    const enhancedOptions: RequestInit = {
      ...options,
      headers: devHeaders,
    };

    console.log('🛡️ Development mode - enhanced fetch options:', {
      headers: devHeaders,
      method: enhancedOptions.method,
    });

    try {
      const response = await fetch(url, enhancedOptions);
      
      console.log('✅ secureDevFetch successful:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return response;
    } catch (error) {
      console.error('❌ secureDevFetch failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        url,
        platform: Platform.OS
      });

      // Enhanced error handling for common SSL/certificate issues
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('certificate') || 
            errorMessage.includes('ssl') || 
            errorMessage.includes('tls') ||
            errorMessage.includes('network request failed')) {
          
          console.warn('🔒 SSL/Certificate error detected. This is common with self-signed certificates in development.');
          console.warn('📋 Troubleshooting steps:');
          console.warn('  1. Ensure your development server is running with HTTPS');
          console.warn('  2. Try accessing the API URL directly in a browser first');
          console.warn('  3. For Android: Check that network_security_config.xml is properly configured');
          console.warn('  4. For iOS: Check NSAppTransportSecurity settings in app.json');
          console.warn('  5. Consider temporarily switching to HTTP for initial testing');
          
          // Re-throw with enhanced error message
          throw new Error(
            `SSL/Certificate Error: ${error.message}\n\n` +
            'This is likely due to self-signed certificate. Check console for troubleshooting steps.'
          );
        }
      }
      
      throw error;
    }
  }

  // Production mode - use standard fetch
  console.log('🏭 Production mode - using standard fetch');
  return fetch(url, options);
};

/**
 * Check if a given URL uses a trusted development IP
 */
export const isTrustedDevIP = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    const isTrusted = DEV_NETWORK_CONFIG.trustedDevIPs.includes(hostname);
    console.log('🔍 Checking if IP is trusted:', {
      hostname,
      isTrusted,
      trustedIPs: DEV_NETWORK_CONFIG.trustedDevIPs
    });
    
    return isTrusted;
  } catch (error) {
    console.error('❌ Error checking trusted IP:', error);
    return false;
  }
};

/**
 * Get platform-specific network configuration advice
 */
export const getNetworkConfigAdvice = (): string[] => {
  const advice: string[] = [
    'General HTTPS troubleshooting for self-signed certificates:',
    '• Ensure your server certificate includes the correct IP address',
    '• Try accessing the API URL in a browser first to verify connectivity',
  ];

  if (Platform.OS === 'android') {
    advice.push(
      '',
      'Android-specific steps:',
      '• Check that android/app/src/main/res/xml/network_security_config.xml exists',
      '• Verify usesCleartextTraffic is true in app.json for development',
      '• Consider adding your server certificate to the device trust store'
    );
  } else if (Platform.OS === 'ios') {
    advice.push(
      '',
      'iOS-specific steps:',
      '• Check NSAppTransportSecurity settings in app.json',
      '• Verify NSExceptionDomains includes your server IP',
      '• Consider NSAllowsLocalNetworking for local development'
    );
  }

  advice.push(
    '',
    'Alternative solutions:',
    '• Use HTTP instead of HTTPS for local development',
    '• Use a proper SSL certificate (Let\'s Encrypt, etc.)',
    '• Use a tunnel service like ngrok for HTTPS testing'
  );

  return advice;
};

/**
 * Enhanced error logging for network issues
 */
export const logNetworkError = (error: any, context: string) => {
  console.group(`🚨 Network Error in ${context}`);
  
  if (error instanceof Error) {
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
  } else {
    console.error('Unknown Error:', error);
  }
  
  console.log('Platform:', Platform.OS);
  console.log('Development Mode:', __DEV__);
  console.log('Network Config Advice:');
  getNetworkConfigAdvice().forEach(advice => console.log(`  ${advice}`));
  
  console.groupEnd();
};

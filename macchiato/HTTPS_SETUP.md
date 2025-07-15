# HTTPS Configuration for Development

This document explains how to handle HTTPS connections with self-signed certificates in your React Native/Expo development environment.

## Overview

When developing with a local HTTPS API server using self-signed certificates, mobile apps need special configuration to trust these certificates. This project includes several solutions to handle this scenario.

## Current Configuration

### API Configuration
- **Base URL**: `https://192.168.0.14:8443`
- **Endpoint**: `/api/cmd/user`
- **Protocol**: HTTPS with self-signed certificate

### Network Security Implementation

1. **Enhanced Fetch Function** (`src/common/utils/networkSecurity.ts`)
   - Wraps standard fetch with development-specific SSL handling
   - Provides detailed error logging for SSL/certificate issues
   - Includes platform-specific troubleshooting guidance

2. **Expo App Configuration** (`app.json`)
   - iOS: NSAppTransportSecurity exceptions for local development
   - Android: Network security configuration and cleartext traffic permissions

3. **Android Network Security** (`android/app/src/main/res/xml/network_security_config.xml`)
   - Allows cleartext traffic for development IPs
   - Trusts user-added and system certificates for local server

## Testing Your Configuration

Use the `DebugApiTest` component to test your HTTPS connection:

```tsx
import { DebugApiTest } from '../src/common/components/DebugApiTest';

// Add this component to your app temporarily for testing
<DebugApiTest />
```

### Test Functions Available:
1. **Test API Connectivity** - Basic GET request to check connection
2. **Test User Registration** - POST request with mock data
3. **HTTPS Troubleshooting Guide** - Platform-specific guidance

## Common HTTPS Errors and Solutions

### Network Request Failed
**Symptoms**: Fetch fails with "Network request failed" message
**Solutions**:
1. Verify your API server is running and accessible
2. Test the URL directly in a browser first
3. Check network connectivity
4. Ensure the IP address in `apiConfig.ts` matches your server

### SSL/Certificate Errors
**Symptoms**: Certificate verification errors, SSL handshake failures
**Solutions**:

#### For Android:
1. Ensure `network_security_config.xml` is present and configured
2. Verify `usesCleartextTraffic: true` in `app.json`
3. Try clearing the app data and rebuilding
4. Consider adding the certificate to the device trust store

#### For iOS:
1. Check `NSAppTransportSecurity` settings in `app.json`
2. Verify the server IP is listed in `NSExceptionDomains`
3. Enable `NSAllowsLocalNetworking` for local development
4. Trust the certificate in iOS Settings if testing on a physical device

### Metro/Development Server Issues
**Symptoms**: Connection works in browser but not in app
**Solutions**:
1. Ensure you're using the correct network interface
2. Check that the development server and API server are on the same network
3. Verify firewall settings aren't blocking connections

## Development Workflow

### 1. Start Your API Server
Ensure your HTTPS API server is running on `https://192.168.0.14:8443`

### 2. Test in Browser
Before testing in the mobile app, verify the API works in a browser:
```
https://192.168.0.14:8443/api/cmd/user
```
You may need to accept the security warning for the self-signed certificate.

### 3. Run the Mobile App
```bash
npm start
# or
expo start
```

### 4. Test Connection
Use the `DebugApiTest` component to verify connectivity and debug any issues.

### 5. Check Logs
Monitor the console for detailed logs about network requests, SSL issues, and troubleshooting advice.

## Alternative Solutions

If you continue to have issues with HTTPS and self-signed certificates, consider these alternatives:

### Option 1: Use HTTP for Development
Temporarily switch to HTTP for initial development:
```typescript
// In src/common/services/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.14:8080',  // Note: HTTP instead of HTTPS
  // ...
};
```

### Option 2: Use a Proper SSL Certificate
- Use Let's Encrypt for free SSL certificates
- Use a certificate from a trusted CA
- Configure your server with a valid domain name

### Option 3: Use a Tunnel Service
Use services like ngrok to create a secure tunnel:
```bash
ngrok http 8080
# This provides an HTTPS URL that works without certificate issues
```

### Option 4: Certificate Installation
For persistent testing, install the self-signed certificate on your development devices:
- **Android**: Add certificate to user certificate store
- **iOS**: Install and trust the certificate profile

## File Structure

```
macchiato/
├── app.json                                    # Expo configuration with network security
├── android/app/src/main/res/xml/
│   └── network_security_config.xml            # Android network security rules
├── src/common/
│   ├── services/
│   │   └── apiConfig.ts                       # API configuration with secure fetch
│   ├── utils/
│   │   └── networkSecurity.ts                 # Network security utilities
│   └── components/
│       └── DebugApiTest.tsx                   # API testing component
└── src/user/services/
    └── UserService.ts                         # Updated to use secure fetch
```

## Security Considerations

⚠️ **Important**: The configurations in this project are designed for **development only**. 

For production:
- Remove cleartext traffic permissions
- Remove development IP exceptions
- Use proper SSL certificates from trusted CAs
- Remove debug components and verbose logging
- Implement proper certificate pinning

## Need Help?

If you're still experiencing issues:

1. Check the console logs for detailed error information
2. Use the "HTTPS Troubleshooting Guide" button in the debug component
3. Verify your server configuration
4. Consider temporarily switching to HTTP for initial development
5. Test the API endpoint directly in a browser first

## Logging

All network requests include detailed logging:
- Request URLs and options
- Response status and headers
- Error details with troubleshooting guidance
- Platform-specific configuration advice

Check your development console for comprehensive debugging information.

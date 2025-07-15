/**
 * Debug API Test Component
 * 
 * A simple component to test API connectivity and debug network issues.
 * This can be temporarily added to help diagnose API problems.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { API_CONFIG, buildApiUrl, apiSecureFetch } from '../services/apiConfig';
import { getNetworkConfigAdvice } from '../utils/networkSecurity';

export const DebugApiTest: React.FC = () => {
  const testApiConnection = async () => {
    console.log('🧪 Testing API connection...');
    
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER);
      console.log('🎯 Testing URL:', url);
      
      // Test basic connectivity first with a GET request
      const testResponse = await apiSecureFetch(url, {
        method: 'GET',
      });
      
      console.log('📡 Basic connectivity test result:');
      console.log('  - Status:', testResponse.status);
      console.log('  - Status Text:', testResponse.statusText);
      console.log('  - Headers:', Object.fromEntries(testResponse.headers.entries()));
      
      const responseText = await testResponse.text();
      console.log('  - Response body:', responseText);
      
      Alert.alert(
        'API Test Result',
        `Status: ${testResponse.status} ${testResponse.statusText}\n\nCheck console for detailed logs.`
      );
      
    } catch (error) {
      console.error('🚨 API connectivity test failed:');
      if (error instanceof Error) {
        console.error('  - Message:', error.message);
        console.error('  - Stack:', error.stack);
      }
      
      // Show network troubleshooting advice
      console.log('📋 Network troubleshooting advice:');
      getNetworkConfigAdvice().forEach(advice => console.log(`  ${advice}`));
      
      Alert.alert(
        'API Test Failed',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  };

  const testUserRegistration = async () => {
    console.log('🧪 Testing user registration with mock data...');
    
    const mockUserData = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      birthDate: '1990-01-01'
    };
    
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER);
      
      const response = await apiSecureFetch(url, {
        method: 'POST',
        body: JSON.stringify(mockUserData),
      });
      
      console.log('📊 Registration test result:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      
      const responseText = await response.text();
      console.log('  - Response body:', responseText);
      
      Alert.alert(
        'Registration Test',
        `Status: ${response.status}\n\nCheck console for details.`
      );
      
    } catch (error) {
      console.error('🚨 Registration test failed:', error);
      
      // Show network troubleshooting advice
      console.log('📋 Network troubleshooting advice:');
      getNetworkConfigAdvice().forEach(advice => console.log(`  ${advice}`));
      
      Alert.alert('Registration Test Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const showTroubleshootingInfo = () => {
    const advice = getNetworkConfigAdvice();
    const message = advice.join('\n');
    
    Alert.alert(
      'HTTPS Troubleshooting Guide',
      message,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };

  return (
    <View className="p-4 bg-background-primary">
      <Text className="text-text-primary text-lg font-bold mb-4">API Debug Tools</Text>
      
      <TouchableOpacity 
        className="bg-accent-500 p-3 rounded-lg mb-3"
        onPress={testApiConnection}
      >
        <Text className="text-text-inverse text-center font-medium">Test API Connectivity</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-blue-500 p-3 rounded-lg mb-3"
        onPress={testUserRegistration}
      >
        <Text className="text-white text-center font-medium">Test User Registration</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-orange-500 p-3 rounded-lg mb-3"
        onPress={showTroubleshootingInfo}
      >
        <Text className="text-white text-center font-medium">HTTPS Troubleshooting Guide</Text>
      </TouchableOpacity>
      
      <Text className="text-text-secondary text-sm mt-4">
        Check the console logs for detailed information about API requests and responses.
        For HTTPS issues with self-signed certificates, use the troubleshooting guide.
      </Text>
    </View>
  );
};

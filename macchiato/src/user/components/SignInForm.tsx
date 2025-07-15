import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useForm } from '../../common/hooks';
import { SignInFormData, signInValidationRules } from '../validation';
import { useAuthentication } from '../hooks';
import { AuthCredentialsCommand } from '../services/commands/AuthCredentialsCommand';
import { useAuthContext } from '../../common/context';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface SignInFormProps {
  onSubmit: (formData: SignInFormData) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface SignInFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

const initialFormData: SignInFormData = {
  username: '',
  password: '',
};

const SignInForm = forwardRef<SignInFormRef, SignInFormProps>(({ onSubmit, onLoadingChange }, ref) => {
  const navigation = useNavigation<NavigationProp>();
  const { authenticate, loading, error } = useAuthentication();
  const { setAuthData } = useAuthContext();
  
  // Use the form hook for state management and validation
  const {
    formData,
    errors,
    setFieldValue,
    validateForm,
    reset,
    handleSubmit: formHandleSubmit,
  } = useForm<SignInFormData>({
    initialValues: initialFormData,
    validationRules: signInValidationRules,
    onSubmit: async (data) => {
      console.log('📝 SignInForm onSubmit called');
      console.log('📊 Form data:', JSON.stringify({ username: data.username, password: '[REDACTED]' }, null, 2));
      
      // Convert to API format
      const credentials: AuthCredentialsCommand = {
        username: data.username.trim(),
        password: data.password.trim(),
      };
      
      console.log('🔄 Converted to API format:', JSON.stringify({ username: credentials.username, password: '[REDACTED]' }, null, 2));
      
      try {
        const result = await authenticate(credentials);
        if (result && result.success) {
          console.log('✅ Authentication successful:', result);
          
          // Update global auth context
          setAuthData({
            token: result.data.token,
            tokenType: result.data.tokenType,
            userKey: result.data.userKey,
            username: result.data.username,
            email: result.data.email,
          });
          
          // Show success popup with userKey and token
          Alert.alert(
            'Authentication Successful',
            `User Key: ${result.data.userKey}\nToken: ${result.data.token.substring(0, 50)}...`,
            [{ text: 'OK' }]
          );
          
          // Call the onSubmit callback
          onSubmit(data);
        }
      } catch (error: any) {
        console.error('❌ Authentication failed in form onSubmit:', error);
        
        // Show error popup with the server error message
        Alert.alert(
          'Authentication Failed',
          error.message || 'An error occurred during authentication',
          [{ text: 'OK' }]
        );
      }
    },
  });

  // Notify parent component about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  const handleSubmit = async () => {
    try {
      await formHandleSubmit();
    } catch (error) {
      console.error('Sign in submission error:', error);
    }
  };

  const resetForm = () => {
    reset();
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
    resetForm: resetForm,
  }));

  const handleInputChange = (field: keyof SignInFormData, value: string) => {
    setFieldValue(field, value);
  };

  const handleRegisterPress = () => {
    navigation.navigate('Registration');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // TODO: Implement social login functionality
  };

  // Error Alert Component
  const ErrorAlert = ({ message }: { message: string }) => (
    <View className="bg-error-50 border border-error-200 rounded-lg p-3 mt-2 flex-row items-start">
      <View className="mr-2 mt-0.5">
        <FontAwesomeIcon 
          icon={faFaceFrown} 
          size={16} 
          color="#EF4444" 
        />
      </View>
      <Text className="text-error-600 text-sm flex-1 leading-5">{message}</Text>
    </View>
  );

  // Horizontal Line Component
  const HorizontalLine = () => (
    <View className="w-full h-px bg-border-secondary my-4" />
  );

  return (
    <View className="p-6 bg-background-primary">
      {/* Username Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Username</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.username ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Enter your username"
          placeholderTextColor="#9FB3C8"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.username && <ErrorAlert message={errors.username} />}
      </View>

      {/* Password Field */}
      <View className="mb-6">
        <Text className="text-text-primary font-medium mb-2 text-base">Password</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.password ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Enter your password"
          placeholderTextColor="#9FB3C8"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.password && <ErrorAlert message={errors.password} />}
      </View>

      {/* Sign In Button */}
      <TouchableOpacity 
        className={`rounded-lg py-3 px-4 flex-row items-center justify-center gap-2 mb-4 ${
          loading ? 'bg-accent-300' : 'bg-accent-500'
        }`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <FontAwesomeIcon 
          icon={faRightToBracket} 
          size={16} 
          color={loading ? "#9CA3AF" : "#171717"} 
        />
        <Text className={`font-semibold text-base ${
          loading ? 'text-gray-500' : 'text-text-inverse'
        }`}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Horizontal Line */}
      <HorizontalLine />

      {/* Register Button */}
      <TouchableOpacity 
        className="bg-accent-500 rounded-lg py-3 px-4 flex-row items-center justify-center gap-2 mb-4"
        onPress={handleRegisterPress}
      >
        <FontAwesomeIcon 
          icon={faUserPlus} 
          size={16} 
          color="#171717" 
        />
        <Text className="text-text-inverse font-semibold text-base">Register</Text>
      </TouchableOpacity>

      {/* Horizontal Line */}
      <HorizontalLine />

      {/* Social Login Buttons */}
      <View className="flex-row justify-center gap-3">
        {/* Google */}
        <TouchableOpacity 
          className="bg-accent-500 rounded-lg p-4 w-[60px] h-[60px] items-center justify-center"
          onPress={() => handleSocialLogin('Google')}
        >
          <FontAwesomeIcon 
            icon={faGoogle} 
            size={24} 
            color="#DB4437" 
          />
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity 
          className="bg-accent-500 rounded-lg p-4 w-[60px] h-[60px] items-center justify-center"
          onPress={() => handleSocialLogin('Facebook')}
        >
          <FontAwesomeIcon 
            icon={faFacebookF} 
            size={24} 
            color="#4267B2" 
          />
        </TouchableOpacity>

        {/* GitHub */}
        <TouchableOpacity 
          className="bg-accent-500 rounded-lg p-4 w-[60px] h-[60px] items-center justify-center"
          onPress={() => handleSocialLogin('GitHub')}
        >
          <FontAwesomeIcon 
            icon={faGithub} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>

        {/* LinkedIn */}
        <TouchableOpacity 
          className="bg-accent-500 rounded-lg p-4 w-[60px] h-[60px] items-center justify-center"
          onPress={() => handleSocialLogin('LinkedIn')}
        >
          <FontAwesomeIcon 
            icon={faLinkedinIn} 
            size={24} 
            color="#0077B5" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default SignInForm;

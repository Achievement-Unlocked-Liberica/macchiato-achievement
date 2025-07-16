import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '../../common/hooks';
import { RegistrationFormData, registrationValidationRules } from '../validation';
import { useUserRegistration } from '../hooks';
import { RegisterUserCommand } from '../services/commands/RegisterUserCommand';

interface RegistrationFormProps {
  onSubmit: (formData: RegistrationFormData) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export interface RegistrationFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

const initialFormData: RegistrationFormData = {
  username: '',
  password: '',
  passwordConfirmation: '',
  email: '',
  emailConfirmation: '',
};

const RegistrationForm = forwardRef<RegistrationFormRef, RegistrationFormProps>(({ onSubmit, onLoadingChange }, ref) => {
  // Use the form hook for state management and validation
  const {
    formData,
    errors,
    isValid,
    isSubmitting,
    setFieldValue,
    validateForm,
    reset,
    handleSubmit: formHandleSubmit,
  } = useForm<RegistrationFormData>({
    initialValues: initialFormData,
    validationRules: registrationValidationRules,
    onSubmit: async (data) => {
      console.log('📝 RegistrationForm onSubmit called');
      console.log('📊 Form data:', JSON.stringify(data, null, 2));
      
      // Convert to API format
      const apiData: RegisterUserCommand = {
        username: data.username.trim(),
        password: data.password.trim(),
        email: data.email.trim(),
      };
      
      console.log('🔄 Converted to API format:', JSON.stringify(apiData, null, 2));
      
      try {
        const result = await registerUser(apiData);
        console.log('✅ Registration API call successful:', result);
        onSubmit(data);
      } catch (error) {
        console.error('❌ Registration API call failed in form onSubmit:');
        if (error instanceof Error) {
          console.error('  - Message:', error.message);
          console.error('  - Stack:', error.stack);
        } else {
          console.error('  - Error:', error);
        }
        throw error; // Re-throw so handleSubmit can catch it
      }
    },
  });

  // Use user registration hook for API calls
  const { loading: registrationLoading, error: registrationError, registerUser } = useUserRegistration();

  // Notify parent about loading state changes
  const totalLoading = isSubmitting || registrationLoading;
  useEffect(() => {
    onLoadingChange?.(totalLoading);
  }, [totalLoading, onLoadingChange]);

  const handleSubmit = async () => {
    console.log('🎯 RegistrationForm handleSubmit called');
    console.log('📊 Current state - isSubmitting:', isSubmitting, 'registrationLoading:', registrationLoading);
    
    // Prevent duplicate submissions
    if (isSubmitting || registrationLoading) {
      console.log('⏸️ Submission already in progress, ignoring duplicate call');
      return;
    }
    
    try {
      await formHandleSubmit();
      console.log('✅ Form submission completed successfully');
    } catch (error) {
      console.error('💥 Registration submission error in handleSubmit:');
      if (error instanceof Error) {
        console.error('  - Error name:', error.name);
        console.error('  - Error message:', error.message);
        console.error('  - Error stack:', error.stack);
      } else {
        console.error('  - Unknown error type:', typeof error);
        console.error('  - Error value:', error);
      }
      
      Alert.alert(
        'Registration Failed', 
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      );
    }
  };

  const resetForm = () => {
    reset();
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
    resetForm: resetForm,
  }));

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFieldValue(field, value);
  };

  // Error Alert Component
  const ErrorAlert = ({ message }: { message: string }) => (
    <View className="py-1 mt-1 flex-row items-start">
      <View className="mr-2 mt-0.5">
        <FontAwesomeIcon 
          icon={faExclamation} 
          size={16} 
          color="#EF4444" 
        />
      </View>
      <Text className="text-error-500 text-sm flex-1 leading-5">{message}</Text>
    </View>
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
          placeholder="Enter username (5-50 characters)"
          placeholderTextColor="#9FB3C8"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          autoCapitalize="none"
          maxLength={50}
        />
        {errors.username && <ErrorAlert message={errors.username} />}
      </View>

      {/* Password Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Password</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.password ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Enter password (min 8 characters)"
          placeholderTextColor="#9FB3C8"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry={true}
          autoCapitalize="none"
          maxLength={100}
        />
        {errors.password && <ErrorAlert message={errors.password} />}
      </View>

      {/* Password Confirmation Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Confirm Password</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.passwordConfirmation ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Re-enter your password"
          placeholderTextColor="#9FB3C8"
          value={formData.passwordConfirmation}
          onChangeText={(value) => handleInputChange('passwordConfirmation', value)}
          secureTextEntry={true}
          autoCapitalize="none"
          maxLength={100}
        />
        {errors.passwordConfirmation && <ErrorAlert message={errors.passwordConfirmation} />}
      </View>

      {/* Email Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Email</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.email ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Enter email address"
          placeholderTextColor="#9FB3C8"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <ErrorAlert message={errors.email} />}
      </View>

      {/* Email Confirmation Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Confirm Email</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.emailConfirmation ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Re-enter your email address"
          placeholderTextColor="#9FB3C8"
          value={formData.emailConfirmation}
          onChangeText={(value) => handleInputChange('emailConfirmation', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.emailConfirmation && <ErrorAlert message={errors.emailConfirmation} />}
      </View>
    </View>
  );
});

export default RegistrationForm;

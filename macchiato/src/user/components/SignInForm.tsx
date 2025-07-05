import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface SignInFormProps {
  onSubmit: (formData: FormData) => void;
}

export interface SignInFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const SignInForm = forwardRef<SignInFormRef, SignInFormProps>(({ onSubmit }, ref) => {
  const navigation = useNavigation<NavigationProp>();
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field: keyof FormData): boolean => {
    let fieldError: string | undefined;

    switch (field) {
      case 'username':
        if (!formData.username.trim()) {
          fieldError = 'Username is required';
        }
        break;
      case 'password':
        if (!formData.password.trim()) {
          fieldError = 'Password is required';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError,
    }));

    return !fieldError;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
    });
    setErrors({});
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
    resetForm: resetForm,
  }));

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Update state
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
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
        className="bg-accent-500 rounded-lg py-3 px-4 flex-row items-center justify-center gap-2 mb-4"
        onPress={handleSubmit}
      >
        <FontAwesomeIcon 
          icon={faRightToBracket} 
          size={16} 
          color="#171717" 
        />
        <Text className="text-text-inverse font-semibold text-base">Sign In</Text>
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

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';

interface RegistrationFormProps {
  onSubmit: (formData: FormData) => void;
}

export interface RegistrationFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthdate?: string;
}

const RegistrationForm = forwardRef<RegistrationFormRef, RegistrationFormProps>(({ onSubmit }, ref) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    birthdate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Birthdate validation (basic check for MM/DD/YYYY format)
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!formData.birthdate.trim()) {
      newErrors.birthdate = 'Birthdate is required';
    } else if (!dateRegex.test(formData.birthdate)) {
      newErrors.birthdate = 'Please enter date in MM/DD/YYYY format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert('Validation Error', 'Please correct the errors and try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      birthdate: '',
    });
    setErrors({});
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
    resetForm: resetForm,
  }));

  const handleInputChange = (field: keyof FormData, value: string) => {
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

  return (
    <View className="p-6">
      {/* Username Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2 text-base">Username</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-white ${
            errors.username ? 'border-red-500 border-2' : 'border-gray-300'
          }`}
          placeholder="Enter username"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          autoCapitalize="none"
        />
        {errors.username && <Text className="text-red-500 text-sm mt-1 ml-1">{errors.username}</Text>}
      </View>

      {/* Email Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2 text-base">Email</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-white ${
            errors.email ? 'border-red-500 border-2' : 'border-gray-300'
          }`}
          placeholder="Enter email address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email}</Text>}
      </View>

      {/* First Name Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2 text-base">First Name</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-white ${
            errors.firstName ? 'border-red-500 border-2' : 'border-gray-300'
          }`}
          placeholder="Enter first name"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
        />
        {errors.firstName && <Text className="text-red-500 text-sm mt-1 ml-1">{errors.firstName}</Text>}
      </View>

      {/* Last Name Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2 text-base">Last Name</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-white ${
            errors.lastName ? 'border-red-500 border-2' : 'border-gray-300'
          }`}
          placeholder="Enter last name"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
        />
        {errors.lastName && <Text className="text-red-500 text-sm mt-1 ml-1">{errors.lastName}</Text>}
      </View>

      {/* Birthdate Field */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-2 text-base">Birthdate</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-white ${
            errors.birthdate ? 'border-red-500 border-2' : 'border-gray-300'
          }`}
          placeholder="MM/DD/YYYY"
          value={formData.birthdate}
          onChangeText={(value) => handleInputChange('birthdate', value)}
        />
        {errors.birthdate && <Text className="text-red-500 text-sm mt-1 ml-1">{errors.birthdate}</Text>}
      </View>
    </View>
  );
});

export default RegistrationForm;

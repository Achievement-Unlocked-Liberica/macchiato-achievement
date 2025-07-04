import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFaceFrown, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  birthdate: Date | null;
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
    birthdate: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date();

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 5) {
      newErrors.username = 'Username must be at least 5 characters';
    } else if (formData.username.trim().length > 50) {
      newErrors.username = 'Username must not exceed 50 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = 'First name must not exceed 50 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = 'Last name must not exceed 50 characters';
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
    } else {
      const birthDate = formData.birthdate;
      
      // Check if date is in the future
      if (birthDate > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
      } else {
        // Calculate age
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        
        if (actualAge < 13) {
          newErrors.birthdate = 'You must be at least 13 years old to register';
        }
      }
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
      birthdate: null,
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        birthdate: selectedDate,
      }));
      
      // Clear error when date is selected
      if (errors.birthdate) {
        setErrors(prev => ({
          ...prev,
          birthdate: undefined,
        }));
      }
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      {/* First Name Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">First Name</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.firstName ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Enter first name (max 50 characters)"
          placeholderTextColor="#9FB3C8"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
          maxLength={50}
        />
        {errors.firstName && <ErrorAlert message={errors.firstName} />}
      </View>

      {/* Last Name Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Last Name</Text>
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary text-text-primary ${
            errors.lastName ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          placeholder="Enter last name (max 50 characters)"
          placeholderTextColor="#9FB3C8"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
          maxLength={50}
        />
        {errors.lastName && <ErrorAlert message={errors.lastName} />}
      </View>

      {/* Birthdate Field */}
      <View className="mb-4">
        <Text className="text-text-primary font-medium mb-2 text-base">Birthdate</Text>
        <TouchableOpacity
          className={`border rounded-lg px-4 py-3 text-base bg-background-secondary flex-row items-center justify-between ${
            errors.birthdate ? 'border-error-500 border-2' : 'border-border-secondary'
          }`}
          onPress={showDatePickerModal}
        >
          <Text className={`text-base ${formData.birthdate ? 'text-text-primary' : 'text-text-secondary'}`}>
            {formData.birthdate ? formatDate(formData.birthdate) : 'Select birthdate (must be 13+ years old)'}
          </Text>
          <FontAwesomeIcon 
            icon={faCalendarAlt} 
            size={16} 
            color="#9FB3C8" 
          />
        </TouchableOpacity>
        {errors.birthdate && <ErrorAlert message={errors.birthdate} />}
        
        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={formData.birthdate || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
      </View>
    </View>
  );
});

export default RegistrationForm;

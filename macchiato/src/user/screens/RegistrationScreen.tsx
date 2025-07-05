import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RegistrationForm, { RegistrationFormRef } from '../components/RegistrationForm';
import { CancelButton, SubmitButton } from '../../common/components';
import { UserService, AddUserCommand } from '../services';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: Date | null;
}

export default function RegistrationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const formRef = useRef<RegistrationFormRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    console.log('Registration form submitted:', formData);
    
    try {
      setIsSubmitting(true);
      
      // Validate that birthdate is not null
      if (!formData.birthdate) {
        Alert.alert('Error', 'Please select a valid birthdate.');
        return;
      }
      
      // Build the AddUserCommand
      const addUserCommand: AddUserCommand = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        birthDate: UserService.formatDateForApi(formData.birthdate),
      };
      
      // Validate the command
      UserService.validateAddUserCommand(addUserCommand);
      
      // Call the API
      const result = await UserService.addUser(addUserCommand);
      
      console.log('User created successfully:', result);
      
      // Show success message and navigate back
      Alert.alert(
        'Registration Successful',
        `Welcome ${formData.firstName}! Your account has been created.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Registration',
      'Are you sure you want to cancel? All entered information will be lost.',
      [
        {
          text: 'Stay',
          style: 'cancel',
        },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleSubmit = () => {
    // Trigger form validation and submission through the ref
    formRef.current?.submitForm();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header Section */}
      <View className="bg-background-secondary py-4 px-6 items-center">
        <Text className="text-text-primary text-xl font-semibold">Sign In | Register</Text>
      </View>

      {/* Content Section */}
      <ScrollView className="flex-1 bg-background-tertiary" showsVerticalScrollIndicator={false}>
        <RegistrationForm ref={formRef} onSubmit={handleFormSubmit} />
      </ScrollView>

      {/* Footer Section */}
      <View className="bg-background-secondary py-4 px-6 border-t border-border-secondary">
        <View className="flex-row justify-center gap-4">
          <CancelButton onPress={handleCancel} disabled={isSubmitting} />
          <SubmitButton onPress={handleSubmit} loading={isSubmitting} />
        </View>
      </View>
    </SafeAreaView>
  );
}

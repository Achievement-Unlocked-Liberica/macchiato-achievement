import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RegistrationForm, { RegistrationFormRef } from '../components/RegistrationForm';
import { CancelButton, SubmitButton } from '../../common/components';
import { RegistrationFormData } from '../validation';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function RegistrationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const formRef = useRef<RegistrationFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: RegistrationFormData) => {
    console.log('📝 RegistrationScreen.handleFormSubmit - User registration completed successfully');
    console.log('👤 User data:', {
      username: formData.username,
      email: formData.email,
    });
    
    // Show success message and navigate back
    Alert.alert(
      'Registration Successful',
      `Welcome ${formData.username}! Your account has been created.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
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
        <RegistrationForm 
          ref={formRef} 
          onSubmit={handleFormSubmit} 
          onLoadingChange={handleLoadingChange}
        />
      </ScrollView>

      {/* Footer Section */}
      <View className="bg-background-secondary py-4 px-6 border-t border-border-secondary">
        <View className="flex-row justify-center gap-4">
          <CancelButton onPress={handleCancel} disabled={isLoading} />
          <SubmitButton onPress={handleSubmit} loading={isLoading} />
        </View>
      </View>
    </SafeAreaView>
  );
}

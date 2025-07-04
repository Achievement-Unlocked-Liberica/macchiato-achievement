import React, { useRef } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RegistrationForm, { RegistrationFormRef } from '../components/RegistrationForm';
import { CancelButton, SubmitButton } from '../../common/components';

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

  const handleFormSubmit = (formData: FormData) => {
    console.log('Registration form submitted:', formData);
    
    // TODO: Implement actual registration API call here
    // For now, we'll show a success message and navigate back
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="bg-gray-800 py-4 px-6 items-center">
        <Text className="text-white text-xl font-semibold">Sign In | Register</Text>
      </View>

      {/* Content Section */}
      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
        <RegistrationForm ref={formRef} onSubmit={handleFormSubmit} />
      </ScrollView>

      {/* Footer Section */}
      <View className="bg-white py-4 px-6 border-t border-gray-200">
        <View className="flex-row justify-center gap-4">
          <CancelButton onPress={handleCancel} />
          <SubmitButton onPress={handleSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
}

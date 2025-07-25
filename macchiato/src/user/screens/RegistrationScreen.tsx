import React, { useRef, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import RegistrationForm, { RegistrationFormRef } from '../components/RegistrationForm';
import { RegistrationFooter } from '../components/RegistrationFooter';
import { RegistrationFormData } from '../validation';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function RegistrationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { updateLayout } = useLayout();
  const formRef = useRef<RegistrationFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Configure layout for registration screen
    updateLayout({
      header: {
        visible: true,
        showLogo: true,
        showProfile: true,
      },
    });
  }, [updateLayout]);

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
    <LayoutWrapper footer={<RegistrationFooter onCancel={handleCancel} onSubmit={handleSubmit} isLoading={isLoading} />}>
      <RegistrationForm 
        ref={formRef} 
        onSubmit={handleFormSubmit} 
        onLoadingChange={handleLoadingChange}
      />
    </LayoutWrapper>
  );
}

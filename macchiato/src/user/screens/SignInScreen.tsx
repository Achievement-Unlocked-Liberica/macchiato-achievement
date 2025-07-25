import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import SignInForm, { SignInFormRef } from '../components/SignInForm';
import { SignInFooter } from '../components/SignInFooter';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface FormData {
  username: string;
  password: string;
}

export default function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { updateLayout } = useLayout();
  const formRef = useRef<SignInFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Configure layout for sign in screen
    updateLayout({
      header: {
        visible: true,
        showLogo: true,
        showProfile: true,
      },
    });
  }, [updateLayout]);

  const handleFormSubmit = (formData: FormData) => {
    console.log('Sign in form submitted:', formData);
    
    // TODO: Implement actual sign in API call here
    // For now, we'll show a success message and navigate back
    Alert.alert(
      'Sign In Successful',
      `Welcome back, ${formData.username}!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.navigate('Main');
  };

  const handleSubmit = () => {
    // Trigger form validation and submission through the ref
    formRef.current?.submitForm();
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LayoutWrapper footer={<SignInFooter onCancel={handleCancel} onSubmit={handleSubmit} isLoading={isLoading} />}>
      <SignInForm 
        ref={formRef}
        onSubmit={handleFormSubmit}
        onLoadingChange={handleLoadingChange}
      />
    </LayoutWrapper>
  );
}

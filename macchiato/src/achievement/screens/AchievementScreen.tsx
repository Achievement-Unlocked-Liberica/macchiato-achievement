/**
 * AchievementScreen
 * 
 * Screen for managing achievements, starting with creation
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import AchievementForm, { AchievementFormRef } from '../components/AchievementForm';
import { AchievementFormData } from '../validation/achievementValidation';
import { AchievementFooter } from '../components/AchievementFooter';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
  Achievement: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function AchievementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { updateLayout } = useLayout();
  const formRef = useRef<AchievementFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Configure layout for achievement screen
    updateLayout({
      header: {
        visible: true,
        showLogo: true,
        showProfile: true,
        customTitle: 'Create Achievement',
      },
    });
  }, [updateLayout]);

  const handleFormSubmit = (formData: AchievementFormData) => {
    console.log('Achievement form submitted:', formData);
    // Navigate back to main screen after successful creation
    navigation.navigate('Main');
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
    <LayoutWrapper footer={<AchievementFooter onCancel={handleCancel} onSubmit={handleSubmit} isLoading={isLoading} />}>
      <AchievementForm 
        ref={formRef}
        onSubmit={handleFormSubmit}
        onLoadingChange={handleLoadingChange}
      />
    </LayoutWrapper>
  );
}

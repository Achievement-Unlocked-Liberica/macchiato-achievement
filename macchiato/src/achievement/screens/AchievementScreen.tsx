/**
 * AchievementScreen
 * 
 * Screen for managing achievements, starting with creation
 */

import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import AchievementForm from '../components/AchievementForm';
import { AchievementFormData } from '../validation/achievementValidation';

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

  useEffect(() => {
    // Configure layout for achievement screen
    updateLayout({
      header: {
        visible: true,
        showLogo: true,
        showProfile: true,
        customTitle: 'Create Achievement',
      },
      footer: {
        visible: true,
        showActions: false,
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

  return (
    <LayoutWrapper>
      <AchievementForm 
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    </LayoutWrapper>
  );
}

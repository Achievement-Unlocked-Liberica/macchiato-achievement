import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import { AddAchievementAction } from '../components/FooterActions';
import MainContentComponent from '../components/MainContentComponent';
import { RootStackParamList } from '../../../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainScreen() {
  const { updateLayout } = useLayout();
  const navigation = useNavigation<NavigationProp>();

  const handleAddAchievement = () => {
    navigation.navigate('Achievement');
  };

  useEffect(() => {
    // Configure layout for main screen with add achievement action
    updateLayout({
      header: { 
        visible: true, 
        showLogo: true, 
        showProfile: true 
      },
      footer: { 
        visible: true, 
        showActions: true,
        actions: <AddAchievementAction onPress={handleAddAchievement} />
      },
    });
  }, [updateLayout]);

  return (
    <LayoutWrapper>
      <MainContentComponent />
    </LayoutWrapper>
  );
}

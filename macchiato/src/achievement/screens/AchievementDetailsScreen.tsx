/**
 * AchievementDetailsScreen
 * 
 * Screen for displaying detailed view of a specific achievement.
 * Receives achievement data through navigation parameters.
 */

import React, { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AchievementItem } from '../services/responses/GetAchievementItemsResponse';
import { AchievementDetailsComponent } from '../components/AchievementDetailsComponent';
import MainHeaderComponent from '../../main/components/MainHeaderComponent';

// Type definitions for navigation
type RootStackParamList = {
  AchievementDetails: { achievement: AchievementItem };
  Main: undefined;
};

type AchievementDetailsScreenRouteProp = RouteProp<RootStackParamList, 'AchievementDetails'>;
type AchievementDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AchievementDetails'>;

const AchievementDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AchievementDetailsScreenNavigationProp>();
  const route = useRoute<AchievementDetailsScreenRouteProp>();
  
  const { achievement } = route.params;

  // Configure header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // We'll use our custom header
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MainHeaderComponent showProfile={false} showLogo={true} />
      <AchievementDetailsComponent achievement={achievement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C',
  },
});

export default AchievementDetailsScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AddAchievementAction } from './FooterActions';
import { LAYOUT_CONSTANTS } from '../../common/constants/layoutConstants';

interface MainFooterComponentProps {
  showMainActions?: boolean;
  customActions?: React.ReactNode;
}

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
  Achievement: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainFooterComponent({ 
  showMainActions = true, 
  customActions 
}: MainFooterComponentProps) {
  const navigation = useNavigation<NavigationProp>();

  const handleAddAchievement = () => {
    navigation.navigate('Achievement');
  };

  return (
    <View style={styles.container}>
      {showMainActions ? (
        <View style={styles.actionsContainer}>
          {customActions || <AddAchievementAction onPress={handleAddAchievement} />}
        </View>
      ) : (
        <View style={styles.defaultContent}>
          <Text style={styles.authLabel}>
            auth tokens cleared on exit
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LAYOUT_CONSTANTS.CONTAINER_PADDING,
    paddingVertical: 4,
    backgroundColor: '#1E252C', // primary-950 main background color
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LAYOUT_CONSTANTS.BUTTON_SPACING,
  },
  defaultContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FCFCFC', // light text for dark background
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  authLabel: {
    color: '#9CA3AF', // gray-400 for subtle appearance
    fontSize: 10,
    fontStyle: 'italic',
  },
});

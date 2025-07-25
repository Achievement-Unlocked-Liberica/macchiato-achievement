import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHouse, 
  faMagnifyingGlass, 
  faPlus,
  faAward, 
  faGear 
} from '@fortawesome/free-solid-svg-icons';
import { AddAchievementAction } from './FooterActions';
import { LAYOUT_CONSTANTS } from '../../common/constants/layoutConstants';
import { useAuthContext } from '../../common/context';

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
  const { isAuthenticated, userProfile } = useAuthContext();

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  const handleSearchPress = () => {
    // Navigate to search screen (to be implemented)
    console.log('Search pressed');
  };

  const handleAddAchievement = () => {
    navigation.navigate('Achievement');
  };

  const handleAwardsPress = () => {
    // Navigate to awards screen (to be implemented)
    console.log('Awards pressed');
  };

  const handleSettingsPress = () => {
    // Navigate to settings screen (to be implemented)
    console.log('Settings pressed');
  };

  // Only show actions if user is authenticated and has a valid profile
  const shouldShowActions = showMainActions && isAuthenticated && userProfile;

  return (
    <View style={styles.container}>
      {shouldShowActions ? (
        <View style={styles.actionsContainer}>
          {customActions || (
            <>
              <TouchableOpacity style={styles.footerActionButton} onPress={handleHomePress}>
                <FontAwesomeIcon icon={faHouse} size={20} color="#FCFCFC" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.footerActionButton} onPress={handleSearchPress}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="#FCFCFC" />
              </TouchableOpacity>
              
              <AddAchievementAction onPress={handleAddAchievement} />
              
              <TouchableOpacity style={styles.footerActionButton} onPress={handleAwardsPress}>
                <FontAwesomeIcon icon={faAward} size={20} color="#FCFCFC" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.footerActionButton} onPress={handleSettingsPress}>
                <FontAwesomeIcon icon={faGear} size={20} color="#FCFCFC" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.defaultContent}>
          {/* Empty footer when not authenticated */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LAYOUT_CONSTANTS.CONTAINER_PADDING,
    paddingVertical: 2,
    backgroundColor: 'rgba(30, 37, 44, 0.5)', // 50% translucent
    alignItems: 'center',
    justifyContent: 'center',
    // borderTopWidth: 1,
    // borderTopColor: '#E5E7EB',
  },
  
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LAYOUT_CONSTANTS.BUTTON_SPACING,
  },
  
  footerActionButton: {
    width: 60,
    height: 60,
    borderRadius: LAYOUT_CONSTANTS.CIRCULAR_BORDER_RADIUS,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
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

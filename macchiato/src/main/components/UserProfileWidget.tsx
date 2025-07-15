/**
 * UserProfileWidget Component
 * 
 * Displays either:
 * - Sign In button when user is not authenticated
 * - Sign Out button + Profile Circle when user is authenticated
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../common/context';
import { useAuthentication, useUserProfile } from '../../user/hooks';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ProfileCircleProps {
  firstName: string;
  lastName: string;
}

const ProfileCircle: React.FC<ProfileCircleProps> = ({ firstName, lastName }) => {
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  
  return (
    <View style={styles.profileCircle}>
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
  );
};

export const UserProfileWidget: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isAuthenticated, loading: authLoading, clearAuth } = useAuthContext();
  const { logout } = useAuthentication();
  const { userProfile, loading: profileLoading, getUserProfile } = useUserProfile();

  // Load user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !userProfile && !profileLoading) {
      console.log('🔄 UserProfileWidget: User is authenticated, loading profile...');
      getUserProfile();
    }
  }, [isAuthenticated, userProfile, profileLoading, getUserProfile]);

  const handleSignInPress = () => {
    console.log('🎯 UserProfileWidget: Sign In button pressed');
    navigation.navigate('SignIn');
  };

  const handleSignOutPress = async () => {
    console.log('🎯 UserProfileWidget: Sign Out button pressed');
    try {
      await logout();
      await clearAuth();
      console.log('✅ UserProfileWidget: User signed out successfully');
    } catch (error) {
      console.error('❌ UserProfileWidget: Sign out failed:', error);
    }
  };

  // Show loading state during auth check
  if (authLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show sign in button when not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.circularSignInButton} onPress={handleSignInPress}>
          <FontAwesomeIcon 
            icon={faRightToBracket} 
            size={20} 
            color="#171717" 
          />
        </TouchableOpacity>
      </View>
    );
  }

  // Show authenticated user interface
  return (
    <View style={styles.authenticatedContainer}>
      {/* Sign Out Button */}
      <TouchableOpacity style={styles.circularSignOutButton} onPress={handleSignOutPress}>
        <FontAwesomeIcon 
          icon={faRightFromBracket} 
          size={20} 
          color="#171717" 
        />
      </TouchableOpacity>

      {/* Profile Circle */}
      {userProfile ? (
        <ProfileCircle 
          firstName={userProfile.firstName} 
          lastName={userProfile.lastName} 
        />
      ) : (
        <View style={styles.profileLoadingContainer}>
          <Text style={styles.profileLoadingText}>...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authenticatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circularSignInButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FACC15', // accent-500 color (same as before)
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  circularSignOutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FACC15', // accent-500 color (same as before)
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FACC15', // accent-500 color
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#171717',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileLoadingContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB', // gray-200
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLoadingText: {
    color: '#6B7280', // gray-500
    fontSize: 12,
  },
  loadingText: {
    color: '#6B7280', // gray-500
    fontSize: 14,
  },
});

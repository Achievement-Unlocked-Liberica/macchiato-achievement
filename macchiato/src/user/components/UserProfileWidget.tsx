/**
 * UserProfileWidget Component
 * 
 * Displays either:
 * - Sign In button when user is not authenticated
 * - Sign Out button + Profile Circle when user is authenticated
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../common/context';
import { useAuthentication } from '../hooks';
import { buttonStyles } from '../../common/styles/buttonStyles';

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
    <View style={buttonStyles.buttonMdPrimary}>
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
  );
};

export const UserProfileWidget: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    isAuthenticated, 
    loading: authLoading, 
    userProfile, 
    profileLoading, 
    getUserProfile, 
    clearAuth 
  } = useAuthContext();
  const { logout } = useAuthentication();
  
  // Track if we've already attempted to fetch the profile for this authentication session
  const profileFetchAttemptedRef = useRef(false);
  const lastAuthStateRef = useRef(isAuthenticated);

  // Load user profile once when user becomes authenticated
  useEffect(() => {
    // Reset profile fetch tracking when authentication state changes
    if (lastAuthStateRef.current !== isAuthenticated) {
      lastAuthStateRef.current = isAuthenticated;
      profileFetchAttemptedRef.current = false;
    }

    // Fetch profile only once per authentication session
    if (isAuthenticated && !userProfile && !profileLoading && !profileFetchAttemptedRef.current) {
      console.log('🔄 UserProfileWidget: User is authenticated, loading profile (first time)...');
      profileFetchAttemptedRef.current = true;
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
      // Reset profile fetch tracking
      profileFetchAttemptedRef.current = false;
      
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
        <TouchableOpacity style={buttonStyles.buttonMdPrimary} onPress={handleSignInPress}>
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
      <TouchableOpacity style={buttonStyles.buttonMdPrimary} onPress={handleSignOutPress}>
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

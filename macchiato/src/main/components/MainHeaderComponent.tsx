import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { UserProfileWidget } from './UserProfileWidget';

interface MainHeaderComponentProps {
  showProfile?: boolean;
  showLogo?: boolean;
  customTitle?: string;
}

export default function MainHeaderComponent({ 
  showProfile = true, 
  showLogo = true, 
  customTitle 
}: MainHeaderComponentProps) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      {showLogo && (
        <Image 
          source={require('../../resources/icons/au icon xs.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      
      {/* Header Title */}
      <Text style={styles.title}>
        {customTitle || 'Achievement Unlocked'}
      </Text>
      
      {/* User Profile Widget */}
      {showProfile && <UserProfileWidget />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E252C', // primary-950 main background color
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FCFCFC', // light text for dark background
    flex: 1,
    textAlign: 'left',
    marginHorizontal: 16,
  },
});

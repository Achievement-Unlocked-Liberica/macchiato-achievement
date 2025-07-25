import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { UserProfileWidget } from '../../user/components';

interface MainHeaderComponentProps {
  showProfile?: boolean;
  showLogo?: boolean;
}

export default function MainHeaderComponent({ 
  showProfile = true, 
  showLogo = true
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
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: '#1E252C', // primary-950 main background color
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E7EB',
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
    width: 48,
    height: 48,
  },
});

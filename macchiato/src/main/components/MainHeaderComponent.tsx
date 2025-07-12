import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { UserProfileWidget } from './UserProfileWidget';

export default function MainHeaderComponent() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../../resources/icons/au icon xs.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Header Title */}
      <Text style={styles.title}>
        Achievement Unlocked
      </Text>
      
      {/* User Profile Widget (replaces the old Sign In button) */}
      <UserProfileWidget />
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

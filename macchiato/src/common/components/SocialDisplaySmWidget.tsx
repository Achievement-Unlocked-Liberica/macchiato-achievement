/**
 * SocialDisplaySmWidget Component
 * 
 * Displays social counters for achievement interactions.
 * Shows heart, lightning bolt, and star icons with random counter numbers.
 * Designed for compact display in achievement items.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faBolt, faStar } from '@fortawesome/free-solid-svg-icons';

interface SocialDisplaySmWidgetProps {
  // For now, we'll generate random numbers, but in the future this could accept actual counts
}

export const SocialDisplaySmWidget: React.FC<SocialDisplaySmWidgetProps> = () => {
  // Generate random numbers from 0 to 999 for each social counter
  const generateRandomCount = () => Math.floor(Math.random() * 1000);
  
  const heartCount = generateRandomCount();
  const lightningCount = generateRandomCount();
  const starCount = generateRandomCount();

  const renderSocialItem = (icon: any, count: number, color: string) => (
    <View style={styles.socialItem} key={icon.iconName}>
      <FontAwesomeIcon icon={icon} size={12} color={color} />
      <Text style={styles.countText}>{count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSocialItem(faHeart, heartCount, '#FF6B6B')}
      {renderSocialItem(faBolt, lightningCount, '#FFD93D')}
      {renderSocialItem(faStar, starCount, '#6BCF7F')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  countText: {
    color: '#9FB3C8',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default SocialDisplaySmWidget;

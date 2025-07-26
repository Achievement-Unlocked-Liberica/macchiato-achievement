/**
 * SocialDisplayWidget Component
 * 
 * Displays social counters for achievement interactions.
 * Shows heart, lightning bolt, and star icons with random counter numbers.
 * Designed for compact display in achievement items.
 * Supports configurable sizes: xs, sm, md, lg, xl
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faBolt, faStar } from '@fortawesome/free-solid-svg-icons';
import { SOCIAL_BUTTON_SIZES, SOCIAL_COLORS } from '../constants/socialConstants';

interface SocialDisplayWidgetProps {
  size?: keyof typeof SOCIAL_BUTTON_SIZES;
  // For now, we'll generate random numbers, but in the future this could accept actual counts
  likes?: number;
  energy?: number;
  favorites?: number;
}

export const SocialDisplayWidget: React.FC<SocialDisplayWidgetProps> = ({ 
  size = 'sm',
  likes,
  energy,
  favorites
}) => {
  const iconSize = SOCIAL_BUTTON_SIZES[size];
  
  // Generate random numbers from 0 to 999 for each social counter if not provided
  const generateRandomCount = () => Math.floor(Math.random() * 1000);
  
  const heartCount = likes ?? generateRandomCount();
  const lightningCount = energy ?? generateRandomCount();
  const starCount = favorites ?? generateRandomCount();

  const renderSocialItem = (icon: any, count: number, color: string) => (
    <View style={styles.socialItem} key={icon.iconName}>
      <FontAwesomeIcon icon={icon} size={iconSize} color={color} />
      <Text style={[styles.countText, { fontSize: Math.max(8, iconSize * 0.8) }]}>{count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSocialItem(faHeart, heartCount, SOCIAL_COLORS.heart)}
      {renderSocialItem(faBolt, lightningCount, SOCIAL_COLORS.lightning)}
      {renderSocialItem(faStar, starCount, SOCIAL_COLORS.star)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  countText: {
    color: '#9FB3C8',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default SocialDisplayWidget;

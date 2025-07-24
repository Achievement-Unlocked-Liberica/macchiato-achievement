/**
 * Achievement Card Widget
 * 
 * Displays a single achievement in a card format for grid view
 * Square-shaped social feed post style with image, title, skills, and social counters
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AchievementItem } from '../services/responses';
import { SkillDisplaySmWidget, SocialDisplaySmWidget } from '../../common/components';

interface AchievementCardWidgetProps {
  achievement: AchievementItem;
}

const AchievementCardWidget: React.FC<AchievementCardWidgetProps> = ({ achievement }) => {
  // Get the first media URL or use a placeholder
  const getImageUrl = () => {
    if (achievement.media && achievement.media.length > 0) {
      return achievement.media[0].mediaUrl;
    }
    return null;
  };

  // Get image source - either from media or app logo
  const getImageSource = () => {
    const imageUrl = getImageUrl();
    if (imageUrl) {
      return { uri: imageUrl };
    }
    // Use application logo as fallback
    return require('../../resources/icons/au icon sm.jpg');
  };

  // Render skills using the SkillDisplaySmWidget with flat layout
  const renderSkills = () => {
    const skills = achievement.skills || [];
    return <SkillDisplaySmWidget selectedSkills={skills} layout="flat" />;
  };

  const imageSource = getImageSource();

  return (
    <View style={styles.container}>
      {/* Achievement Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.achievementImage}
          resizeMode="cover"
        />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {achievement.title}
        </Text>
      </View>

      {/* Skills - Flat Layout */}
      <View style={styles.skillsContainer}>
        {renderSkills()}
      </View>

      {/* Social Counters */}
      <View style={styles.socialContainer}>
        <SocialDisplaySmWidget />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E252C',
    borderRadius: 8,
    //padding: 4,
    //marginVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  achievementImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    color: '#FCFCFC',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  skillsContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  socialContainer: {
    alignItems: 'center',
  },
});

export default AchievementCardWidget;

/**
 * Achievement Card Widget
 * 
 * Displays a single achievement in a card format for grid view
 * Square-shaped social feed post style with image, title, skills, and social counters
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AchievementItem } from '../services/responses';
import { SkillDisplayWidget } from '../../skills/components/SkillDisplayWidget';
import { SocialDisplayWidget } from '../../social/components/SocialDisplayWidget';

// Navigation types
type RootStackParamList = {
  AchievementDetails: { achievement: AchievementItem };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface AchievementCardWidgetProps {
  achievement: AchievementItem;
  onPress?: () => void;
}

const AchievementCardWidget: React.FC<AchievementCardWidgetProps> = ({ achievement, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  // Handle card press - either use custom onPress or navigate to achievement details
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('AchievementDetails', { achievement });
    }
  };
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

  // Render skills using the SkillDisplayWidget with flat layout and transparent background
  const renderSkills = () => {
    const skills = achievement.skills || [];
    return (
      <SkillDisplayWidget 
        selectedSkills={skills} 
        layout="flat" 
        size="xs"
        containerStyle={styles.skillsTransparent}
      />
    );
  };

  const imageSource = getImageSource();

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      {/* Achievement Image with bottom overlay rectangle */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.achievementImage}
          resizeMode="cover"
        />
        {/* Dark translucent rectangle covering bottom 1/5 of image */}
        <View style={styles.bottomOverlayRectangle}>
          {/* Skills widget inside the rectangle */}
          {renderSkills()}
        </View>
      </View>

      {/* Social Counters */}
      <View style={styles.socialContainer}>
        <SocialDisplayWidget size="xs" />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {achievement.title}
        </Text>
      </View>
    </TouchableOpacity>
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
    position: 'relative',
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  achievementImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  bottomOverlayRectangle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '15%', // 1/5th of the image height (120px * 0.2 = 24px)
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  skillsTransparent: {
    backgroundColor: 'transparent',
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    color: '#FCFCFC',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  socialContainer: {
    alignItems: 'center',
  },
});

export default AchievementCardWidget;

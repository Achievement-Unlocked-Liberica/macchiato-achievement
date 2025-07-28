/**
 * Achievement Item Widget
 * 
 * Displays a single achievement in a rectangular layout with image, title, date, description, and skills
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

interface AchievementItemWidgetProps {
  achievement: AchievementItem;
  onPress?: () => void;
}

const AchievementItemWidget: React.FC<AchievementItemWidgetProps> = ({ achievement, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  // Handle item press - either use custom onPress or navigate to achievement details
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('AchievementDetails', { achievement });
    }
  };
  // Format date as "Jan 15 2024"
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day} ${year}`;
    } catch (error) {
      return '';
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
    return require('../../resources/icons/au icon sm.png');
  };

  // Render skills using the SkillDisplayWidget
  const renderSkills = () => {
    const skills = achievement.skills || [];
    return <SkillDisplayWidget selectedSkills={skills} size="xs" layout="flat" />;
  };

  const imageUrl = getImageUrl();
  const imageSource = getImageSource();
  const formattedDate = formatDate(achievement.completedDate);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      {/* Left: Achievement Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.achievementImage}
          resizeMode="cover"
        />
      </View>

      {/* Center: Title, Skills, and Social */}
      <View style={styles.contentContainer}>
        {/* Title and Date section */}
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {achievement.title}
          </Text>
          {formattedDate ? (
            <Text style={styles.date}>{formattedDate}</Text>
          ) : null}
        </View>
        
        {/* Bottom section with skills above social */}
        <View style={styles.bottomSection}>
          {/* Skills in flat mode */}
          <View style={styles.skillsFlat}>
            <SkillDisplayWidget
              selectedSkills={achievement.skills || []}
              layout="flat"
              size="xs"
            />
          </View>
          
          {/* Social counters below skills */}
          <View style={styles.socialSection}>
            <SocialDisplayWidget 
              size="xs" 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E252C',//'#2A3441', // Slightly lighter than main background
    borderRadius: 8,
    marginVertical: 4,
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
    width: 80,
    height: 80,
    marginRight: 12,
  },
  achievementImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 8, // Add vertical padding to the content area
  },
  titleSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bottomSection: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginTop: 'auto',
  },
  skillsFlat: {    
    marginBottom: 4,
  },
  title: {
    color: '#FCFCFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 20,
  },
  date: {
    color: '#9FB3C8',
    fontSize: 12,
  },
  socialSection: {
    marginTop: 2,
  },
});

export default AchievementItemWidget;

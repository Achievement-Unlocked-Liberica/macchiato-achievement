/**
 * Achievement Item Widget
 * 
 * Displays a single achievement in a rectangular layout with image, title, date, description, and skills
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AchievementItem } from '../services/responses';
import { SkillDisplaySmWidget, SocialDisplaySmWidget } from '../../common/components';

interface AchievementItemWidgetProps {
  achievement: AchievementItem;
}

const AchievementItemWidget: React.FC<AchievementItemWidgetProps> = ({ achievement }) => {
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
    return require('../../resources/icons/au icon sm.jpg');
  };

  // Render skills using the SkillDisplaySmWidget
  const renderSkills = () => {
    const skills = achievement.skills || [];
    return <SkillDisplaySmWidget selectedSkills={skills} />;
  };

  const imageUrl = getImageUrl();
  const imageSource = getImageSource();
  const formattedDate = formatDate(achievement.completedDate);

  return (
    <View style={styles.container}>
      {/* Left: Achievement Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.achievementImage}
          resizeMode="cover"
        />
      </View>

      {/* Center: Title and Date */}
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
        
        {/* Social counters section */}
        <View style={styles.socialSection}>
          <SocialDisplaySmWidget />
        </View>
      </View>

      {/* Right: Skills */}
      <View style={styles.skillsSection}>
        {renderSkills()}
      </View>
    </View>
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
  skillsSection: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8, // Add right margin to prevent touching the border
    padding: 8, // Add padding to all sides of the skills section
  },
});

export default AchievementItemWidget;

/**
 * AchievementDetailsWidget Component
 * 
 * Displays the complete details of an achievement including:
 * - Title, description, completed date
 * - Media gallery with navigation
 * - Social interactions
 * - Skills display
 */

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, PanResponder, Dimensions } from 'react-native';
import { AchievementItem } from '../services/responses/GetAchievementItemsResponse';
import { SkillDisplayWidget } from '../../skills/components/SkillDisplayWidget';
import { SocialDisplayWidget } from '../../social/components/SocialDisplayWidget';

interface AchievementDetailsWidgetProps {
  achievement: AchievementItem;
}

export const AchievementDetailsWidget: React.FC<AchievementDetailsWidgetProps> = ({ 
  achievement 
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Format the completed date
  const formatCompletedDate = (dateString?: string) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Handle media navigation
  const handlePreviousMedia = () => {
    if (achievement.media && achievement.media.length > 1) {
      setCurrentMediaIndex(prev => 
        prev === 0 ? achievement.media.length - 1 : prev - 1
      );
    }
  };

  const handleNextMedia = () => {
    if (achievement.media && achievement.media.length > 1) {
      setCurrentMediaIndex(prev => 
        prev === achievement.media.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const screenWidth = Dimensions.get('window').width;
      const swipeThreshold = screenWidth * 0.2; // 20% of screen width
      
      if (Math.abs(gestureState.dx) > swipeThreshold && hasMultipleMedia) {
        if (gestureState.dx > 0) {
          // Swipe right - go to previous
          handlePreviousMedia();
        } else {
          // Swipe left - go to next
          handleNextMedia();
        }
      }
    },
  });

  const hasMedia = achievement.media && achievement.media.length > 0;
  const hasMultipleMedia = achievement.media && achievement.media.length > 1;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={styles.title}>{achievement.title}</Text>
      
      {/* Description */}
      <Text style={styles.description}>{achievement.description}</Text>
      
      {/* Completed Date */}
      <Text style={styles.completedDate}>
        {formatCompletedDate(achievement.completedDate)}
      </Text>
      
      {/* Media Gallery */}
      {hasMedia && (
        <View style={styles.mediaContainer}>
          <View style={styles.mediaGallery} {...panResponder.panHandlers}>
            {/* Current Media with swipe support */}
            <View style={styles.mediaImageContainer}>
              <Image 
                source={{ uri: achievement.media[currentMediaIndex].mediaUrl }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
              
              {/* Media Counter */}
              {hasMultipleMedia && (
                <View style={styles.mediaCounter}>
                  <Text style={styles.mediaCounterText}>
                    {currentMediaIndex + 1} / {achievement.media.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
      
      {/* Social Display */}
      <View style={styles.socialContainer}>
        <SocialDisplayWidget size="sm" />
      </View>
      
      {/* Skills Display */}
      {achievement.skills && achievement.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {/* <Text style={styles.skillsLabel}>Skills</Text> */}
          <SkillDisplayWidget 
            selectedSkills={achievement.skills}
            layout="flat"
            size="lg"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCFCFC',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9FB3C8',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  completedDate: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mediaContainer: {
    marginBottom: 20,
  },
  mediaGallery: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaImageContainer: {
    width: '100%',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#2F353C',
  },
  mediaCounter: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaCounterText: {
    color: '#FCFCFC',
    fontSize: 12,
    fontWeight: '600',
  },
  socialContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FCFCFC',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default AchievementDetailsWidget;

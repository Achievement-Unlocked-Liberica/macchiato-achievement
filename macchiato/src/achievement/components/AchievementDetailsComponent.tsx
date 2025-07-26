/**
 * AchievementDetailsComponent
 * 
 * Container component for displaying achievement details.
 * Contains the AchievementDetailsWidget and other related widgets.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AchievementItem } from '../services/responses/GetAchievementItemsResponse';
import { AchievementDetailsWidget } from './AchievementDetailsWidget';

interface AchievementDetailsComponentProps {
  achievement: AchievementItem;
  onBack?: () => void;
}

export const AchievementDetailsComponent: React.FC<AchievementDetailsComponentProps> = ({ 
  achievement,
  onBack
}) => {
  return (
    <View style={styles.container}>
      {/* Back button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FCFCFC" />
          <Text style={styles.backText}>Back to List</Text>
        </TouchableOpacity>
      )}
      
      <AchievementDetailsWidget achievement={achievement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backText: {
    color: '#FCFCFC',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AchievementDetailsComponent;

/**
 * Dynamic Footer Actions
 * 
 * Reusable action components that can be dynamically added to the footer
 * based on app state, screen context, or user interactions.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faPlus, 
  faCheck, 
  faShare, 
  faBookmark,
  faHeart,
  faComment
} from '@fortawesome/free-solid-svg-icons';

interface ActionButtonProps {
  onPress: () => void;
  label: string;
  icon?: any;
  variant?: 'primary' | 'secondary' | 'success';
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onPress, 
  label, 
  icon, 
  variant = 'primary' 
}) => {
  const buttonStyle = [
    styles.actionButton,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'success' && styles.successButton,
  ];

  const textStyle = [
    styles.actionButtonText,
    variant === 'secondary' && styles.secondaryButtonText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      {icon && (
        <FontAwesomeIcon 
          icon={icon} 
          size={16} 
          color={variant === 'secondary' ? '#FCFCFC' : '#171717'} 
        />
      )}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

// Pre-defined action components for common use cases
export const AddAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <ActionButton 
    onPress={onPress} 
    label="Add" 
    icon={faPlus} 
    variant="primary" 
  />
);

export const SaveAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <ActionButton 
    onPress={onPress} 
    label="Save" 
    icon={faCheck} 
    variant="success" 
  />
);

export const ShareAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <ActionButton 
    onPress={onPress} 
    label="Share" 
    icon={faShare} 
    variant="secondary" 
  />
);

export const BookmarkAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <ActionButton 
    onPress={onPress} 
    label="Bookmark" 
    icon={faBookmark} 
    variant="secondary" 
  />
);

export const LikeAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <ActionButton 
    onPress={onPress} 
    label="Like" 
    icon={faHeart} 
    variant="secondary" 
  />
);

export const CommentAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <ActionButton 
    onPress={onPress} 
    label="Comment" 
    icon={faComment} 
    variant="secondary" 
  />
);

// Circular Add Achievement Action for main screen
export const AddAchievementAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={styles.circularButton} onPress={onPress}>
    <FontAwesomeIcon 
      icon={faPlus} 
      size={20} 
      color="#171717" 
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#FACC15', // accent-500 color
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FCFCFC',
  },
  successButton: {
    backgroundColor: '#10B981', // green-500
  },
  actionButtonText: {
    color: '#171717',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FCFCFC',
  },
  circularButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FACC15', // accent-500 color
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

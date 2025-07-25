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
  faComment,
  faXmark,
  faRightToBracket,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { LAYOUT_CONSTANTS } from '../../common/constants/layoutConstants';
import { buttonStyles } from '../../common/styles/buttonStyles';

interface ActionButtonProps {
  onPress: () => void;
  label: string;
  icon?: any;
  variant?: 'primary' | 'secondary' | 'success' | 'circular-signin' | 'circular-register';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  onPress, 
  label, 
  icon, 
  variant = 'primary',
  disabled = false
}) => {
  const buttonStyle = [
    styles.actionButton,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'success' && styles.successButton,
    variant === 'circular-signin' && styles.circularSigninButton,
    variant === 'circular-register' && styles.circularRegisterButton,
    disabled && styles.disabledButton,
  ];

  const textStyle = [
    styles.actionButtonText,
    variant === 'secondary' && styles.secondaryButtonText,
    disabled && styles.disabledButtonText,
  ];

  const isCircular = variant?.includes('circular');

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      {icon && (
        <FontAwesomeIcon 
          icon={icon} 
          size={isCircular ? 20 : 16}
          color={disabled ? '#9CA3AF' : (
            variant === 'circular-signin' ? '#171717' :
            variant === 'circular-register' ? '#171717' :
            variant === 'secondary' ? '#FCFCFC' : '#171717'
          )} 
        />
      )}
      {!isCircular && <Text style={textStyle}>{label}</Text>}
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

// Circular Cancel Action (Red button with X icon, no text)
export const CancelAction: React.FC<{ onPress: () => void; disabled?: boolean }> = ({ onPress, disabled = false }) => (
  <TouchableOpacity 
    style={disabled ? buttonStyles.buttonLgDisabled : buttonStyles.buttonLgAlert} 
    onPress={onPress}
    disabled={disabled}
  >
    <FontAwesomeIcon 
      icon={faXmark} 
      size={20} 
      color="#FCFCFC" 
    />
  </TouchableOpacity>
);

// Circular Submit Action (Green button with check icon, no text)
export const SubmitAction: React.FC<{ onPress: () => void; disabled?: boolean }> = ({ onPress, disabled = false }) => (
  <TouchableOpacity 
    style={disabled ? buttonStyles.buttonLgDisabled : buttonStyles.buttonLgSuccess} 
    onPress={onPress}
    disabled={disabled}
  >
    <FontAwesomeIcon 
      icon={faCheck} 
      size={20} 
      color="#FCFCFC" 
    />
  </TouchableOpacity>
);

// Circular Add Achievement Action for main screen
export const AddAchievementAction: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={buttonStyles.buttonMdPrimary} onPress={onPress}>
    <FontAwesomeIcon 
      icon={faPlus} 
      size={16} 
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
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  circularSigninButton: {
    width: 60,
    height: 60,
    borderRadius: LAYOUT_CONSTANTS.CIRCULAR_BORDER_RADIUS,
    backgroundColor: '#FACC15', // accent-500 color (keeping same as original)
    alignItems: 'center',
    justifyContent: 'center',
    ...LAYOUT_CONSTANTS.SHADOW,
  },
  circularRegisterButton: {
    width: 60,
    height: 60,
    borderRadius: LAYOUT_CONSTANTS.CIRCULAR_BORDER_RADIUS,
    backgroundColor: '#FACC15', // accent-500 color (keeping same as original)
    alignItems: 'center',
    justifyContent: 'center',
    ...LAYOUT_CONSTANTS.SHADOW,
  },
});

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface CancelButtonProps {
  onPress: () => void;
  disabled?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function CancelButton({ 
  onPress, 
  disabled = false, 
  text = 'Cancel',
  size = 'medium'
}: CancelButtonProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 min-w-[80px]';
      case 'large':
        return 'px-12 py-4 min-w-[160px]';
      default:
        return 'px-8 py-3 min-w-[120px]';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity 
      className={`bg-gray-500 rounded-lg flex-row items-center justify-center gap-2 ${getSizeClasses()} ${
        disabled ? 'opacity-50' : ''
      }`}
      onPress={onPress}
      disabled={disabled}
    >
      <FontAwesomeIcon 
        icon={faXmark} 
        size={getIconSize()} 
        color="white" 
      />
      <Text className={`text-white font-semibold ${getTextSize()}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

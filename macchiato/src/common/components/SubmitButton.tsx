import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface SubmitButtonProps {
  onPress: () => void;
  disabled?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export default function SubmitButton({ 
  onPress, 
  disabled = false, 
  text = 'Submit',
  size = 'medium',
  loading = false
}: SubmitButtonProps) {
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

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity 
      className={`bg-yellow-400 rounded-lg flex-row items-center justify-center gap-2 ${getSizeClasses()} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      onPress={onPress}
      disabled={isDisabled}
    >
      <FontAwesomeIcon 
        icon={faCheck} 
        size={getIconSize()} 
        color="#0F1620" 
      />
      <Text className={`text-gray-900 font-semibold ${getTextSize()}`}>
        {loading ? 'Loading...' : text}
      </Text>
    </TouchableOpacity>
  );
}

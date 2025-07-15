/**
 * Sign In Footer Component
 * 
 * Footer component for the sign in screen that contains cancel and submit buttons
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CancelAction, SubmitAction } from '../../main/components/FooterActions';
import { LAYOUT_CONSTANTS } from '../../common/constants/layoutConstants';

interface SignInFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const SignInFooter: React.FC<SignInFooterProps> = ({ 
  onCancel, 
  onSubmit, 
  isLoading = false 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <CancelAction 
          onPress={onCancel} 
          disabled={isLoading}
        />
        <SubmitAction 
          onPress={onSubmit} 
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E252C', // primary-950 main background color
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: LAYOUT_CONSTANTS.BUTTON_SPACING,
  },
});

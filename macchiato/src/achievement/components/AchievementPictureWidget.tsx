/**
 * AchievementPictureWidget Component
 * 
 * Full-screen image viewer for achievement pictures with close functionality
 */

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface AchievementPictureWidgetProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export const AchievementPictureWidget: React.FC<AchievementPictureWidgetProps> = ({
  visible,
  imageUri,
  onClose
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.9)" barStyle="light-content" />
      <View style={styles.overlay}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Full Screen Image */}
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={1}
          onPress={onClose} // Allow tapping on image to close as well
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50, // Account for status bar
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default AchievementPictureWidget;

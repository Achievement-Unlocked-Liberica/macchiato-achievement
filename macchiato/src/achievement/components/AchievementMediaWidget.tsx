/**
 * AchievementMediaWidget Component
 * 
 * Widget for taking and displaying achievement pictures using camera
 */

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';

interface AchievementMediaWidgetProps {
  onImageSelected?: (imageUri: string | null) => void;
}

export interface AchievementMediaWidgetRef {
  getImageUri: () => string | null;
  clearImage: () => void;
}

const AchievementMediaWidget = forwardRef<AchievementMediaWidgetRef, AchievementMediaWidgetProps>(
  ({ onImageSelected }, ref) => {
    const [imageUri, setImageUri] = useState<string | null>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getImageUri: () => imageUri,
      clearImage: () => {
        setImageUri(null);
        onImageSelected?.(null);
      },
    }));

    const requestCameraPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Sorry, we need camera permissions to take pictures for your achievements.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    };

    const handleTakePicture = async () => {
      try {
        // Request camera permissions
        const hasPermission = await requestCameraPermissions();
        if (!hasPermission) return;

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const selectedImageUri = result.assets[0].uri;
          setImageUri(selectedImageUri);
          onImageSelected?.(selectedImageUri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert(
          'Camera Error',
          'An error occurred while trying to take a picture. Please try again.',
          [{ text: 'OK' }]
        );
      }
    };

    return (
      <View style={styles.container}>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}
        
        <TouchableOpacity
          style={styles.addMediaButton}
          onPress={handleTakePicture}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faCamera} size={24} color="#171717" />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#1E252C',
    paddingVertical: 16,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 200, // 50% scale approximation for typical phone camera image
    height: 150,
    resizeMode: 'cover',
  },
  addMediaButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8C825', // Same theme as sign in/out buttons
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AchievementMediaWidget;

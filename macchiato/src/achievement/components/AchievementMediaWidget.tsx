/**
 * AchievementMediaWidget Component
 * 
 * Widget for taking and displaying achievement pictures using camera
 */

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { MAX_ACHIEVEMENT_IMAGES } from '../../common/constants/achievementConstants';

interface AchievementMediaWidgetProps {
  onImagesChange?: (imageUris: string[]) => void;
}

export interface AchievementMediaWidgetRef {
  getImageUris: () => string[];
  clearImages: () => void;
}

const AchievementMediaWidget = forwardRef<AchievementMediaWidgetRef, AchievementMediaWidgetProps>(
  ({ onImagesChange }, ref) => {
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getImageUris: () => imageUris,
      clearImages: () => {
        setImageUris([]);
        setCurrentImageIndex(0);
        onImagesChange?.([]);
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

    const compressImage = async (uri: string): Promise<string> => {
      try {
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }], // Resize to max width of 800px
          {
            compress: 0.7, // 70% quality for good balance of size and quality
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
        return manipulatorResult.uri;
      } catch (error) {
        console.error('Error compressing image:', error);
        return uri; // Return original if compression fails
      }
    };

    const handleTakePicture = async () => {
      try {
        // Check if we've reached the limit
        if (imageUris.length >= MAX_ACHIEVEMENT_IMAGES) {
          Alert.alert(
            'Image Limit Reached',
            `You can only add up to ${MAX_ACHIEVEMENT_IMAGES} images per achievement.`,
            [{ text: 'OK' }]
          );
          return;
        }

        // Request camera permissions
        const hasPermission = await requestCameraPermissions();
        if (!hasPermission) return;

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true, // Allow cropping
          aspect: [4, 4], // Standard aspect ratio
          quality: 0.5, // Reduced quality to 50% for better performance
        });

        if (!result.canceled && result.assets[0]) {
          const originalUri = result.assets[0].uri;
          const compressedUri = await compressImage(originalUri);
          
          const newImageUris = [...imageUris, compressedUri];
          setImageUris(newImageUris);
          setCurrentImageIndex(newImageUris.length - 1); // Show the newest image on top
          onImagesChange?.(newImageUris);
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

    const handleDeleteImage = (indexToDelete: number) => {
      const newImageUris = imageUris.filter((_, index) => index !== indexToDelete);
      setImageUris(newImageUris);
      
      // Adjust current index if necessary
      if (currentImageIndex >= newImageUris.length && newImageUris.length > 0) {
        setCurrentImageIndex(newImageUris.length - 1);
      } else if (newImageUris.length === 0) {
        setCurrentImageIndex(0);
      }
      
      onImagesChange?.(newImageUris);
    };

    const handleImageTap = () => {
      if (imageUris.length > 1) {
        const nextIndex = (currentImageIndex + 1) % imageUris.length;
        setCurrentImageIndex(nextIndex);
      }
    };

    const handlePreviousImage = () => {
      if (imageUris.length > 1) {
        const prevIndex = currentImageIndex === 0 ? imageUris.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
      }
    };

    const handleNextImage = () => {
      if (imageUris.length > 1) {
        const nextIndex = (currentImageIndex + 1) % imageUris.length;
        setCurrentImageIndex(nextIndex);
      }
    };

    const handleImageZoneTap = (event: any) => {
      const { locationX } = event.nativeEvent;
      const imageWidth = 250; // New size (1.25 * 200)
      const leftThird = imageWidth / 3;
      const rightThird = (imageWidth * 2) / 3;

      if (locationX < leftThird) {
        handlePreviousImage();
      } else if (locationX > rightThird) {
        handleNextImage();
      }
      // Middle third does nothing (reserved for delete button area)
    };

    return (
      <View style={styles.container}>
        {imageUris.length > 0 && (
          <View style={styles.stackContainer}>
            {/* Image Stack - Render from back to front */}
            {imageUris.map((uri, index) => {
              const isCurrentImage = index === currentImageIndex;
              const stackIndex = imageUris.length - 1 - index; // Reverse for proper stacking
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.stackedImageContainer,
                    {
                      zIndex: isCurrentImage ? imageUris.length + 1 : stackIndex,
                      top: isCurrentImage ? 0 : stackIndex * 6,
                      left: isCurrentImage ? 0 : stackIndex * 3,
                      opacity: isCurrentImage ? 1 : 0.7 - (stackIndex * 0.1),
                    }
                  ]}
                  onPress={handleImageZoneTap}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri }} style={styles.stackedImage} />
                  
                  {/* Delete button - only show on current (top) image */}
                  {isCurrentImage && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteImage(index)}
                      activeOpacity={0.8}
                    >
                      <FontAwesomeIcon icon={faTimes} size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
            
            {/* Navigation overlay icons - only show if more than 1 image */}
            {imageUris.length > 1 && (
              <>
                {/* Left navigation icon */}
                <View style={styles.leftNavIcon}>
                  <FontAwesomeIcon icon={faChevronLeft} size={20} color="rgba(255, 255, 255, 0.8)" />
                </View>
                
                {/* Right navigation icon */}
                <View style={styles.rightNavIcon}>
                  <FontAwesomeIcon icon={faChevronRight} size={20} color="rgba(255, 255, 255, 0.8)" />
                </View>
              </>
            )}
            
            {/* Image Indicator */}
            <View style={styles.imageIndicator}>
              <Text style={styles.indicatorText}>
                {currentImageIndex + 1}/{imageUris.length}
              </Text>
            </View>
          </View>
        )}
        
        {/* Add Media Button */}
        <TouchableOpacity
          style={[
            styles.addMediaButton,
            imageUris.length >= MAX_ACHIEVEMENT_IMAGES && styles.addMediaButtonDisabled
          ]}
          onPress={handleTakePicture}
          activeOpacity={0.8}
          disabled={imageUris.length >= MAX_ACHIEVEMENT_IMAGES}
        >
          <FontAwesomeIcon 
            icon={faCamera} 
            size={24} 
            color={imageUris.length >= MAX_ACHIEVEMENT_IMAGES ? "#9FB3C8" : "#171717"} 
          />
        </TouchableOpacity>
        
        {/* Progress indicator */}
        {imageUris.length > 0 && (
          <Text style={styles.progressText}>
            {imageUris.length}/{MAX_ACHIEVEMENT_IMAGES} images
          </Text>
        )}
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
  stackContainer: {
    position: 'relative',
    marginBottom: 16,
    width: 250, // 1.25x increase from 200
    height: 188, // 1.25x increase from 150 (rounded)
  },
  stackedImageContainer: {
    position: 'absolute',
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
  stackedImage: {
    width: 250, // 1.25x increase from 200
    height: 188, // 1.25x increase from 150 (rounded)
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // Semi-transparent red
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  leftNavIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -20, // Half of icon container height for vertical centering
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  rightNavIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -20, // Half of icon container height for vertical centering
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
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
  addMediaButtonDisabled: {
    backgroundColor: '#5F6B78', // Disabled state
    elevation: 1,
    shadowOpacity: 0.1,
  },
  progressText: {
    color: '#9FB3C8',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  // Legacy styles - keeping for compatibility but not used
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
    width: 250, // Updated to match new size
    height: 188, // Updated to match new size
    resizeMode: 'cover',
  },
});

export default AchievementMediaWidget;

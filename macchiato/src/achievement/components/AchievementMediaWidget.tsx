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
import { buttonStyles } from '../../common/styles/buttonStyles';

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
          allowsEditing: false, // Allow cropping
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

    return (
      <View style={styles.container}>
        {imageUris.length > 0 && (
          <View style={styles.navigationContainer}>
            {/* Left navigation button - only show if more than 1 image */}
            {imageUris.length > 1 && (
              <TouchableOpacity
                style={buttonStyles.buttonSmPrimary}
                onPress={handlePreviousImage}
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faChevronLeft} size={16} color="#171717" />
              </TouchableOpacity>
            )}
            
            <View style={styles.stackContainer}>
              {/* Image Stack - Render from back to front */}
              {imageUris.map((uri, index) => {
                const isCurrentImage = index === currentImageIndex;
                const stackIndex = imageUris.length - 1 - index; // Reverse for proper stacking
                
                return (
                  <View
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
                  >
                    <Image source={{ uri }} style={styles.stackedImage} />
                    
                    {/* Delete button - only show on current (top) image */}
                    {isCurrentImage && (
                      <TouchableOpacity
                        style={[buttonStyles.buttonSmAlert, { position: 'absolute', top: 8, right: 8 }]}
                        onPress={() => handleDeleteImage(index)}
                        activeOpacity={0.8}
                      >
                        <FontAwesomeIcon icon={faTimes} size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
              
              {/* Image Indicator */}
              <View style={styles.imageIndicator}>
                <Text style={styles.indicatorText}>
                  {currentImageIndex + 1}/{imageUris.length}
                </Text>
              </View>
            </View>
            
            {/* Right navigation button - only show if more than 1 image */}
            {imageUris.length > 1 && (
              <TouchableOpacity
                style={buttonStyles.buttonSmPrimary}
                onPress={handleNextImage}
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faChevronRight} size={16} color="#171717" />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Add Media Button */}
        <TouchableOpacity
          style={[
            buttonStyles.buttonMdPrimary,
            imageUris.length >= MAX_ACHIEVEMENT_IMAGES && buttonStyles.buttonMdDisabled
          ]}
          onPress={handleTakePicture}
          activeOpacity={0.8}
          disabled={imageUris.length >= MAX_ACHIEVEMENT_IMAGES}
        >
          <FontAwesomeIcon 
            icon={faCamera} 
            size={20} 
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
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Reduced since buttons now have their own margin
  },
  stackContainer: {
    position: 'relative',
    marginHorizontal: 8, // Reduced since buttons now have their own margin
    width: 250,
    height: 188,
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
    width: 250,
    height: 188,
    resizeMode: 'cover',
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
  progressText: {
    color: '#9FB3C8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AchievementMediaWidget;

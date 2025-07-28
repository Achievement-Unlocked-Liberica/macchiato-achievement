/**
 * AchievementMediaWidget Component
 * 
 * Widget for taking and displaying achievement pictures using camera
 */

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, Text, PanResponder, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faTimes, faImages } from '@fortawesome/free-solid-svg-icons';
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

    const requestMediaLibraryPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Media Library Permission Required',
          'Sorry, we need access to your photo library to select pictures for your achievements.',
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

    const handleSelectPictures = async () => {
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

        // Request media library permissions
        const hasPermission = await requestMediaLibraryPermissions();
        if (!hasPermission) return;

        // Calculate how many more images can be added
        const remainingSlots = MAX_ACHIEVEMENT_IMAGES - imageUris.length;

        // Launch image picker with multiple selection
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          selectionLimit: remainingSlots, // Limit to remaining slots
          allowsEditing: false,
          quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          // Process all selected images
          const compressedUris: string[] = [];
          
          for (const asset of result.assets) {
            const compressedUri = await compressImage(asset.uri);
            compressedUris.push(compressedUri);
          }
          
          const newImageUris = [...imageUris, ...compressedUris];
          setImageUris(newImageUris);
          setCurrentImageIndex(newImageUris.length - 1); // Show the newest image on top
          onImagesChange?.(newImageUris);
        }
      } catch (error) {
        console.error('Error selecting pictures:', error);
        Alert.alert(
          'Picture Selection Error',
          'An error occurred while trying to select pictures. Please try again.',
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

    // Pan responder for swipe gestures
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal swipes with multiple images
        return imageUris.length > 1 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const screenWidth = Dimensions.get('window').width;
        const swipeThreshold = screenWidth * 0.15; // 15% of screen width
        
        if (Math.abs(gestureState.dx) > swipeThreshold && imageUris.length > 1) {
          if (gestureState.dx > 0) {
            // Swipe right - go to previous
            handlePreviousImage();
          } else {
            // Swipe left - go to next
            handleNextImage();
          }
        }
      },
    });

    return (
      <View style={styles.container}>
        {imageUris.length > 0 && (
          <View style={styles.navigationContainer}>
            <View style={styles.stackContainer} {...panResponder.panHandlers}>
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
                        top: isCurrentImage ? 0 : stackIndex * 3,
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
          </View>
        )}
        
        {/* Media Action Buttons */}
        <View style={styles.mediaButtonsContainer}>
          {/* Add Camera Button */}
          <TouchableOpacity
            style={[
              buttonStyles.buttonLgPrimary,
              imageUris.length >= MAX_ACHIEVEMENT_IMAGES && buttonStyles.buttonLgDisabled
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
          
          {/* Add Pictures Button */}
          <TouchableOpacity
            style={[
              buttonStyles.buttonLgPrimary,
              imageUris.length >= MAX_ACHIEVEMENT_IMAGES && buttonStyles.buttonLgDisabled
            ]}
            onPress={handleSelectPictures}
            activeOpacity={0.8}
            disabled={imageUris.length >= MAX_ACHIEVEMENT_IMAGES}
          >
            <FontAwesomeIcon 
              icon={faImages} 
              size={20} 
              color={imageUris.length >= MAX_ACHIEVEMENT_IMAGES ? "#9FB3C8" : "#171717"} 
            />
          </TouchableOpacity>
        </View>
        
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
    width: '100%', // Ensure container takes full width
    backgroundColor: '#1E252C',
    paddingVertical: 16,
  },
  navigationContainer: {
    width: '100%', // Full width like input fields
    marginBottom: 12,
  },
  stackContainer: {
    position: 'relative',
    width: '100%', // Full width to match container
    height: 250, // Increased height for better proportions
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center buttons horizontally
    gap: 8, // Space between camera and pictures buttons
  },
  stackedImageContainer: {
    position: 'absolute',
    width: '100%', // Full width of stack container
    height: '100%', // Full height of stack container
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
    width: '100%',
    height: '100%',
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

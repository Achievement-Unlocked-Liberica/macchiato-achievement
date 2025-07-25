/**
 * AchievementForm Component
 * 
 * Form for creating a new achievement
 */

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faXmark, faCalendar, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '../../common/hooks';
import { useAuthContext } from '../../common/context';
import { useAchievement } from '../hooks/useAchievement';
import CustomDatePicker from '../../common/components/CustomDatePicker';
import AchievementMediaWidget, { AchievementMediaWidgetRef } from './AchievementMediaWidget';
import { SkillSelectionWidget, SkillSelectionWidgetRef } from '../../skills';
import { AchievementFormData, achievementValidationRules } from '../validation/achievementValidation';
import { CreateAchievementCommand } from '../services/commands';

interface AchievementFormProps {
  onSubmit: (formData: AchievementFormData) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface AchievementFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

const initialFormData: AchievementFormData = {
  title: '',
  description: '',
  completedDate: '',
  skills: [], // Keep for compatibility but will be overridden by widget
  isPublic: true, // Default to checked
};

const AchievementForm = forwardRef<AchievementFormRef, AchievementFormProps>(({ onSubmit, onLoadingChange }, ref) => {
  const { user } = useAuthContext();
  const { createAchievement, uploadAchievementMedia, loading, error } = useAchievement();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const skillWidgetRef = useRef<SkillSelectionWidgetRef>(null);
  const mediaWidgetRef = useRef<AchievementMediaWidgetRef>(null);
  
  // Use the form hook for state management and validation
  const {
    formData,
    errors,
    setFieldValue,
    validateForm,
    reset,
    handleSubmit: formHandleSubmit,
  } = useForm<AchievementFormData>({
    initialValues: initialFormData,
    validationRules: achievementValidationRules,
    onSubmit: async (data: AchievementFormData) => {
      console.log('📊 Form data:', JSON.stringify(data, null, 2));
      
      if (!user?.userKey) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      // Get selected skills from form data (which should be synced from widget)
      const selectedSkills = data.skills || [];
      console.log('🎯 Selected skills from form data:', selectedSkills);
      
      // Convert to API format
      const command: CreateAchievementCommand = {
        userKey: user.userKey,
        title: data.title.trim(),
        description: data.description.trim(),
        completedDate: data.completedDate,
        skills: selectedSkills, // Use skills from widget
        isPublic: data.isPublic,
      };
      
      console.log('🔄 Converted to API format:', JSON.stringify(command, null, 2));
      
      try {
        const result = await createAchievement(command);
        if (result && result.success) {
          console.log('✅ Achievement created successfully:', result);
          
          // Get the achievement entity key from the response
          const achievementKey = result.data.entityKey; // Use entityKey for the upload service
          console.log('🔑 Achievement entity key:', achievementKey);
          
          // Get images from the media widget
          const imageUris = mediaWidgetRef.current?.getImageUris() || [];
          console.log('📸 Images to upload:', imageUris.length);
          
          // If there are images to upload, call the upload service
          if (imageUris.length > 0) {
            try {
              console.log('📤 Starting media upload...');
              
              // Upload media using hook method
              const uploadResult = await uploadAchievementMedia({
                achievementKey,
                images: imageUris,
              });
              
              if (uploadResult && uploadResult.success) {
                console.log('✅ Media upload successful:', uploadResult);
                
                Alert.alert(
                  'Achievement Created Successfully!',
                  `Achievement "${result.data.title}" has been created with ${imageUris.length} image(s).\n\nAchievement Key: ${uploadResult.data.entityKey}\nUser Key: ${uploadResult.data.user.entityKey}`,
                  [{ text: 'OK' }]
                );
              } else {
                console.error('❌ Media upload failed:', uploadResult?.message);
                
                Alert.alert(
                  'Error',
                  'Achievement was created but there was an error uploading the images',
                  [{ text: 'OK' }]
                );
              }
            } catch (uploadError: any) {
              console.error('❌ Media upload exception:', uploadError);
              
              Alert.alert(
                'Error',
                'Achievement was created but there was an error uploading the images',
                [{ text: 'OK' }]
              );
            }
          } else {
            // No images to upload, just show success message
            Alert.alert(
              'Achievement Created!',
              `"${result.data.title}" has been added to your achievements.`,
              [{ text: 'OK' }]
            );
          }
          
          // Call the onSubmit callback
          onSubmit(data);
        }
      } catch (error: any) {
        console.error('❌ Achievement creation failed:', error);
        
        Alert.alert(
          'Failed to Create Achievement',
          error.message || 'An error occurred while creating the achievement',
          [{ text: 'OK' }]
        );
      }
    },
  });

  // Notify parent component about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formHandleSubmit();
    },
    resetForm: () => {
      reset();
    },
  }));

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    setFieldValue('completedDate', dateString);
    setShowDatePicker(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Error Alert Component (updated styling)
  const ErrorAlert = ({ message }: { message: string }) => (
    <View style={styles.errorAlert}>
      <View style={styles.errorIconContainer}>
        <FontAwesomeIcon 
          icon={faExclamation} 
          size={16} 
          color="#EF4444" 
        />
      </View>
      <Text style={styles.errorAlertText}>{message}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        {/* Achievement Media Widget */}
        <AchievementMediaWidget 
          ref={mediaWidgetRef}
          onImagesChange={(imageUris) => {
            console.log('Images selected:', imageUris);
            // Not integrated with form state as requested - isolated for testing
          }}
        />

        {/* Title Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => setFieldValue('title', text)}
            placeholder="Enter achievement title..."
            placeholderTextColor="#9FB3C8"
            maxLength={200}
          />
          {errors.title && <ErrorAlert message={errors.title} />}
          <Text style={styles.helperText}>{formData.title.length}/200 characters</Text>
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => setFieldValue('description', text)}
            placeholder="Describe your achievement..."
            placeholderTextColor="#9FB3C8"
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="top"
          />
          {errors.description && <ErrorAlert message={errors.description} />}
          <Text style={styles.helperText}>{formData.description.length}/1000 characters</Text>
        </View>

        {/* Date Achieved Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date Achieved *</Text>
          <TouchableOpacity
            style={[styles.dateInput, errors.completedDate && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, !formData.completedDate && styles.placeholderText]}>
              {formData.completedDate ? formatDateForDisplay(formData.completedDate) : 'Select date...'}
            </Text>
            <FontAwesomeIcon icon={faCalendar} size={16} color="#9FB3C8" />
          </TouchableOpacity>
          {errors.completedDate && <ErrorAlert message={errors.completedDate} />}
        </View>

        {/* Skills Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Skills *</Text>
          <SkillSelectionWidget 
            ref={skillWidgetRef}
            onSkillsChange={(skills) => {
              console.log('Skills selected:', skills);
              setFieldValue('skills', skills); // Sync skills to form data
            }}
          />
          {errors.skills && <ErrorAlert message={errors.skills} />}
        </View>

        {/* Is Public Field */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setFieldValue('isPublic', !formData.isPublic)}
          >
            <View style={[styles.checkbox, formData.isPublic && styles.checkboxChecked]}>
              {formData.isPublic && (
                <FontAwesomeIcon icon={faCheck} size={12} color="#171717" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Make this achievement public</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Public achievements can be viewed by other users
          </Text>
        </View>
      </View>

      {/* Date Picker Modal */}
      <CustomDatePicker
        visible={showDatePicker}
        value={formData.completedDate ? new Date(formData.completedDate) : null}
        maximumDate={new Date()}
        onDateChange={handleDateSelect}
        onCancel={() => setShowDatePicker(false)}
        title="Date Achieved"
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C',
  },
  formContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FCFCFC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#47505A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FCFCFC',
    borderWidth: 1,
    borderColor: '#5F6B78',
  },
  textArea: {
    backgroundColor: '#47505A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FCFCFC',
    borderWidth: 1,
    borderColor: '#5F6B78',
    minHeight: 100,
  },
  dateInput: {
    backgroundColor: '#47505A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#5F6B78',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#FCFCFC',
  },
  placeholderText: {
    color: '#9FB3C8',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  helperText: {
    color: '#9FB3C8',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#5F6B78',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#F8C825',
    borderColor: '#F8C825',
  },
  checkboxLabel: {
    color: '#FCFCFC',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8C825',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#5F6B78',
  },
  submitButtonText: {
    color: '#171717',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#9FB3C8',
  },
  // Error Alert styles (updated)
  errorAlert: {
    paddingHorizontal: 0, // Remove left/right padding to align with fields
    paddingVertical: 4, // Reduce top/bottom padding
    marginTop: 4, // Reduce space from field above
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorIconContainer: {
    marginRight: 8,
    marginTop: 2,
  },
  errorAlertText: {
    color: '#EF4444', // error-500 from theme
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default AchievementForm;

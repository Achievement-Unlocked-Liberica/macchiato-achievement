/**
 * Achievement Service
 * 
 * Handles API communication for achievement-related operations
 */

import { buildApiUrl, apiSecureFetch, ApiResponse, ApiError } from '../../common/services/apiConfig';
import { CreateAchievementCommand, UploadAchievementMediaCommand } from './commands';
import { CreateAchievementResponse, UploadAchievementMediaResponse, GetAchievementItemsResponse } from './responses';
import { LATEST_ACHIEVEMENTS_LIMIT } from '../../common/constants/achievementConstants';

export class AchievementService {
  private static readonly ENDPOINT = '/api/cmd/achievement';

  /**
   * Create a new achievement
   */
  static async createAchievement(command: CreateAchievementCommand): Promise<CreateAchievementResponse> {
    console.log('🎯 AchievementService.createAchievement() called');
    console.log('📋 Achievement data:', JSON.stringify(command, null, 2));

    try {
      const url = buildApiUrl(this.ENDPOINT);
      console.log('🌐 API URL:', url);

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '1',
        },
        body: JSON.stringify(command),
      };

      console.log('📡 Making API request...');
      const response = await apiSecureFetch(url, requestOptions);

      if (!response.ok) {
        console.error('❌ HTTP Error Response');
        
        let errorData = '';
        let errorDetails = null;
        
        try {
          errorData = await response.text();
          console.log('📄 Raw error response body:', errorData);
          
          try {
            errorDetails = JSON.parse(errorData);
            console.log('🔍 Parsed error details:', JSON.stringify(errorDetails, null, 2));
          } catch (parseError) {
            console.log('⚠️ Error response is not valid JSON, treating as plain text');
          }
        } catch (readError) {
          console.error('❌ Failed to read error response body:', readError);
          errorData = 'Unable to read error response';
        }
        
        const apiError = new ApiError(
          `Failed to create achievement: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`,
          response.status,
          errorDetails || errorData
        );
        
        console.error('💥 Throwing ApiError:', apiError);
        throw apiError;
      }

      console.log('✅ Successful response, parsing JSON...');
      const result = await response.json();
      console.log('📊 API response data:', JSON.stringify(result, null, 2));
      
      return result as CreateAchievementResponse;
    } catch (error) {
      console.error('❌ Failed to create achievement:', error);
      throw error;
    }
  }

  /**
   * Upload media to an existing achievement
   */
  static async uploadMedia(command: UploadAchievementMediaCommand): Promise<UploadAchievementMediaResponse> {
    console.log('🔄 AchievementService.uploadMedia() called');
    console.log('🎯 Achievement key:', command.achievementKey);
    console.log('📊 Images to upload:', command.images.length);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add each image to the form data
      for (let i = 0; i < command.images.length; i++) {
        const imageUri = command.images[i];
        
        // Create file object from URI
        const filename = `achievement_image_${i + 1}.jpg`;
        
        // For React Native, we need to append files with proper structure
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: filename,
        } as any);
      }

      const url = buildApiUrl(`${this.ENDPOINT}/${command.achievementKey}/media`);
      console.log('🌐 Upload URL:', url);

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'X-API-Version': '1',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };

      console.log('📡 Making upload request...');
      const response = await apiSecureFetch(url, requestOptions);

      console.log('📡 Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed with status:', response.status, errorText);
        throw new ApiError(
          `Upload failed: ${response.status} ${response.statusText}`,
          response.status,
          errorText
        );
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);

      return {
        success: true,
        data: result.data,
      };
    } catch (error: any) {
      console.error('❌ Media upload error:', error);
      return {
        success: false,
        data: {
          entityKey: '',
          user: { entityKey: '' },
          uploadedCount: 0,
        },
        message: error.message || 'Failed to upload media',
      };
    }
  }

  /**
   * Get latest achievements
   */
  static async getLatestAchievements(): Promise<GetAchievementItemsResponse> {
    console.log('🔄 AchievementService.getLatestAchievements() called');

    try {
      const url = buildApiUrl(`/api/qry/v1/achievement/latest?size=sm&limit=${LATEST_ACHIEVEMENTS_LIMIT}`);
      console.log('🌐 API URL:', url);

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '1',
        },
      };

      console.log('📡 Making API request...');
      const response = await apiSecureFetch(url, requestOptions);

      if (!response.ok) {
        console.error('❌ HTTP Error Response');
        
        let errorData = '';
        let errorDetails = null;
        
        try {
          errorData = await response.text();
          console.log('📄 Raw error response body:', errorData);
          
          try {
            errorDetails = JSON.parse(errorData);
            console.log('🔍 Parsed error details:', JSON.stringify(errorDetails, null, 2));
          } catch (parseError) {
            console.log('⚠️ Error response is not valid JSON, treating as plain text');
          }
        } catch (readError) {
          console.error('❌ Failed to read error response body:', readError);
          errorData = 'Unable to read error response';
        }
        
        const apiError = new ApiError(
          `Failed to get latest achievements: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`,
          response.status,
          errorDetails || errorData
        );
        
        console.error('💥 Throwing ApiError:', apiError);
        throw apiError;
      }

      console.log('✅ Successful response, parsing JSON...');
      const result = await response.json();
      console.log('📊 API response data:', JSON.stringify(result, null, 2));
      
      // The API returns { success: true, data: [array of achievements] }
      // We need to extract the data array and wrap it in our response structure
      const achievements = Array.isArray(result.data) ? result.data : [];
      console.log('🎯 Processed achievements array:', achievements.length, 'items');
      
      return {
        success: true,
        data: achievements,
      };
    } catch (error) {
      console.error('❌ Failed to get latest achievements:', error);
      throw error;
    }
  }
}

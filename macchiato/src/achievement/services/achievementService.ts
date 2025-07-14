/**
 * Achievement Service
 * 
 * Handles API communication for achievement-related operations
 */

import { buildApiUrl, apiSecureFetch, ApiResponse, ApiError } from '../../common/services/apiConfig';
import { CreateAchievementCommand } from './commands/CreateAchievementCommand';

export interface CreateAchievementResponse {
  success: boolean;
  data: {
    achievementId: string;
    userKey: string;
    title: string;
    createdAt: string;
  };
}

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
}

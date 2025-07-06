import { API_CONFIG, buildApiUrl, apiSecureFetch, ApiResponse, ApiError } from '../../common/services/apiConfig';
import { AddUserCommand, AddUserResponse } from './commands/AddUserCommand';

/**
 * UserService
 * 
 * Service class responsible for all user-related API calls.
 * Handles user registration, authentication, and profile management.
 */
export class UserService {
  /**
   * Add a new user to the system
   * 
   * @param command - The user data to create
   * @returns Promise with the created user data
   * @throws ApiError if the request fails
   */
  static async addUser(command: AddUserCommand): Promise<AddUserResponse> {
    console.log('🚀 UserService.addUser() called');
    console.log('📝 Request payload:', JSON.stringify(command, null, 2));
    
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER);
      console.log('🌐 API URL:', url);
      
      const requestOptions: RequestInit = {
        method: 'POST',
        body: JSON.stringify(command),
      };

      console.log('⚙️ Request options:', {
        method: requestOptions.method,
        bodySize: typeof requestOptions.body === 'string' ? requestOptions.body.length : 'unknown',
      });

      console.log('📤 Making secure fetch request...');
      const response = await apiSecureFetch(url, requestOptions);
      
      console.log('📥 Response received:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('❌ HTTP Error Response');
        
        let errorData = '';
        let errorDetails = null;
        
        try {
          errorData = await response.text();
          console.log('📄 Raw error response body:', errorData);
          
          // Try to parse as JSON for more details
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
          `Failed to create user: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`,
          response.status,
          errorDetails || errorData
        );
        
        console.error('💥 Throwing ApiError:', apiError);
        throw apiError;
      }

      console.log('✅ Successful response, parsing JSON...');
      const result = await response.json();
      console.log('📊 API response data:', JSON.stringify(result, null, 2));
      
      return result as AddUserResponse;
    } catch (error) {
      console.error('💀 Exception in UserService.addUser():');
      
      if (error instanceof ApiError) {
        console.error('  - Type: ApiError');
        console.error('  - Message:', error.message);
        console.error('  - Status Code:', error.statusCode);
        console.error('  - Response Data:', error.response);
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('  - Type: Network Error (fetch failed)');
        console.error('  - Message:', error.message);
        console.error('  - Possible causes: Network connectivity, CORS, server down');
        
        throw new ApiError(
          `Network error: Unable to connect to server at ${buildApiUrl(API_CONFIG.ENDPOINTS.USER)}`,
          undefined,
          error
        );
      }
      
      console.error('  - Type: Unexpected Error');
      if (error instanceof Error) {
        console.error('  - Constructor:', error.constructor.name);
        console.error('  - Message:', error.message);
        console.error('  - Stack:', error.stack);
      } else {
        console.error('  - Value:', error);
      }
      
      // Handle network errors or other unexpected errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new ApiError(
        `Unexpected error occurred while creating user: ${errorMessage}`,
        undefined,
        error
      );
    }
  }

  /**
   * Helper method to format date from Date object to API format (YYYY-MM-DD)
   * 
   * @param date - Date object to format
   * @returns Formatted date string
   */
  static formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper method to validate user command before API call
   * 
   * @param command - Command to validate
   * @throws Error if validation fails
   */
  static validateAddUserCommand(command: AddUserCommand): void {
    const errors: string[] = [];

    if (!command.username?.trim()) {
      errors.push('Username is required');
    }
    
    if (!command.email?.trim()) {
      errors.push('Email is required');
    }
    
    if (!command.firstName?.trim()) {
      errors.push('First name is required');
    }
    
    if (!command.lastName?.trim()) {
      errors.push('Last name is required');
    }
    
    if (!command.birthDate?.trim()) {
      errors.push('Birth date is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

export default UserService;

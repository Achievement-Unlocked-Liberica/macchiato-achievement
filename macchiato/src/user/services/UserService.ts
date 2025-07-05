import { API_CONFIG, buildApiUrl, getCommonFetchOptions, ApiResponse, ApiError } from '../../common/services/apiConfig';
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
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER);
      
      const requestOptions: RequestInit = {
        ...getCommonFetchOptions(),
        method: 'POST',
        body: JSON.stringify(command),
      };

      console.log('Making API request to:', url);
      console.log('Request payload:', command);

      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new ApiError(
          `Failed to create user: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const result = await response.json();
      console.log('API response:', result);
      
      return result as AddUserResponse;
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors or other unexpected errors
      throw new ApiError(
        'Network error occurred while creating user',
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

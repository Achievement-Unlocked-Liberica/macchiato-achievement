import { API_CONFIG, buildApiUrl, apiSecureFetch, ApiResponse, ApiError } from '../../common/services/apiConfig';
import { TokenStorageService } from '../../common/services/tokenStorage';
import { AddUserCommand, AddUserResponse } from './commands/AddUserCommand';
import { RegisterUserCommand, RegisterUserResponse } from './commands/RegisterUserCommand';
import { AuthCredentialsCommand, AuthResponse } from './commands/AuthCredentialsCommand';
import { UserDto, UserProfileResponse } from '../models/UserDto';

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
   * Register a new user through the security service
   * 
   * @param command - The user registration data
   * @returns Promise with the registered user data
   * @throws ApiError if the request fails
   */
  static async registerUser(command: RegisterUserCommand): Promise<RegisterUserResponse> {
    console.log('🚀 UserService.registerUser() called');
    console.log('📝 Request payload:', JSON.stringify(command, null, 2));
    
    // Validate the command before making the API call
    this.validateRegisterUserCommand(command);
    
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER);
    console.log('📡 Making API call to:', url);
    
    try {
      console.log('🔄 Sending registration request...');
      
      const response = await apiSecureFetch(url, {
        method: 'POST',
        body: JSON.stringify(command),
      });
      
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
          `Failed to register user: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`,
          response.status,
          errorDetails
        );
        
        console.error('💀 Throwing ApiError:', apiError.message);
        throw apiError;
      }
      
      console.log('✅ Registration successful, parsing response...');
      
      const responseData = await response.text();
      console.log('📄 Raw response body:', responseData);
      
      let result: RegisterUserResponse;
      try {
        result = JSON.parse(responseData);
        console.log('🎯 Parsed response data:', JSON.stringify(result, null, 2));
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        console.error('📄 Response body that failed to parse:', responseData);
        throw new ApiError('Invalid JSON response from server', response.status);
      }
      
      console.log('✅ UserService.registerUser() completed successfully');
      return result as RegisterUserResponse;
    } catch (error) {
      console.error('💀 Exception in UserService.registerUser():');
      
      if (error instanceof ApiError) {
        console.error('  - Type: ApiError (rethrowing)');
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('  - Type: Network Error');
        console.error('  - Details:', error.message);
        throw new ApiError(
          `Network error: Unable to connect to server at ${buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER)}`,
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
        `Unexpected error occurred while registering user: ${errorMessage}`,
        undefined,
        error
      );
    }
  }

  /**
   * Authenticate a user with username and password
   * 
   * @param command - The authentication credentials
   * @returns Promise with the authentication response containing JWT token
   * @throws ApiError if the request fails
   */
  static async authenticate(command: AuthCredentialsCommand): Promise<AuthResponse> {
    console.log('🚀 UserService.authenticate() called');
    console.log('📝 Request payload:', JSON.stringify({ username: command.username, password: '[REDACTED]' }, null, 2));
    
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH);
      console.log('🌐 API URL:', url);
      
      const requestOptions: RequestInit = {
        method: 'POST',
        body: JSON.stringify(command),
      };

      console.log('⚙️ Request options:', {
        method: requestOptions.method,
        bodySize: typeof requestOptions.body === 'string' ? requestOptions.body.length : 'unknown',
      });

      console.log('📤 Making secure fetch request (without auth headers)...');
      const response = await apiSecureFetch(url, requestOptions, false);
      
      console.log('📥 Response received:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      
      if (!response.ok) {
        console.error('❌ HTTP Error Response');
        
        let errorData = '';
        let errorDetails = null;
        
        try {
          const responseText = await response.text();
          errorData = responseText;
          
          if (responseText.trim()) {
            errorDetails = JSON.parse(responseText);
            console.error('📄 Error response body:', errorDetails);
          }
        } catch (parseError) {
          console.error('⚠️ Failed to parse error response body:', parseError);
          console.error('📄 Raw error response:', errorData);
        }
        
        // For authentication, we want to return the error message from the server
        if (response.status === 401 && errorDetails && errorDetails.data) {
          throw new ApiError(
            errorDetails.data,
            response.status,
            errorDetails
          );
        }
        
        throw new ApiError(
          `Authentication failed: ${response.status} ${response.statusText}`,
          response.status,
          errorDetails
        );
      }
      
      const responseData = await response.text();
      console.log('📄 Raw response body length:', responseData.length);
      
      let result: AuthResponse;
      try {
        result = JSON.parse(responseData);
        console.log('✅ Authentication successful:', {
          success: result.success,
          userKey: result.data?.userKey,
          username: result.data?.username,
          tokenType: result.data?.tokenType,
          hasToken: !!result.data?.token
        });

        // Store authentication data securely
        if (result.success && result.data) {
          try {
            await TokenStorageService.storeAuthData({
              token: result.data.token,
              tokenType: result.data.tokenType,
              userKey: result.data.userKey,
              username: result.data.username,
              email: result.data.email,
            });
            console.log('🔐 Authentication data stored securely');
          } catch (storageError) {
            console.error('❌ Failed to store authentication data:', storageError);
            // Don't throw here, authentication was successful
          }
        }
      } catch (parseError) {
        console.error('❌ Failed to parse authentication response JSON:', parseError);
        console.error('📄 Response body that failed to parse:', responseData);
        throw new ApiError('Invalid JSON response from server', response.status);
      }
      
      console.log('✅ UserService.authenticate() completed successfully');
      return result as AuthResponse;
    } catch (error) {
      console.error('💀 Exception in UserService.authenticate():');
      
      if (error instanceof ApiError) {
        console.error('  - Type: ApiError (rethrowing)');
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('  - Type: Network Error');
        console.error('  - Details:', error.message);
        throw new ApiError(
          `Network error: Unable to connect to server at ${buildApiUrl(API_CONFIG.ENDPOINTS.AUTH)}`,
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
        `Unexpected error occurred while authenticating user: ${errorMessage}`,
        undefined,
        error
      );
    }
  }

  /**
   * Logout user and clear stored authentication data
   */
  static async logout(): Promise<void> {
    console.log('🚀 UserService.logout() called');
    
    try {
      await TokenStorageService.clearAuthData();
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Failed to logout user:', error);
      throw new Error('Failed to clear authentication data');
    }
  }

  /**
   * Helper method to validate register user command before API call
   * 
   * @param command - Command to validate
   * @throws Error if validation fails
   */
  static validateRegisterUserCommand(command: RegisterUserCommand): void {
    const errors: string[] = [];

    if (!command.username?.trim()) {
      errors.push('Username is required');
    }
    
    if (!command.email?.trim()) {
      errors.push('Email is required');
    }
    
    if (!command.password?.trim()) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
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
    
    if (!command.password?.trim()) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Helper method to validate authentication credentials before API call
   * 
   * @param command - Command to validate
   * @throws Error if validation fails
   */
  static validateAuthCredentialsCommand(command: AuthCredentialsCommand): void {
    const errors: string[] = [];

    if (!command.username?.trim()) {
      errors.push('Username is required');
    }
    
    if (!command.password?.trim()) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Get current user profile
   * 
   * @returns Promise with the user profile data
   * @throws ApiError if the request fails
   */
  static async getUserProfile(): Promise<UserDto> {
    console.log('🚀 UserService.getUserProfile() called');
    
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE);
      console.log('🌐 API URL:', url);
      
      const requestOptions: RequestInit = {
        method: 'GET',
      };

      console.log('⚙️ Request options:', {
        method: requestOptions.method,
      });

      console.log('📤 Making secure fetch request with auth headers...');
      const response = await apiSecureFetch(url, requestOptions, true);
      
      console.log('📥 Response received:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      
      if (!response.ok) {
        console.error('❌ HTTP Error Response');
        
        let errorData = '';
        let errorDetails = null;
        
        try {
          const responseText = await response.text();
          errorData = responseText;
          
          if (responseText.trim()) {
            errorDetails = JSON.parse(responseText);
            console.error('📄 Error response body:', errorDetails);
          }
        } catch (parseError) {
          console.error('⚠️ Failed to parse error response body:', parseError);
          console.error('📄 Raw error response:', errorData);
        }
        
        throw new ApiError(
          `Failed to get user profile: ${response.status} ${response.statusText}`,
          response.status,
          errorDetails
        );
      }
      
      const responseData = await response.text();
      console.log('📄 Raw response body length:', responseData.length);
      
      let result: UserProfileResponse;
      try {
        result = JSON.parse(responseData);
        console.log('✅ User profile retrieved successfully:', {
          success: result.success,
          username: result.data?.username,
          entityKey: result.data?.entityKey,
          firstName: result.data?.firstName,
          lastName: result.data?.lastName,
        });

        // Convert birthDate string to Date object if needed
        if (result.data && result.data.birthDate) {
          result.data.birthDate = new Date(result.data.birthDate);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse user profile response JSON:', parseError);
        console.error('📄 Response body that failed to parse:', responseData);
        throw new ApiError('Invalid JSON response from server', response.status);
      }
      
      console.log('✅ UserService.getUserProfile() completed successfully');
      return result.data;
    } catch (error) {
      console.error('💀 Exception in UserService.getUserProfile():');
      
      if (error instanceof ApiError) {
        console.error('  - Type: ApiError (rethrowing)');
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('  - Type: Network Error');
        console.error('  - Details:', error.message);
        throw new ApiError(
          `Network error: Unable to connect to server at ${buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE)}`,
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
        `Unexpected error occurred while getting user profile: ${errorMessage}`,
        undefined,
        error
      );
    }
  }

}

export default UserService;

/**
 * AuthCredentialsCommand
 * 
 * Command type for user authentication requests.
 * Contains the credentials needed to authenticate a user.
 */

export interface AuthCredentialsCommand {
  username: string;
  password: string;
}

/**
 * AuthResponse
 * 
 * Response type for successful authentication requests.
 * Contains the JWT token and user information.
 */
export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    tokenType: string;
    expiresAt: number;
    userKey: string;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  httpStatus: string;
}

/**
 * AuthErrorResponse
 * 
 * Response type for failed authentication requests.
 */
export interface AuthErrorResponse {
  success: boolean;
  data: string;
  httpStatus: string;
}

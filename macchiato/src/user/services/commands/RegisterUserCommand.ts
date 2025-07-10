/**
 * RegisterUserCommand
 * 
 * Command interface for registering a new user through the security service.
 * Matches the API contract for POST /api/cmd/security/register
 */

export interface RegisterUserCommand {
  username: string;
  password: string;
  email: string;
}

/**
 * Response interface for user registration
 */
export interface RegisterUserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

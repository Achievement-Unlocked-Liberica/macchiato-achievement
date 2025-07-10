/**
 * AddUserCommand
 * 
 * Command interface for adding a new user to the system.
 * Matches the API contract for POST /api/cmd/user
 */

export interface AddUserCommand {
  username: string;
  email: string;
  password: string;
}

/**
 * Response interface for user creation
 */
export interface AddUserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

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
  firstName: string;
  lastName: string;
  birthDate: string; // Format: YYYY-MM-DD
}

/**
 * Response interface for user creation
 */
export interface AddUserResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
}

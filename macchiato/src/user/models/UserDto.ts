/**
 * UserDto
 * 
 * Data Transfer Object representing a user profile from the API.
 * Contains all user information returned by the '/api/qry/user/me' endpoint.
 */

export interface UserDto {
  active: boolean;
  username: string;
  entityKey: string;
  firstName: string;
  birthDate: Date;
  lastName: string;
  email: string;
  profileImage: string;
}

/**
 * Raw API response for user profile
 */
export interface UserProfileResponse {
  success: boolean;
  data: UserDto;
  httpStatus: string;
}

/**
 * Get Achievement Detail Response Types
 * 
 * Response types for the achievement detail query API
 */

export interface AchievementDetailMedia {
  fileSize: number;
  contentType: string;
  imageName: string;
  originalImageName: string;
  mediaUrl: string;
  imageKey: string;
}

export interface AchievementDetailUser {
  entityKey: string;
  username: string;
  profileImage: string | null;
  email: string;
  lastName: string;
  birthDate: string | null;
  firstName: string;
}

export interface AchievementDetail {
  description: string;
  title: string;
  entityKey: string;
  completedDate: string;
  media: AchievementDetailMedia[];
  skills: string[];
  user: AchievementDetailUser;
  achievementVisibility: string;
}

export interface GetAchievementDetailResponse {
  success: boolean;
  count: number | null;
  data: AchievementDetail;
  httpStatus: string;
}

/**
 * Get Achievement Items Response Types
 * 
 * Response types for the achievement items query API
 */

export interface AchievementMedia {
  imageKey: string;
  mediaUrl: string;
}

export interface AchievementUser {
  email: string;
  entityKey: string;
  username: string;
}

export interface AchievementItem {
  description: string;
  user: AchievementUser;
  media: AchievementMedia[];
  title: string;
  entityKey: string;
  completedDate?: string;
  skills?: string[];
}

export interface GetAchievementItemsResponse {
  success: boolean;
  data: AchievementItem[];
}

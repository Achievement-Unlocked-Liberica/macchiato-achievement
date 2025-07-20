/**
 * Create Achievement Response
 * 
 * Response type for achievement creation operations
 */

export interface CreateAchievementResponse {
  success: boolean;
  data: {
    entityKey: string;
    achievementId: string;
    userKey: string;
    title: string;
    createdAt: string;
  };
}

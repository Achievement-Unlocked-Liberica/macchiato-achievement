/**
 * CreateAchievementCommand
 * 
 * Command model for creating a new achievement
 */

export interface CreateAchievementCommand {
  userKey: string;
  title: string;
  description: string;
  completedDate: string; // ISO date string format (YYYY-MM-DD)
  skills: string[];
  isPublic: boolean;
}

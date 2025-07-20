/**
 * Upload Achievement Media Command
 * 
 * Command object for uploading images to an existing achievement
 */

export interface UploadAchievementMediaCommand {
  achievementKey: string;
  images: string[]; // Array of image URIs
}

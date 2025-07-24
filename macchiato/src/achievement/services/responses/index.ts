/**
 * Responses exports
 */

export * from './CreateAchievementResponse';
export * from './UploadAchievementMediaResponse';
export * from './GetAchievementItemsResponse';

// Type aliases for backward compatibility
export type { AchievementItem as LatestAchievement, GetAchievementItemsResponse as GetLatestAchievementsResponse } from './GetAchievementItemsResponse';

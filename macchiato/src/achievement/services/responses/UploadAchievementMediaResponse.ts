/**
 * Upload Achievement Media Response
 * 
 * Response type for achievement media upload operations
 */

export interface UploadAchievementMediaResponse {
  success: boolean;
  data: {
    entityKey: string;
    user: {
      entityKey: string;
    };
    uploadedCount: number;
  };
  message?: string;
}

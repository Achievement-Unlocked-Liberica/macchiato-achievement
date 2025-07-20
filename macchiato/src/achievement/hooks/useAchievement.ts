/**
 * Achievement Hook
 * 
 * Custom hook for achievement-related operations
 */

import { useCallback } from 'react';
import { useAPI } from '../../common/hooks';
import { AchievementService } from '../services/achievementService';
import { CreateAchievementCommand, UploadAchievementMediaCommand } from '../services/commands';
import { CreateAchievementResponse, UploadAchievementMediaResponse } from '../services/responses';

export const useAchievement = () => {
  const { loading, error, execute, clearError } = useAPI();

  const createAchievement = useCallback(async (command: CreateAchievementCommand): Promise<CreateAchievementResponse | null> => {
    console.log('🎯 useAchievement.createAchievement() called');
    console.log('📋 Command data:', JSON.stringify(command, null, 2));

    if (loading) {
      console.log('⏳ Another request is already in progress, skipping...');
      return null;
    }

    return execute(() => {
      console.log('🔄 Executing AchievementService.createAchievement...');
      return AchievementService.createAchievement(command);
    });
  }, [execute, loading]);

  const uploadAchievementMedia = useCallback(async (command: UploadAchievementMediaCommand): Promise<UploadAchievementMediaResponse | null> => {
    console.log('🎯 useAchievement.uploadAchievementMedia() called');
    console.log('📋 Upload command data:', JSON.stringify(command, null, 2));

    if (loading) {
      console.log('⏳ Another request is already in progress, skipping...');
      return null;
    }

    return execute(() => {
      console.log('🔄 Executing AchievementService.uploadMedia...');
      return AchievementService.uploadMedia(command);
    });
  }, [execute, loading]);

  return {
    loading,
    error,
    createAchievement,
    uploadAchievementMedia,
    clearError,
  };
};

/**
 * Achievement Hook
 * 
 * Custom hook for achievement-related operations
 */

import { useCallback } from 'react';
import { useAPI } from '../../common/hooks';
import { AchievementService } from '../services/achievementService';
import { CreateAchievementCommand, UploadAchievementMediaCommand } from '../services/commands';
import { CreateAchievementResponse, UploadAchievementMediaResponse, GetAchievementItemsResponse, GetAchievementDetailResponse } from '../services/responses';

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

  const getLatestAchievements = useCallback(async (): Promise<GetAchievementItemsResponse | null> => {
    console.log('🎯 useAchievement.getLatestAchievements() called');

    if (loading) {
      console.log('⏳ Another request is already in progress, skipping...');
      return null;
    }

    return execute(() => {
      console.log('🔄 Executing AchievementService.getLatestAchievements...');
      return AchievementService.getLatestAchievements();
    });
  }, [execute, loading]);

  const getAchievementDetail = useCallback(async (entityKey: string): Promise<GetAchievementDetailResponse | null> => {
    console.log('🎯 useAchievement.getAchievementDetail() called');
    console.log('📋 Entity Key:', entityKey);

    return execute(() => {
      console.log('🔄 Executing AchievementService.getAchievementDetail...');
      return AchievementService.getAchievementDetail(entityKey);
    });
  }, [execute]); // Remove loading from dependencies to prevent recreation

  return {
    loading,
    error,
    createAchievement,
    uploadAchievementMedia,
    getLatestAchievements,
    getAchievementDetail,
    clearError,
  };
};

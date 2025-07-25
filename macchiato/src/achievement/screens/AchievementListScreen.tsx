/**
 * Achievement List Screen
 * 
 * Main screen for displaying the latest achievements list/grid
 * with navigation header, filter widget, and proper layout structure
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AchievementListComponent from '../components/AchievementListComponent';
import AchievementGridComponent from '../components/AchievementGridComponent';
import AchievementFilterWidget from '../components/AchievementFilterWidget';
import { useAchievement } from '../hooks/useAchievement';
import { AchievementItem } from '../services/responses';

const AchievementListScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { getLatestAchievements } = useAchievement();
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load achievements on component mount
  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 AchievementListScreen: Making service call...');
      const result = await getLatestAchievements();
      
      console.log('📊 AchievementListScreen: Service result:', result);
      
      if (result && result.success) {
        console.log('✅ AchievementListScreen: Data received:', result.data);
        console.log('📝 AchievementListScreen: Number of achievements:', result.data?.length || 0);
        
        // Ensure we have a valid array
        const achievementsArray = Array.isArray(result.data) ? result.data : [];
        console.log('🔄 AchievementListScreen: Setting achievements array with', achievementsArray.length, 'items');
        
        setAchievements(achievementsArray);
      } else {
        console.log('❌ AchievementListScreen: Service call failed');
        const errorMessage = 'Failed to load achievements';
        setError(errorMessage);
        handleError(errorMessage);
      }
    } catch (err) {
      console.log('💥 AchievementListScreen: Exception caught:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      handleError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAchievements(true);
  };

  const handleError = (error: string) => {
    console.error('Achievement List Error:', error);
    // In a real app, you might want to show a toast or alert here
  };

  const handleViewModeChange = (mode: 'list' | 'grid') => {
    console.log('🔄 AchievementListScreen: View mode changing to:', mode);
    setViewMode(mode);
  };

  console.log('🎬 AchievementListScreen: Rendering with viewMode:', viewMode);

  return (
    <View style={styles.container}>
      {/* Filter Widget - Always visible at the top */}
      <AchievementFilterWidget 
        viewMode={viewMode} 
        onViewModeChange={handleViewModeChange} 
      />
      
      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <AchievementListComponent 
          achievements={achievements}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={handleRefresh}
          onError={handleError} 
        />
      ) : (
        <AchievementGridComponent 
          achievements={achievements}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={handleRefresh}
          onError={handleError} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});

export default AchievementListScreen;

/**
 * Achievement List Component
 * 
 * Component responsible for fetching and displaying the latest achievements list
 * with loading states, error handling, and refresh functionality
 */

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import { useAchievement } from '../hooks/useAchievement';
import { AchievementItem } from '../services/responses';
import AchievementItemWidget from './AchievementItemWidget';

interface AchievementListComponentProps {
  onError?: (error: string) => void;
}

const AchievementListComponent: React.FC<AchievementListComponentProps> = ({ 
  onError
}) => {
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

      console.log('🔄 AchievementListComponent: Making service call...');
      const result = await getLatestAchievements();
      
      console.log('📊 AchievementListComponent: Service result:', result);
      
      if (result && result.success) {
        console.log('✅ AchievementListComponent: Data received:', result.data);
        console.log('📝 AchievementListComponent: Number of achievements:', result.data?.length || 0);
        
        // Ensure we have a valid array
        const achievementsArray = Array.isArray(result.data) ? result.data : [];
        console.log('🔄 AchievementListComponent: Setting achievements array with', achievementsArray.length, 'items');
        
        setAchievements(achievementsArray);
      } else {
        console.log('❌ AchievementListComponent: Service call failed');
        const errorMessage = 'Failed to load achievements';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      console.log('💥 AchievementListComponent: Exception caught:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAchievements(true);
  };

  const renderItem = ({ item }: { item: AchievementItem }) => {
    console.log('🎯 AchievementListComponent: Rendering item:', item.title);
    return <AchievementItemWidget achievement={item} />;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Achievements Yet</Text>
      <Text style={styles.emptyMessage}>
        Start creating achievements to see them appear here!
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Unable to load achievements</Text>
      <Text style={styles.errorMessage}>{error}</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading achievements...</Text>
    </View>
  );

  if (loading && !refreshing) {
    return renderLoadingState();
  }

  if (error && !refreshing) {
    return renderErrorState();
  }

  console.log('🎨 AchievementListComponent: About to render FlatList with', achievements.length, 'items');
  console.log('📋 AchievementListComponent: Current achievements:', achievements);

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        renderItem={renderItem}
        keyExtractor={(item) => item.entityKey}
        contentContainerStyle={[
          styles.listContainer,
          achievements.length === 0 && styles.emptyListContainer
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#9FB3C8"
            colors={['#9FB3C8']}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FCFCFC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    color: '#9FB3C8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorTitle: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#9FB3C8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#9FB3C8',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AchievementListComponent;

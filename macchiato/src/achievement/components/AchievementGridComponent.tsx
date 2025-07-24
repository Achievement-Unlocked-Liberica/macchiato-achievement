/**
 * Achievement Grid Component
 * 
 * Component responsible for displaying achievements in a 3-column grid layout
 * with loading states, error handling, and refresh functionality
 */

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { useAchievement } from '../hooks/useAchievement';
import { AchievementItem } from '../services/responses';
import AchievementCardWidget from './AchievementCardWidget';

interface AchievementGridComponentProps {
  onError?: (error: string) => void;
}

const AchievementGridComponent: React.FC<AchievementGridComponentProps> = ({ onError }) => {
  const { getLatestAchievements } = useAchievement();
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get screen width for responsive grid
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 36) / 3; // 3 columns with margins

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

      console.log('🔄 AchievementGridComponent: Making service call...');
      const result = await getLatestAchievements();
      
      console.log('📊 AchievementGridComponent: Service result:', result);
      
      if (result && result.success) {
        console.log('✅ AchievementGridComponent: Data received:', result.data);
        console.log('📝 AchievementGridComponent: Number of achievements:', result.data?.length || 0);
        
        // Ensure we have a valid array
        const achievementsArray = Array.isArray(result.data) ? result.data : [];
        console.log('🔄 AchievementGridComponent: Setting achievements array with', achievementsArray.length, 'items');
        
        setAchievements(achievementsArray);
      } else {
        const errorMessage = 'Failed to load achievements - invalid response';
        console.error('❌ AchievementGridComponent:', errorMessage);
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = `Failed to load achievements: ${error}`;
      console.error('❌ AchievementGridComponent:', errorMessage);
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadAchievements(true);
  };

  const renderAchievementCard = ({ item }: { item: AchievementItem }) => (
    <View style={[styles.cardContainer, { width: itemWidth }]}>
      <AchievementCardWidget achievement={item} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No achievements to display</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        renderItem={renderAchievementCard}
        keyExtractor={(item) => item.entityKey}
        numColumns={3}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9FB3C8"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 4,
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9FB3C8',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#9FB3C8',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AchievementGridComponent;

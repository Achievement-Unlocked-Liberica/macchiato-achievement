/**
 * Achievement Grid Component
 * 
 * Component responsible for displaying achievements in a 3-column grid layout
 * with loading states, error handling, and refresh functionality
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { AchievementItem } from '../services/responses';
import AchievementCardWidget from './AchievementCardWidget';

interface AchievementGridComponentProps {
  achievements: AchievementItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onError?: (error: string) => void;
  onAchievementSelect?: (achievement: AchievementItem) => void;
}

const AchievementGridComponent: React.FC<AchievementGridComponentProps> = ({ 
  achievements,
  loading,
  refreshing,
  error,
  onRefresh,
  onError,
  onAchievementSelect
}) => {
  // Get screen width for responsive grid
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / 3; // 3 columns with margins

  const renderAchievementCard = ({ item }: { item: AchievementItem }) => (
    <View style={[styles.cardContainer, { width: itemWidth }]}>
      <AchievementCardWidget 
        achievement={item}
        onPress={onAchievementSelect ? () => onAchievementSelect(item) : undefined}
      />
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

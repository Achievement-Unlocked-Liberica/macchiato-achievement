/**
 * Achievement List Component
 * 
 * Component responsible for fetching and displaying the latest achievements list
 * with loading states, error handling, and refresh functionality
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import { AchievementItem } from '../services/responses';
import AchievementItemWidget from './AchievementItemWidget';

interface AchievementListComponentProps {
  achievements: AchievementItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onError?: (error: string) => void;
  onAchievementSelect?: (achievement: AchievementItem) => void;
}

const AchievementListComponent: React.FC<AchievementListComponentProps> = ({ 
  achievements,
  loading,
  refreshing,
  error,
  onRefresh,
  onError,
  onAchievementSelect
}) => {

  const renderItem = ({ item }: { item: AchievementItem }) => {
    console.log('🎯 AchievementListComponent: Rendering item:', item.title);
    return (
      <AchievementItemWidget 
        achievement={item} 
        onPress={onAchievementSelect ? () => onAchievementSelect(item) : undefined}
      />
    );
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
            onRefresh={onRefresh}
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
    paddingHorizontal: 4,
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

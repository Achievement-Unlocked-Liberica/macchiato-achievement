/**
 * Achievement List Screen
 * 
 * Main screen for displaying the latest achievements list/grid
 * with navigation header, filter widget, and proper layout structure
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AchievementListComponent from '../components/AchievementListComponent';
import AchievementGridComponent from '../components/AchievementGridComponent';
import AchievementFilterWidget from '../components/AchievementFilterWidget';

const AchievementListScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
        <AchievementListComponent onError={handleError} />
      ) : (
        <AchievementGridComponent onError={handleError} />
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

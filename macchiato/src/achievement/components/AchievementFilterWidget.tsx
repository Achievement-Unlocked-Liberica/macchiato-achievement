/**
 * Achievement Filter Widget
 * 
 * Displays a single toggle button for switching between list and grid view modes
 * Shows the opposite view mode icon (grid when in list mode, list when in grid mode)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faBorderAll } from '@fortawesome/free-solid-svg-icons';
import { buttonStyles } from '../../common/styles/buttonStyles';

interface AchievementFilterWidgetProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

const AchievementFilterWidget: React.FC<AchievementFilterWidgetProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  console.log('🎚️ AchievementFilterWidget: Rendering with viewMode:', viewMode);
  
  // Determine the opposite view mode and icon to show
  const targetMode = viewMode === 'list' ? 'grid' : 'list';
  const targetIcon = viewMode === 'list' ? faBorderAll : faBars;
  
  const handleToggle = () => {
    onViewModeChange(targetMode);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={buttonStyles.buttonSmPrimary}
        onPress={handleToggle}
      >
        <FontAwesomeIcon 
          icon={targetIcon} 
          size={12} 
          color="#171717" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'rgba(30, 37, 44, 0.5)', // 50% translucent
    // borderRadius: 8,
    padding: 4,
    marginTop: 8,    // Keep the top margin
    minHeight: 48,   // Keep the minimum height
  },
});

export default AchievementFilterWidget;

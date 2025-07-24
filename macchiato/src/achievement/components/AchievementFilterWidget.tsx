/**
 * Achievement Filter Widget
 * 
 * Displays toggle buttons for switching between list and grid view modes
 * Contains list (fa-bars) and grid (fa-border-all) buttons side by side
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faBorderAll } from '@fortawesome/free-solid-svg-icons';

interface AchievementFilterWidgetProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

const AchievementFilterWidget: React.FC<AchievementFilterWidgetProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  console.log('🎚️ AchievementFilterWidget: Rendering with viewMode:', viewMode);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          viewMode === 'list' && styles.activeButton
        ]}
        onPress={() => onViewModeChange('list')}
      >
        <FontAwesomeIcon 
          icon={faBars} 
          size={16} 
          color={viewMode === 'list' ? '#FCFCFC' : '#9FB3C8'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          viewMode === 'grid' && styles.activeButton
        ]}
        onPress={() => onViewModeChange('grid')}
      >
        <FontAwesomeIcon 
          icon={faBorderAll} 
          size={16} 
          color={viewMode === 'grid' ? '#FCFCFC' : '#9FB3C8'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#1E252C',
    borderRadius: 8,
    padding: 4,
    //marginBottom: 4,
    marginTop: 8,    // Keep the top margin
    minHeight: 44,   // Keep the minimum height
  },
  button: {
    width: 36,
    height: 36,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  activeButton: {
    backgroundColor: '#2A3441',
  },
});

export default AchievementFilterWidget;

/**
 * LayoutWrapper Component
 * 
 * Universal layout wrapper that provides consistent header/footer across all screens.
 * Uses LayoutContext for centralized state management.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeaderComponent from '../../main/components/MainHeaderComponent';
import MainFooterComponent from '../../main/components/MainFooterComponent';
import { useLayout } from '../context/LayoutContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { layoutState } = useLayout();

  return (
    <SafeAreaView style={styles.container}>
      {layoutState.header.visible && (
        <MainHeaderComponent 
          showLogo={layoutState.header.showLogo}
          showProfile={layoutState.header.showProfile}
          customTitle={layoutState.header.customTitle}
        />
      )}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {layoutState.footer.visible && (
        <MainFooterComponent 
          showActions={layoutState.footer.showActions}
          actions={layoutState.footer.actions}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

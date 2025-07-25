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
import { useLayout } from '../context/LayoutContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, footer }) => {
  const { layoutState } = useLayout();

  return (
    <SafeAreaView style={styles.container}>
      {layoutState.header.visible && (
        <MainHeaderComponent 
          showLogo={layoutState.header.showLogo}
          showProfile={layoutState.header.showProfile}
        />
      )}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C', // primary main background color
  },
  content: {
    flex: 1,
    backgroundColor: '#1E252C', // primary main background color
  },
  footer: {
    // Footer styles will be handled by individual footer components
  },
});

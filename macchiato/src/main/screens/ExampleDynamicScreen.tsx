/**
 * Example Screen with Dynamic Layout
 * 
 * Demonstrates how to use the LayoutWrapper and dynamically change
 * header/footer content based on screen-specific needs.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import { 
  AddAction, 
  SaveAction, 
  ShareAction, 
  BookmarkAction 
} from '../components/FooterActions';

export default function ExampleDynamicScreen() {
  const { updateLayout } = useLayout();

  useEffect(() => {
    // Configure layout for this specific screen
    updateLayout({
      header: {
        visible: true,
        showLogo: true,
        showProfile: true,
      },
    });
  }, [updateLayout]);

  return (
    <LayoutWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Dynamic Layout Example</Text>
          <Text style={styles.description}>
            This screen demonstrates how to dynamically configure the header and footer 
            based on screen context. Notice the custom title in the header and the 
            action buttons in the footer.
          </Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features Demonstrated:</Text>
            <Text style={styles.bulletPoint}>• Custom header title</Text>
            <Text style={styles.bulletPoint}>• Dynamic footer actions</Text>
            <Text style={styles.bulletPoint}>• Context-based layout management</Text>
            <Text style={styles.bulletPoint}>• Screen-specific configurations</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Layout State Management:</Text>
            <Text style={styles.bulletPoint}>• Central layout context</Text>
            <Text style={styles.bulletPoint}>• Automatic cleanup on unmount</Text>
            <Text style={styles.bulletPoint}>• Reusable action components</Text>
            <Text style={styles.bulletPoint}>• Theme-consistent styling</Text>
          </View>
        </View>
      </ScrollView>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    paddingLeft: 16,
  },
});

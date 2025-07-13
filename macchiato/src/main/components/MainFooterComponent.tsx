import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MainFooterComponentProps {
  showActions?: boolean;
  actions?: React.ReactNode;
}

export default function MainFooterComponent({ 
  showActions = false, 
  actions 
}: MainFooterComponentProps) {
  return (
    <View style={styles.container}>
      {showActions && actions ? (
        <View style={styles.actionsContainer}>
          {actions}
        </View>
      ) : (
        <View style={styles.defaultContent}>
          <Text style={styles.authLabel}>
            auth tokens cleared on exit
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E252C', // primary-950 main background color
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  defaultContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FCFCFC', // light text for dark background
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  authLabel: {
    color: '#9CA3AF', // gray-400 for subtle appearance
    fontSize: 10,
    fontStyle: 'italic',
  },
});

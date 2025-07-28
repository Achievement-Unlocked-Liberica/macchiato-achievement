/**
 * AchievementDetailsComponent
 * 
 * Container component for displaying achievement details.
 * Contains the AchievementDetailsWidget and other related widgets.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AchievementItem } from '../services/responses/GetAchievementItemsResponse';
import { AchievementDetail } from '../services/responses/GetAchievementDetailResponse';
import { AchievementDetailsWidget } from './AchievementDetailsWidget';
import { useAchievement } from '../hooks/useAchievement';
import { buttonStyles } from '../../common/styles/buttonStyles';

interface AchievementDetailsComponentProps {
  achievement: AchievementItem;
  onBack?: () => void;
}

export const AchievementDetailsComponent: React.FC<AchievementDetailsComponentProps> = ({ 
  achievement,
  onBack
}) => {
  const [detailedAchievement, setDetailedAchievement] = useState<AchievementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAchievementDetail } = useAchievement();
  const hasFetchedRef = useRef(false);
  const currentEntityKeyRef = useRef<string | null>(null);
  const isRequestInProgressRef = useRef(false);

  useEffect(() => {
    // Prevent repeated calls for the same achievement
    if (hasFetchedRef.current && currentEntityKeyRef.current === achievement.entityKey) {
      return;
    }

    // Prevent concurrent requests
    if (isRequestInProgressRef.current) {
      return;
    }

    // Reset state when entityKey changes
    if (currentEntityKeyRef.current !== achievement.entityKey) {
      setDetailedAchievement(null);
      setLoading(true);
      setError(null);
      hasFetchedRef.current = false;
    }

    const fetchAchievementDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        isRequestInProgressRef.current = true;
        hasFetchedRef.current = true;
        currentEntityKeyRef.current = achievement.entityKey;
        
        console.log('🔄 Fetching achievement detail for:', achievement.entityKey);
        
        const result = await getAchievementDetail(achievement.entityKey);
        
        if (result && result.success) {
          console.log('✅ Achievement detail loaded:', result.data);
          setDetailedAchievement(result.data);
        } else {
          console.error('❌ Failed to load achievement detail');
          setError('Failed to load achievement details');
        }
      } catch (err) {
        console.error('💥 Error fetching achievement detail:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
        isRequestInProgressRef.current = false;
      }
    };

    fetchAchievementDetail();
  }, [achievement.entityKey]); // Only depend on entityKey, not the function

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRequestInProgressRef.current = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Back button */}
      {onBack && (
        <View style={styles.topButtonContainer}>
        <TouchableOpacity style={buttonStyles.buttonSmPrimary} onPress={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} size={12} color="#171717" />
        </TouchableOpacity>
        </View>
      )}
      
      {/* Loading state */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F8C825" />
          <Text style={styles.loadingText}>Loading achievement details...</Text>
        </View>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubtext}>Showing basic information instead</Text>
          <AchievementDetailsWidget achievement={achievement} />
        </View>
      )}
      
      {/* Success state with detailed data */}
      {detailedAchievement && !loading && !error && (
        <AchievementDetailsWidget achievement={detailedAchievement} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C',
  },

  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    //alignItems: 'center',
    //backgroundColor: 'rgba(30, 37, 44, 0.5)', // 50% translucent
    //borderRadius: 8,
    padding: 4,
    marginTop: 8,    // Keep the top margin
    minHeight: 48,   // Keep the minimum height
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#9FB3C8',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#9FB3C8',
    fontSize: 14,
    marginBottom: 20,
  },
});

export default AchievementDetailsComponent;

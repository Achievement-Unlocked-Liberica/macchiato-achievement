import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, ActivityIndicator } from 'react-native';
import { useAuthContext, useLayout } from '../../common/context';
import AchievementListScreen from '../../achievement/screens/AchievementListScreen';

export default function MainContentComponent() {
  const { isAuthenticated, loading, userProfile, profileLoading } = useAuthContext();
  const { updateLayout } = useLayout();

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      // Configure header for achievement list view - no title, just logo
      updateLayout({
        header: {
          visible: true,
          showLogo: true,
          showProfile: true,
        },
      });
    } else {
      // Configure header for unauthenticated view
      updateLayout({
        header: {
          visible: true,
          showLogo: true,
          showProfile: true, // Keep profile widget to show sign-in button
        },
      });
    }
  }, [isAuthenticated, userProfile, updateLayout]);

  // Show loading state during initial authentication check
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fac31e" />
          <Text style={styles.loadingText}>Checking authentication...</Text>
        </View>
      </View>
    );
  }

  // Show profile loading state if authenticated but still loading profile
  if (isAuthenticated && profileLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fac31e" />
          <Text style={styles.loadingText}>Loading user profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated && userProfile ? (
        // Show Achievement List Screen when user is authenticated and profile is loaded
        <AchievementListScreen />
      ) : (
        // Show background image when user is not authenticated or profile not loaded
        <ImageBackground
          source={require('../../resources/icons/au icon sm.jpg')}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
          resizeMode="center"
        >
          <View style={styles.overlay}>
            {/* Content area - ready for any app content */}
          </View>
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E252C', // primary-950 Main background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E252C',
  },
  loadingText: {
    color: '#FCFCFC',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.5, // 50% translucency
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useAuthContext, useLayout } from '../../common/context';
import AchievementListScreen from '../../achievement/screens/AchievementListScreen';

export default function MainContentComponent() {
  const { isAuthenticated } = useAuthContext();
  const { updateLayout } = useLayout();

  useEffect(() => {
    if (isAuthenticated) {
      // Configure header for achievement list view - no title, just logo
      updateLayout({
        header: {
          visible: true,
          showLogo: true,
          showProfile: true,
          customTitle: undefined,
        },
      });
    } else {
      // Configure header for unauthenticated view
      updateLayout({
        header: {
          visible: true,
          showLogo: true,
          showProfile: false,
          customTitle: undefined,
        },
      });
    }
  }, [isAuthenticated, updateLayout]);

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        // Show Achievement List Screen when user is authenticated
        <AchievementListScreen />
      ) : (
        // Show background image when user is not authenticated
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

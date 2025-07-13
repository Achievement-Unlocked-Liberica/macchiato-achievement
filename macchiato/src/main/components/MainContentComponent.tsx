import { View, StyleSheet, ImageBackground } from 'react-native';

export default function MainContentComponent() {
  return (
    <View style={styles.container}>
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

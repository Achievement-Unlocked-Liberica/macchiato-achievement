import { View, Text, StyleSheet } from 'react-native';

export default function MainFooterComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Main Footer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F1620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

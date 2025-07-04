import { View, Text, StyleSheet } from 'react-native';

export default function MainContentComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Main Content
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E252C', // background.primary
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FCFCFC', // text.primary
  },
});

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
    backgroundColor: '#2F353C', // background.secondary
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FCFCFC', // text.primary
    fontSize: 16,
    fontWeight: '600',
  },
});

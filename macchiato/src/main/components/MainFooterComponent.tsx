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
    backgroundColor: '#1E252C', // primary-950 main background color
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  title: {
    color: '#FCFCFC', // light text for dark background
    fontSize: 16,
    fontWeight: '600',
  },
});

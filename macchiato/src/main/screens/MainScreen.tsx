import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeaderComponent from '../components/MainHeaderComponent';
import MainContentComponent from '../components/MainContentComponent';
import MainFooterComponent from '../components/MainFooterComponent';

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MainHeaderComponent />
      <MainContentComponent />
      <MainFooterComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

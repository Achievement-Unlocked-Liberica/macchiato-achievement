import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/main/screens/MainScreen';
import RegistrationScreen from './src/user/screens/RegistrationScreen';
import SignInScreen from './src/user/screens/SignInScreen';
import AchievementScreen from './src/achievement/screens/AchievementScreen';
import AchievementDetailsScreen from './src/achievement/screens/AchievementDetailsScreen';
import { AuthProvider, LayoutProvider } from './src/common/context';
import { AchievementItem } from './src/achievement/services/responses/GetAchievementItemsResponse';
import './global.css';

export type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
  Achievement: undefined;
  AchievementDetails: { achievement: AchievementItem };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Achievement" component={AchievementScreen} />
            <Stack.Screen name="AchievementDetails" component={AchievementDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LayoutProvider>
    </AuthProvider>
  );
}

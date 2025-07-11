import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/main/screens/MainScreen';
import RegistrationScreen from './src/user/screens/RegistrationScreen';
import SignInScreen from './src/user/screens/SignInScreen';
import { AuthProvider } from './src/common/context';
import './global.css';

export type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

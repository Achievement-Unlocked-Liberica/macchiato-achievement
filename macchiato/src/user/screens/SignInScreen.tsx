import React, { useRef } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SignInForm, { SignInFormRef } from '../components/SignInForm';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
  SignIn: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface FormData {
  username: string;
  password: string;
}

export default function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const formRef = useRef<SignInFormRef>(null);

  const handleFormSubmit = (formData: FormData) => {
    console.log('Sign in form submitted:', formData);
    
    // TODO: Implement actual sign in API call here
    // For now, we'll show a success message and navigate back
    Alert.alert(
      'Sign In Successful',
      `Welcome back, ${formData.username}!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header Section */}
      <View className="bg-background-secondary py-4 px-6 items-center">
        <Text className="text-text-primary text-xl font-semibold">Sign In</Text>
      </View>

      {/* Content Section */}
      <ScrollView className="flex-1 bg-background-tertiary" showsVerticalScrollIndicator={false}>
        <SignInForm ref={formRef} onSubmit={handleFormSubmit} />
      </ScrollView>

      {/* Footer Section */}
      <View className="bg-background-secondary py-3 px-6 border-t border-border-secondary">
        <Text className="text-text-secondary text-center text-sm">
          Sign in to access your account
        </Text>
      </View>
    </SafeAreaView>
  );
}

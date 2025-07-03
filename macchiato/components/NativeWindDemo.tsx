import React from 'react';
import { Text, View } from 'react-native';

export default function NativeWindDemo() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-50 p-4">
      <View className="bg-white rounded-lg shadow-lg p-6 m-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🎉 NativeWind is Working!
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          This component is styled with TailwindCSS classes
        </Text>
        <View className="flex-row justify-center space-x-2">
          <View className="bg-blue-500 px-4 py-2 rounded-md">
            <Text className="text-white font-semibold">Blue Button</Text>
          </View>
          <View className="bg-green-500 px-4 py-2 rounded-md">
            <Text className="text-white font-semibold">Green Button</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

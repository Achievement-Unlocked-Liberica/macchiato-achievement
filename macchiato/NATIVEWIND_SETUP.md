# NativeWind Installation Guide

This project now has NativeWind (TailwindCSS for React Native) installed and configured.

## What's been installed:

- **nativewind** (v4.1.23) - The latest version of NativeWind
- **tailwindcss** (v3.4.17) - TailwindCSS for web compatibility

## Configuration files added/modified:

1. **tailwind.config.js** - TailwindCSS configuration with NativeWind preset
2. **babel.config.js** - Babel configuration with NativeWind plugin
3. **metro.config.js** - Metro bundler configuration for CSS processing
4. **global.css** - TailwindCSS directives
5. **nativewind-env.d.ts** - TypeScript definitions for NativeWind
6. **tsconfig.json** - Updated to include NativeWind types

## Usage:

You can now use TailwindCSS classes in your React Native components:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-white text-xl font-bold">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

## Updated Components:

- **ThemedView** - Now supports `className` prop
- **ThemedText** - Now supports `className` prop
- **NativeWindDemo** - Added demo component showing NativeWind in action

## Getting Started:

1. Start your development server: `npm start`
2. Open your app on a simulator/device
3. Check the home tab to see the NativeWind demo in action
4. Start using TailwindCSS classes in your components!

## Notes:

- You can mix TailwindCSS classes with traditional StyleSheet styles
- The ThemedView and ThemedText components now support both approaches
- All TailwindCSS utility classes are available for use

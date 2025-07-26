# Macchiato Achievement - Project Setup Guide

This document provides comprehensive steps to recreate the Macchiato Achievement project from scratch, including all dependencies, configurations, and project structure.

## Table of Contents
1. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
2. [React Native Project Initialization](#react-native-project-initialization)
3. [Package Installation](#package-installation)
4. [Configuration Setup](#configuration-setup)
5. [Project Structure Creation](#project-structure-creation)
6. [Module Development](#module-development)
7. [Module Descriptions](#module-descriptions)

---

## Prerequisites & Environment Setup

### Development Environment
```bash
# Install Node.js (LTS version recommended)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g @expo/cli

# Install React Native CLI (if needed for debugging)
npm install -g react-native-cli

# For iOS development (macOS only)
# Install Xcode from App Store
# Install CocoaPods: sudo gem install cocoapods

# For Android development
# Install Android Studio: https://developer.android.com/studio
# Setup Android SDK and emulator
```

### Useful References
- **React Native Documentation**: https://reactnative.dev/docs/getting-started
- **Expo Documentation**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/docs/getting-started
- **FontAwesome Icons**: https://fontawesome.com/docs/web/use-with/react-native
- **NativeWind (Tailwind)**: https://www.nativewind.dev/

---

## React Native Project Initialization

### 1. Create Expo Project
```bash
# Create new Expo project with TypeScript template
npx create-expo-app macchiato --template blank-typescript

# Navigate to project directory
cd macchiato

# Initialize git repository
git init
git add .
git commit -m "Initial commit: Expo TypeScript project"
```

### 2. Project Structure Preparation
```bash
# Create main source directory
mkdir src

# Create main app directories
mkdir -p src/{achievement,award,challenge,character,common,journey,main,quest,skills,social,user,resources}

# Create subdirectories for each module
mkdir -p src/achievement/{components,models,screens,services,constants}
mkdir -p src/award/{components,models,screens,services,constants}
mkdir -p src/challenge/{components,models,screens,services,constants}
mkdir -p src/character/{components,models,screens,services,constants}
mkdir -p src/common/{components,constants,context,models,services,styles,utils}
mkdir -p src/journey/{components,models,screens,services,constants}
mkdir -p src/main/{components,screens,types}
mkdir -p src/quest/{components,models,screens,services,constants}
mkdir -p src/skills/{components,models,constants}
mkdir -p src/social/{components,models,constants}
mkdir -p src/user/{components,models,screens,services,constants}
mkdir -p src/resources/{icons,images}
```

---

## Package Installation

Install packages in the following order to ensure proper dependency resolution:

### 1. Core React Native & Navigation Dependencies
```bash
# React Navigation core
npm install @react-navigation/native @react-navigation/stack

# React Navigation dependencies for Expo
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

### 2. UI & Styling Dependencies
```bash
# FontAwesome Icons
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-native-fontawesome

# NativeWind (Tailwind CSS for React Native)
npm install nativewind tailwindcss

# React Native SVG (required for FontAwesome)
npx expo install react-native-svg
```

### 3. Expo Specific Packages
```bash
# Camera and Image handling
npx expo install expo-camera expo-image-picker expo-image-manipulator

# Secure storage
npx expo install expo-secure-store

# Date/Time picker
npm install @react-native-community/datetimepicker
```

### 4. Development Dependencies
```bash
# TypeScript types
npm install --save-dev @types/react @types/react-native

# Development tools
npm install --save-dev typescript
```

---

## Configuration Setup

Apply configurations in this specific order:

### 1. TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "nativewind-env.d.ts"
  ]
}
```

### 2. Tailwind CSS Configuration
Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F8FA',
          950: '#1E252C', // Main background
        },
        accent: {
          500: '#F8C825', // Main accent
        },
        // Add full color palette as needed
      },
    },
  },
  plugins: [],
}
```

### 3. NativeWind Configuration
Create `nativewind-env.d.ts`:
```typescript
/// <reference types="nativewind/types" />
```

### 4. Expo App Configuration
Update `app.json`:
```json
{
  "expo": {
    "name": "macchiato",
    "slug": "macchiato",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "macchiato",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.macchiato.app",
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs access to camera to take pictures for your achievements.",
        "NSPhotoLibraryUsageDescription": "This app needs access to photo library to select pictures for your achievements."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### 5. Package.json Scripts
Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clear": "expo start -c"
  }
}
```

---

## Project Structure Creation

Use these prompts to create the initial project structure:

### Prompt 1: Core Architecture Setup
```
Create a React Native Expo TypeScript project structure with the following requirements:
- Modular architecture with separate modules for different features
- Common shared components and utilities
- Centralized styling system using NativeWind/Tailwind
- Type-safe navigation system
- Authentication context and secure storage
- API service layer with proper error handling
```

### Prompt 2: Navigation System
```
Implement a React Native navigation system using @react-navigation/stack with:
- Stack navigation for main flow
- Type-safe navigation with TypeScript
- Authentication-based route protection
- Screen transitions and animations
- Back button handling
- Deep linking support
```

### Prompt 3: Styling System
```
Create a comprehensive styling system with:
- NativeWind/Tailwind CSS integration
- Custom color palette for dark theme
- Standardized button styles (XS, SM, MD, LG, XL sizes)
- Typography system
- Layout constants for consistent spacing
- Shadow and elevation utilities
```

---

## Module Development

Build modules in this order to manage dependencies:

### Phase 1: Foundation Modules
1. **Common Module** - Shared utilities, contexts, styles
2. **Main Module** - Navigation, layout, core screens

### Phase 2: Authentication & User Management
3. **User Module** - Authentication, profile management

### Phase 3: Core Feature Modules
4. **Achievement Module** - Main feature for creating/managing achievements
5. **Skills Module** - Skill selection and display
6. **Social Module** - Social features and sharing

### Phase 4: Extended Feature Modules
7. **Award Module** - Achievement rewards and recognition
8. **Journey Module** - Progress tracking
9. **Quest Module** - Guided achievement paths
10. **Challenge Module** - Community challenges
11. **Character Module** - User personalization

---

## Module Descriptions

### Common Module (`src/common/`)
**Purpose**: Shared utilities, components, and configurations used across all modules.

**Key Components**:
- Authentication context and secure storage
- API service layer with error handling
- Reusable UI components (buttons, inputs, modals)
- Centralized styling system and constants
- Utility functions and helpers
- Type definitions for shared models

**Dependencies**: None (foundation module)

### Main Module (`src/main/`)
**Purpose**: Core navigation, layout, and main application screens.

**Key Components**:
- App navigation structure
- Main header and footer components
- Layout components and containers
- Navigation types and utilities
- Root screens and splash screens

**Dependencies**: Common

### User Module (`src/user/`)
**Purpose**: User authentication, profile management, and user-related functionality.

**Key Components**:
- Sign-in and registration forms
- User profile components and screens
- Authentication services and API calls
- User context and state management
- Profile picture and settings management

**Dependencies**: Common, Main

### Achievement Module (`src/achievement/`)
**Purpose**: Core achievement creation, management, and display functionality.

**Key Components**:
- Achievement creation forms and screens
- Achievement list and grid views
- Achievement detail views and editing
- Media upload (camera/gallery) widgets
- Achievement filtering and sorting
- Achievement API services

**Dependencies**: Common, Main, User, Skills, Social

### Skills Module (`src/skills/`)
**Purpose**: Skill selection, display, and management components.

**Key Components**:
- Multi-select skill picker components
- Skill display widgets (small/large formats)
- Skill categories and constants
- Skill-related utilities and services

**Dependencies**: Common

### Social Module (`src/social/`)
**Purpose**: Social features, sharing, and community interaction.

**Key Components**:
- Social sharing components
- Community interaction widgets
- Social display components
- Social media integration services

**Dependencies**: Common

### Award Module (`src/award/`)
**Purpose**: Achievement rewards, badges, and recognition system.

**Key Components**:
- Award display components
- Badge and trophy widgets
- Achievement recognition screens
- Award ceremony and celebration UI
- Award tracking and progress

**Dependencies**: Common, Main, Achievement

### Journey Module (`src/journey/`)
**Purpose**: Progress tracking, milestone management, and user journey visualization.

**Key Components**:
- Progress tracking components
- Journey visualization widgets
- Milestone celebration screens
- Progress analytics and insights
- Goal setting and tracking

**Dependencies**: Common, Main, Achievement, User

### Quest Module (`src/quest/`)
**Purpose**: Guided achievement paths, tutorials, and structured challenges.

**Key Components**:
- Quest creation and management
- Step-by-step guidance components
- Quest progress tracking
- Quest recommendation engine
- Tutorial and onboarding flows

**Dependencies**: Common, Main, Achievement, Journey

### Challenge Module (`src/challenge/`)
**Purpose**: Community challenges, competitions, and group achievements.

**Key Components**:
- Challenge creation and participation
- Leaderboard and ranking systems
- Team formation and management
- Challenge progress tracking
- Community interaction features

**Dependencies**: Common, Main, Achievement, Social, User

### Character Module (`src/character/`)
**Purpose**: User personalization, avatars, and character customization.

**Key Components**:
- Avatar creation and customization
- Character progression systems
- Personalization preferences
- Character display components
- Achievement-based unlockables

**Dependencies**: Common, Main, User, Achievement

---

## Development Workflow

### Initial Setup Commands
```bash
# 1. Create project
npx create-expo-app macchiato --template blank-typescript
cd macchiato

# 2. Install all dependencies
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-native-fontawesome
npm install nativewind tailwindcss
npx expo install react-native-svg expo-camera expo-image-picker expo-image-manipulator expo-secure-store
npm install @react-native-community/datetimepicker
npm install --save-dev @types/react @types/react-native typescript

# 3. Create project structure
mkdir -p src/{achievement,award,challenge,character,common,journey,main,quest,skills,social,user,resources}/{components,models,screens,services,constants}

# 4. Setup configurations (create config files as shown above)

# 5. Start development
npm start
```

### Testing Commands
```bash
# Start with cache clear
npm run clear

# Test on specific platforms
npm run android
npm run ios
npm run web
```

---

## Notes

- **Build Order**: Follow the module dependency order strictly to avoid circular dependencies
- **Type Safety**: Implement TypeScript interfaces for all data models before building components
- **API Integration**: Set up API service layer early to support all feature modules
- **Testing Strategy**: Implement unit tests for utilities and integration tests for critical user flows
- **Performance**: Use React.memo and useMemo for expensive operations, especially in list components
- **Security**: Store sensitive data (tokens, keys) in Expo SecureStore only

This guide ensures a systematic approach to rebuilding the Macchiato Achievement project with proper architecture, dependencies, and development workflow.

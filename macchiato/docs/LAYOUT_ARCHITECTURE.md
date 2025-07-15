# Layout Architecture Documentation

## Overview

This document describes the universal layout system implemented for the Achievement Unlocked mobile application. The system provides consistent header/footer components across all screens while allowing dynamic content based on app state and screen context.

## Architecture Components

### 1. LayoutWrapper (`src/common/components/LayoutWrapper.tsx`)

The central component that wraps all screens and manages header/footer visibility and content.

**Features:**
- Automatic layout configuration based on current route
- Integration with LayoutContext for centralized state management
- Safe area handling for iOS/Android compatibility
- Flexible content area that adapts to header/footer presence

**Usage:**
```tsx
import { LayoutWrapper } from '../../common/components/LayoutWrapper';

export default function MyScreen() {
  return (
    <LayoutWrapper>
      <YourContent />
    </LayoutWrapper>
  );
}
```

### 2. LayoutContext (`src/common/context/LayoutContext.tsx`)

Centralized state management for layout configuration across the application.

**Features:**
- Global layout state management
- Dynamic header/footer configuration
- Screen-specific layout updates
- Automatic cleanup and reset capabilities

**Usage:**
```tsx
import { useLayout } from '../../common/context';

const { layoutState, updateLayout, resetLayout } = useLayout();

// Update layout for specific screen needs
useEffect(() => {
  updateLayout({
    header: {
      visible: true,
      customTitle: 'Custom Screen Title',
      showProfile: false,
    },
    footer: {
      visible: true,
      showActions: true,
      actions: <MyCustomActions />,
    },
  });
}, []);
```

### 3. Enhanced Header Component (`src/main/components/MainHeaderComponent.tsx`)

**Props:**
- `showProfile?: boolean` - Controls UserProfileWidget visibility
- `showLogo?: boolean` - Controls logo visibility
- `customTitle?: string` - Override default title

**Features:**
- Consistent theming with dark background (`#1E252C`)
- Responsive layout with logo, title, and profile widget
- Authentication-aware profile widget integration

### 4. Enhanced Footer Component (`src/main/components/MainFooterComponent.tsx`)

**Props:**
- `showActions?: boolean` - Controls action buttons visibility
- `actions?: React.ReactNode` - Custom action components

**Features:**
- Consistent theming matching header
- Flexible action container for dynamic content
- Extensible design for various action types

### 5. Dynamic Footer Actions (`src/main/components/FooterActions.tsx`)

Pre-built action components for common use cases:

**Available Actions:**
- `AddAction` - Primary add button
- `SaveAction` - Success-styled save button  
- `ShareAction` - Secondary share button
- `BookmarkAction` - Secondary bookmark button
- `LikeAction` - Secondary like button
- `CommentAction` - Secondary comment button

**Usage:**
```tsx
import { AddAction, ShareAction } from '../components/FooterActions';

const actions = (
  <>
    <AddAction onPress={() => handleAdd()} />
    <ShareAction onPress={() => handleShare()} />
  </>
);

updateLayout({
  footer: { showActions: true, actions }
});
```

## Implementation Guide

### Step 1: Provider Setup

Wrap your app with both AuthProvider and LayoutProvider:

```tsx
// App.tsx
export default function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <NavigationContainer>
          {/* Your navigation setup */}
        </NavigationContainer>
      </LayoutProvider>
    </AuthProvider>
  );
}
```

### Step 2: Screen Implementation

Replace individual header/footer components with LayoutWrapper:

```tsx
// Before
export default function MyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MainHeaderComponent />
      <MyContent />
      <MainFooterComponent />
    </SafeAreaView>
  );
}

// After
export default function MyScreen() {
  return (
    <LayoutWrapper>
      <MyContent />
    </LayoutWrapper>
  );
}
```

### Step 3: Dynamic Layout Configuration

Use the layout context to customize layout for specific screens:

```tsx
export default function CustomScreen() {
  const { updateLayout } = useLayout();

  useEffect(() => {
    // Configure layout for this screen
    updateLayout({
      header: {
        customTitle: 'My Custom Screen',
        showProfile: false,
      },
      footer: {
        showActions: true,
        actions: <MyActions />,
      },
    });

    // Cleanup on unmount
    return () => {
      updateLayout({
        footer: { showActions: false, actions: undefined }
      });
    };
  }, [updateLayout]);

  return (
    <LayoutWrapper>
      <MyContent />
    </LayoutWrapper>
  );
}
```

## Screen-Specific Configurations

### Main Screen
- Header: Logo + Title + Profile Widget
- Footer: Basic footer (no actions)

### Sign In / Registration Screens
- Header: Hidden
- Footer: Hidden

### Content Screens (Future)
- Header: Logo + Custom Title + Profile Widget
- Footer: Context-specific actions (Add, Share, Bookmark, etc.)

## Best Practices

### 1. Layout State Management
- Use `updateLayout()` in `useEffect` to configure screen-specific layouts
- Always provide cleanup function to reset layout when leaving screen
- Avoid direct state mutations; use the provided context methods

### 2. Action Components
- Use pre-built action components for consistency
- Group related actions together
- Limit footer actions to 2-4 items for optimal UX

### 3. Theme Consistency
- Header and footer use primary background color (`#1E252C`)
- Action buttons follow established color palette
- Light text on dark backgrounds for proper contrast

### 4. Performance Optimization
- Layout components use `React.memo` to prevent unnecessary re-renders
- Context updates are optimized to only trigger when state actually changes
- Action components are lightweight and reusable

## Future Extensibility

### Planned Enhancements
1. **Animation Support**: Smooth transitions when header/footer content changes
2. **Badge System**: Notification badges on action buttons
3. **Contextual Menus**: Long-press actions and dropdown menus
4. **Theme Integration**: Full dark/light mode support
5. **Accessibility**: Enhanced screen reader and keyboard navigation support

### Integration Points
- **Navigation**: Custom header configurations per route
- **State Management**: Integration with Redux/Zustand for complex state
- **Animations**: React Native Reanimated for smooth transitions
- **Testing**: Jest/Testing Library setup for layout components

## Dependencies

**Required:**
- `@react-navigation/native` - Navigation integration
- `react-native-safe-area-context` - Safe area handling
- `@fortawesome/react-native-fontawesome` - Icons

**Recommended:**
- `react-native-vector-icons` - Additional icon options
- `react-native-paper` - Material Design components
- `@reduxjs/toolkit` - Advanced state management (if needed)

## Troubleshooting

### Common Issues

1. **Layout not updating**: Ensure LayoutProvider wraps your navigation
2. **Actions not showing**: Check that `showActions: true` is set
3. **Header overlapping content**: Verify SafeAreaView usage in LayoutWrapper
4. **Theme inconsistencies**: Use predefined color constants from theme config

### Development Tips

1. Use the example screen (`ExampleDynamicScreen.tsx`) as a reference
2. Test layout changes on both iOS and Android
3. Verify accessibility with screen readers
4. Test with different screen sizes and orientations

## Implementation Status

### ✅ Completed Features

1. **Universal Layout System**
   - `LayoutWrapper` component manages header/footer for all screens
   - Centralized `LayoutContext` for state management
   - Automatic screen-based configuration
   - Safe area handling for iOS/Android compatibility

2. **Enhanced Components**
   - **MainHeaderComponent**: Dynamic props for logo, title, and profile visibility
   - **MainFooterComponent**: Support for dynamic action buttons
   - **UserProfileWidget**: Authentication-aware with sign in/out states

3. **Dynamic Footer Actions**
   - Pre-built action components with consistent theming
   - Easy-to-use action types: Add, Save, Share, Bookmark, Like, Comment
   - Flexible styling system with primary/secondary/success variants

4. **Context-Based State Management**
   - Global layout state with automatic cleanup
   - Screen-specific layout updates
   - TypeScript-safe implementation

### 🎯 Comprehensive Recommendations

#### **Architecture Recommendations**

1. **Single Layout Pattern Implementation**
   - ✅ **Status**: Fully implemented with `LayoutWrapper`
   - **Best Practice**: All screens should use `LayoutWrapper` instead of individual header/footer components
   - **Benefits**: Consistent UX, centralized maintenance, automatic safe area handling

2. **Component Composition Strategy**
   - ✅ **Status**: Implemented with modular header/footer/action components
   - **Best Practice**: Break widgets into small, reusable components
   - **Benefits**: Easy testing, maintainable code, flexible combinations

3. **State Management Pattern**
   - ✅ **Status**: Context-based with `LayoutContext`
   - **Best Practice**: Use context for layout state, avoid prop drilling
   - **Benefits**: Centralized state, automatic updates, easy debugging

#### **React Native Best Practices**

1. **Navigation Integration**
   ```tsx
   // Recommended: Route-based layout configuration
   useEffect(() => {
     const routeConfig = getLayoutConfig(route.name);
     updateLayout(routeConfig);
   }, [route.name]);
   ```

2. **Performance Optimization**
   - ✅ **Implemented**: Components use `React.memo` for optimal re-renders
   - **Recommended**: Add `useMemo` for complex layout calculations
   - **Best Practice**: Lazy load footer actions when needed

3. **Accessibility Support**
   ```tsx
   // Recommended additions for action buttons
   accessibilityRole="button"
   accessibilityLabel="Add new item"
   accessibilityHint="Double tap to add a new achievement"
   ```

#### **Library Integration Recommendations**

##### **Essential Libraries (Already Integrated)**

1. **React Navigation**
   - ✅ **Current**: Basic navigation with custom headers disabled
   - **Enhancement**: Custom header configurations per route
   ```tsx
   // Future enhancement
   <Stack.Screen 
     name="Profile" 
     component={ProfileScreen}
     options={{
       headerShown: false, // We handle headers in LayoutWrapper
     }}
   />
   ```

2. **Safe Area Context**
   - ✅ **Current**: Implemented in `LayoutWrapper`
   - **Best Practice**: Always use with header/footer layouts

##### **Recommended Additional Libraries**

1. **UI Enhancement Libraries**
   ```bash
   # Material Design components
   npm install react-native-paper
   
   # Additional vector icons
   npm install react-native-vector-icons
   
   # Blur effects for headers
   npm install @react-native-community/blur
   ```

2. **Animation Libraries**
   ```bash
   # Smooth layout transitions
   npm install react-native-reanimated
   npm install react-native-animatable
   
   # Gesture handling
   npm install react-native-gesture-handler
   ```

3. **State Management (For Complex Apps)**
   ```bash
   # Redux Toolkit (if needed for complex state)
   npm install @reduxjs/toolkit react-redux
   
   # Lightweight alternative
   npm install zustand
   ```

#### **Advanced Implementation Patterns**

1. **Screen-Specific Layout Hooks**
   ```tsx
   // Custom hook for common layout patterns
   const useScreenLayout = (config: ScreenLayoutConfig) => {
     const { updateLayout } = useLayout();
     
     useEffect(() => {
       updateLayout(config);
       return () => resetLayoutToDefault();
     }, []);
   };
   ```

2. **Dynamic Theme Integration**
   ```tsx
   // Theme-aware layout components
   const useThemedLayout = () => {
     const { theme } = useTheme();
     return {
       headerStyle: { backgroundColor: theme.primary },
       footerStyle: { backgroundColor: theme.primary },
     };
   };
   ```

3. **Navigation-Driven Layout**
   ```tsx
   // Automatic layout configuration based on navigation state
   const useNavigationLayout = () => {
     const navigation = useNavigation();
     
     useEffect(() => {
       const unsubscribe = navigation.addListener('state', (e) => {
         configureLayoutForCurrentRoute(e.data.state);
       });
       return unsubscribe;
     }, [navigation]);
   };
   ```

#### **Extensibility Recommendations**

1. **Footer Action System Extensions**
   ```tsx
   // Contextual action factory
   export const createContextualActions = (context: AppContext) => {
     switch (context.screen) {
       case 'achievements':
         return [<AddAction />, <ShareAction />, <FilterAction />];
       case 'profile':
         return [<EditAction />, <SettingsAction />];
       default:
         return [];
     }
   };
   ```

2. **Header Widget System**
   ```tsx
   // Extensible header widget system
   interface HeaderWidget {
     id: string;
     component: React.ComponentType;
     position: 'left' | 'center' | 'right';
     priority: number;
   }
   ```

3. **Layout Animation System**
   ```tsx
   // Smooth transitions between layout states
   const useLayoutAnimations = () => {
     return {
       fadeIn: () => Animated.timing(/* ... */),
       slideUp: () => Animated.timing(/* ... */),
       scale: () => Animated.timing(/* ... */),
     };
   };
   ```

#### **Testing Strategy Recommendations**

1. **Unit Testing**
   ```tsx
   // Example test structure
   describe('LayoutWrapper', () => {
     it('should show header when configured', () => {
       // Test header visibility
     });
     
     it('should update layout based on context', () => {
       // Test context integration
     });
   });
   ```

2. **Integration Testing**
   ```tsx
   // Test full layout flow
   describe('Layout Integration', () => {
     it('should configure layout correctly for each screen', () => {
       // Test navigation-based layout changes
     });
   });
   ```

#### **Performance Optimization Recommendations**

1. **Memoization Strategy**
   ```tsx
   // Optimize expensive layout calculations
   const layoutConfig = useMemo(() => 
     calculateLayoutForScreen(screen, user, theme), 
     [screen, user.id, theme.mode]
   );
   ```

2. **Lazy Loading**
   ```tsx
   // Lazy load footer actions
   const FooterActions = lazy(() => import('./FooterActions'));
   ```

3. **Bundle Optimization**
   ```tsx
   // Code splitting for layout components
   const DynamicLayout = loadable(() => import('./DynamicLayout'));
   ```

#### **Migration Guide for Existing Screens**

1. **Step-by-Step Migration**
   ```tsx
   // Before: Individual components
   export default function OldScreen() {
     return (
       <SafeAreaView>
         <Header />
         <Content />
         <Footer />
       </SafeAreaView>
     );
   }
   
   // After: LayoutWrapper pattern
   export default function NewScreen() {
     const { updateLayout } = useLayout();
     
     useEffect(() => {
       updateLayout({
         header: { customTitle: 'My Screen' },
         footer: { showActions: true, actions: <MyActions /> }
       });
     }, []);
     
     return (
       <LayoutWrapper>
         <Content />
       </LayoutWrapper>
     );
   }
   ```

2. **Compatibility Layer** (Temporary)
   ```tsx
   // Gradual migration helper
   export const LegacyScreenWrapper = ({ children, legacyMode = false }) => {
     if (legacyMode) {
       return <OldLayoutPattern>{children}</OldLayoutPattern>;
     }
     return <LayoutWrapper>{children}</LayoutWrapper>;
   };
   ```

#### **Future Roadmap Recommendations**

1. **Short Term (1-2 Sprints)**
   - Add layout animations
   - Implement badge system for notifications
   - Enhance accessibility features

2. **Medium Term (3-6 Sprints)**
   - Full theme system integration
   - Advanced gesture support
   - Performance monitoring

3. **Long Term (6+ Sprints)**
   - AI-driven layout optimization
   - A/B testing for layout variations
   - Advanced analytics integration

## Summary

The implemented layout architecture provides a solid foundation for scalable mobile app development with:

- **Universal Layout Pattern**: Consistent UX across all screens
- **Dynamic Content Management**: Context-aware header/footer content
- **Performance Optimized**: Minimal re-renders and efficient state management
- **Extensible Design**: Easy to add new features and customizations
- **Best Practices**: Following React Native and mobile development standards

This system is production-ready and provides excellent extensibility for future features while maintaining consistency and performance.

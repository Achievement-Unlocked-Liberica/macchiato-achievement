# Automatic Authentication Cleanup

## Overview

The application now automatically clears authentication tokens when the app is closed or goes to the background. This ensures user security by preventing unauthorized access if the device is lost or shared.

## Implementation Details

### AppStateService (`src/common/services/appStateService.ts`)

- Monitors React Native's `AppState` changes
- Automatically triggers token cleanup when app becomes `background` or `inactive`
- Integrates with `TokenStorageService` to clear all stored authentication data
- Provides callback mechanism for updating application state

### AuthContext Integration

The `AuthContext` now:
- Initializes `AppStateService` on mount
- Provides automatic cleanup callback to reset authentication state
- Ensures both secure storage and context state are cleared

### Footer Notification

The main footer now displays a subtle notification:
- **Text**: "auth tokens cleared on exit"
- **Style**: Small, italic, gray text
- **Visibility**: Shown when no custom actions are displayed

## User Experience

1. **Automatic Cleanup**: No user action required
2. **Visual Feedback**: Footer label informs users of the security feature
3. **Seamless Re-authentication**: Users can sign in again when they return to the app

## Technical Benefits

- **Security**: Prevents token persistence across app sessions
- **Privacy**: Ensures no sensitive data remains when app is not active
- **Compliance**: Helps meet security requirements for authentication handling

## App States That Trigger Cleanup

- `background`: App is minimized or user switches to another app
- `inactive`: App is transitioning between states (iOS: incoming call, Control Center, etc.)

## Files Modified

- `src/common/context/AuthContext.tsx` - Added AppStateService integration
- `src/main/components/MainFooterComponent.tsx` - Added auth cleanup notification
- `src/common/services/appStateService.ts` - New service for app state monitoring
- `src/common/hooks/useAppState.ts` - Optional hooks for app state management

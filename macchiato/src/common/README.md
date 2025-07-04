# Common Components & Theme

This folder contains reusable UI components and theme definitions that can be used across different features in the application.

## Theme System

### Colors (`theme/colors.ts`)

The app uses a comprehensive color system based on the brand colors:
- **Main Background**: `#1E252C` (primary.950)
- **Secondary UI/Elements**: `#9FB3C8` (primary.500) 
- **Accent (Buttons)**: `#F8C825` (accent.500)

**Usage:**
```tsx
import { Colors, ColorCombinations } from '../../common/theme';

// Direct color usage
backgroundColor: Colors.background.primary

// Predefined combinations
...ColorCombinations.primaryButton
```

### Tailwind Classes

The theme extends Tailwind with custom color classes:
- `bg-background-primary`, `bg-background-secondary`, etc.
- `text-text-primary`, `text-text-secondary`, etc.
- `border-border-primary`, `border-border-secondary`, etc.
- `bg-accent-500`, `bg-primary-600`, etc.

### Component Classes (`global.css`)

Pre-defined component classes for common patterns:
- `.btn-primary` - Primary accent buttons
- `.btn-secondary` - Secondary buttons  
- `.form-input` - Standard form inputs
- `.form-label` - Form field labels
- `.card` - Card containers
- `.error-alert` - Error message styling

## Button Components

### CancelButton

A reusable cancel button component with consistent styling and behavior.

**Props:**
- `onPress: () => void` - Function to call when button is pressed
- `disabled?: boolean` - Whether the button is disabled (default: false)
- `text?: string` - Button text (default: 'Cancel')
- `size?: 'small' | 'medium' | 'large'` - Button size (default: 'medium')

**Features:**
- Primary brand color background with white text
- X mark icon from FontAwesome
- Responsive sizing (small, medium, large)
- Disabled state with opacity reduction

**Usage:**
```tsx
import { CancelButton } from '../../common/components';

<CancelButton 
  onPress={handleCancel} 
  text="Cancel" 
  size="medium" 
/>
```

### SubmitButton

A reusable submit button component with consistent styling and behavior.

**Props:**
- `onPress: () => void` - Function to call when button is pressed
- `disabled?: boolean` - Whether the button is disabled (default: false)
- `text?: string` - Button text (default: 'Submit')
- `size?: 'small' | 'medium' | 'large'` - Button size (default: 'medium')
- `loading?: boolean` - Whether to show loading state (default: false)

**Features:**
- Accent color background with dark text
- Check mark icon from FontAwesome
- Responsive sizing (small, medium, large)
- Loading state with text change
- Disabled state with opacity reduction

**Usage:**
```tsx
import { SubmitButton } from '../../common/components';

<SubmitButton 
  onPress={handleSubmit} 
  text="Submit" 
  size="medium" 
  loading={isLoading}
/>
```

## Benefits

- **Consistency**: Ensures all UI elements follow the same design system
- **Maintainability**: Single source of truth for colors and styling
- **Flexibility**: Configurable props for different use cases
- **Accessibility**: Consistent disabled states and loading indicators
- **DRY Principle**: Avoid code duplication across components
- **Theme Support**: Centralized color management for easy theme changes

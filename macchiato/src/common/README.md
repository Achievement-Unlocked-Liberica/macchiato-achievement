# Common Components

This folder contains reusable UI components that can be used across different features in the application.

## Button Components

### CancelButton

A reusable cancel button component with consistent styling and behavior.

**Props:**
- `onPress: () => void` - Function to call when button is pressed
- `disabled?: boolean` - Whether the button is disabled (default: false)
- `text?: string` - Button text (default: 'Cancel')
- `size?: 'small' | 'medium' | 'large'` - Button size (default: 'medium')

**Features:**
- Gray background with white text
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
- Yellow background with dark text
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

- **Consistency**: Ensures all cancel and submit buttons look and behave the same across the app
- **Maintainability**: Single source of truth for button styling and behavior
- **Flexibility**: Configurable props for different use cases
- **Accessibility**: Consistent disabled states and loading indicators
- **DRY Principle**: Avoid code duplication across components

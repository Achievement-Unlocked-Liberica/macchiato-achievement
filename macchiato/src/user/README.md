# User Registration Feature

This folder contains the user registration functionality for the application.

## Components

### RegistrationForm (`components/RegistrationForm.tsx`)
A reusable form component for user registration with the following features:
- **Fields**: username, email, first name, last name, birthdate
- **Validation**: Form validation with error messages
- **Styling**: Uses NativeWind (TailwindCSS) classes
- **Ref Methods**: `submitForm()` and `resetForm()` for external control

#### Form Fields:
- **Username**: Text input with minimum 3 characters
- **Email**: Email input with email format validation
- **First Name**: Required text input
- **Last Name**: Required text input  
- **Birthdate**: Text input expecting MM/DD/YYYY format

#### Usage:
```tsx
const formRef = useRef<RegistrationFormRef>(null);

const handleSubmit = (formData: FormData) => {
  console.log('Registration data:', formData);
};

<RegistrationForm ref={formRef} onSubmit={handleSubmit} />

// To trigger form submission:
formRef.current?.submitForm();

// To reset the form:
formRef.current?.resetForm();
```

### RegistrationScreen (`screens/RegistrationScreen.tsx`)
A complete screen for user registration with:
- **Header**: Displays "Sign In | Register" title
- **Content**: Contains the RegistrationForm component
- **Footer**: Cancel and Submit buttons
- **Navigation**: Handles navigation back to main screen
- **Styling**: Uses NativeWind classes

#### Features:
- Form validation through the RegistrationForm component
- Confirmation alerts for successful registration
- Cancel confirmation dialog
- Automatic navigation back to main screen after successful registration

## Navigation

The registration screen is accessible from the main header component via the "Sign In | Register" button.

Navigation stack:
- Main Screen → Registration Screen
- Registration Screen → Main Screen (after submission or cancel)

## Styling

All components use NativeWind (TailwindCSS) classes for styling:
- Responsive design
- Error state styling (red borders for invalid fields)
- Consistent color scheme with the main app
- Mobile-first approach

## Future Enhancements

- Replace text input birthdate field with a proper date picker
- Add password fields for complete registration
- Implement actual API integration for user registration
- Add photo upload functionality
- Add social media registration options

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

## ✅ **Enhanced Form Validation - Updated July 3, 2025**

### 🔍 **Comprehensive Field Validation**

The RegistrationForm now includes enhanced validation with detailed error messages:

#### **Username Validation:**
- ✅ Required field (cannot be empty)
- ✅ Minimum length: 5 characters
- ✅ Maximum length: 50 characters
- 🎯 Error messages: "Username is required", "Username must be at least 5 characters", "Username must not exceed 50 characters"

#### **Email Validation:**
- ✅ Required field (cannot be empty)
- ✅ Valid email format (regex validation)
- 🎯 Error messages: "Email is required", "Please enter a valid email address"

#### **First Name Validation:**
- ✅ Required field (cannot be empty)
- ✅ Maximum length: 50 characters
- 🎯 Error messages: "First name is required", "First name must not exceed 50 characters"

#### **Last Name Validation:**
- ✅ Required field (cannot be empty)
- ✅ Maximum length: 50 characters
- 🎯 Error messages: "Last name is required", "Last name must not exceed 50 characters"

#### **Birthdate Validation:**
- ✅ Required field (cannot be empty)
- ✅ Valid MM/DD/YYYY format
- ✅ Valid date (checks for invalid dates like 02/30/2023)
- ✅ Cannot be in the future
- ✅ User must be at least 13 years old
- 🎯 Error messages: "Birthdate is required", "Please enter date in MM/DD/YYYY format", "Please enter a valid date", "Birthdate cannot be in the future", "You must be at least 13 years old to register"

### 🎨 **Enhanced Error Display**

#### **NativeWind Alert Styling:**
- 🔴 Red error color scheme (`bg-red-50`, `border-red-200`, `text-red-600`)
- 📱 Rounded corners and proper padding
- 📏 Responsive layout with flexbox

#### **FontAwesome Integration:**
- 😢 `faFaceFrown` icon from `@fortawesome/free-regular-svg-icons`
- 📍 Icon positioned to the left of error message
- 🎨 Consistent red color matching the alert theme

#### **User Experience Improvements:**
- 📝 Enhanced placeholder text with hints (e.g., "5-50 characters", "max 50 characters", "must be 13+ years old")
- 🔢 `maxLength` attributes on text inputs to prevent excessive input
- ⚡ Real-time error clearing when user starts typing
- 🎯 Clear, actionable error messages

### 🔧 **Technical Implementation:**
- **ErrorAlert Component**: Reusable component for consistent error display
- **Age Calculation**: Accurate age calculation considering month and day differences
- **Date Validation**: Comprehensive date parsing and validation
- **Input Limits**: Hardware-level character limits to improve UX

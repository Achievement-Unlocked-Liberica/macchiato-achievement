# Feature-Driven Folder Structure

This project follows a feature-driven design pattern where each feature folder encapsulates different layers of functionality. This approach promotes modularity, encapsulation, single responsibility, reusability, and extensibility.

## 📁 Folder Structure

```
src/
├── main/                    # Main page and core components
│   ├── components/          # Main feature UI components
│   ├── screens/             # Main feature screens/pages
│   ├── hooks/               # Main feature custom hooks
│   ├── services/            # Main feature API services
│   └── types/               # Main feature TypeScript types
│
├── common/                  # Shared artifacts across features
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Shared custom hooks
│   ├── utils/               # Utility functions
│   ├── types/               # Shared TypeScript types
│   ├── services/            # Shared API services
│   └── constants/           # Application constants
│
├── achievement/             # Achievement management feature
│   ├── components/          # Achievement-specific components
│   ├── screens/             # Achievement screens
│   ├── hooks/               # Achievement custom hooks
│   ├── services/            # Achievement API services
│   ├── types/               # Achievement TypeScript types
│   └── models/              # Achievement data models
│
├── challenge/               # Challenge system feature
│   ├── components/          # Challenge-specific components
│   ├── screens/             # Challenge screens
│   ├── hooks/               # Challenge custom hooks
│   ├── services/            # Challenge API services
│   ├── types/               # Challenge TypeScript types
│   └── models/              # Challenge data models
│
├── user/                    # User management feature
│   ├── components/          # User-specific components
│   ├── screens/             # User screens (profile, settings)
│   ├── hooks/               # User custom hooks
│   ├── services/            # User API services
│   ├── types/               # User TypeScript types
│   └── models/              # User data models
│
├── character/               # Character system feature
│   ├── components/          # Character-specific components
│   ├── screens/             # Character screens
│   ├── hooks/               # Character custom hooks
│   ├── services/            # Character API services
│   ├── types/               # Character TypeScript types
│   └── models/              # Character data models
│
├── journey/                 # User journey feature
│   ├── components/          # Journey-specific components
│   ├── screens/             # Journey screens
│   ├── hooks/               # Journey custom hooks
│   ├── services/            # Journey API services
│   ├── types/               # Journey TypeScript types
│   └── models/              # Journey data models
│
└── award/                   # Award system feature
    ├── components/          # Award-specific components
    ├── screens/             # Award screens
    ├── hooks/               # Award custom hooks
    ├── services/            # Award API services
    ├── types/               # Award TypeScript types
    └── models/              # Award data models
```

## 🎯 Design Principles

### **Modularity**
Each feature is self-contained with its own components, services, and types.

### **Encapsulation**
Feature-specific logic is contained within each feature folder.

### **Single Responsibility**
Each folder and file has a clear, single purpose.

### **Reusability**
Common components and utilities are shared through the `common` folder.

### **Extensibility**
New features can be easily added following the same structure.

## 📚 Folder Descriptions

### **Layer Descriptions:**

- **`components/`** - React Native/React components specific to the feature
- **`screens/`** - Full screen components (pages) for the feature
- **`hooks/`** - Custom React hooks for feature-specific logic
- **`services/`** - API calls and data fetching logic
- **`types/`** - TypeScript interfaces and type definitions
- **`models/`** - Data models and business logic
- **`utils/`** - Helper functions and utilities (common only)
- **`constants/`** - Configuration and constant values (common only)

## 🚀 Usage with NativeWind

All folders under `src/` are included in the TailwindCSS content configuration, so you can use TailwindCSS classes throughout your feature components.

## 📖 Next Steps

1. Start implementing features by adding files to the appropriate folders
2. Import shared components from `src/common/`
3. Keep feature-specific code within each feature folder
4. Use the `main` folder for your primary application screens and navigation

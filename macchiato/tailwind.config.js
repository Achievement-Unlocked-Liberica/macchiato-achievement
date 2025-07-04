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
        // Primary brand colors
        primary: {
          50: '#F7F8FA',
          100: '#EEF1F5',
          200: '#D5DCE6',
          300: '#BBC7D7',
          400: '#889DB9',
          500: '#9FB3C8', // Secondary UI/Elements
          600: '#8FA2B5',
          700: '#5F6B78',
          800: '#47505A',
          900: '#2F353C',
          950: '#1E252C', // Main background
        },
        
        // Accent colors (buttons, highlights)
        accent: {
          50: '#FEFCF0',
          100: '#FEF9E1',
          200: '#FCF1BE',
          300: '#FAE99B',
          400: '#F6D955',
          500: '#F8C825', // Main accent
          600: '#E0B421',
          700: '#957816',
          800: '#705A11',
          900: '#4A3C0B',
          950: '#251E05',
        },

        // Semantic colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Neutral grays that work with the theme
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },

        // Text colors
        text: {
          primary: '#FCFCFC',
          secondary: '#9FB3C8',
          muted: '#737373',
          inverse: '#171717',
        },

        // Background variations
        background: {
          primary: '#1E252C',
          secondary: '#2F353C',
          tertiary: '#47505A',
          surface: '#5F6B78',
          overlay: 'rgba(30, 37, 44, 0.9)',
        },

        // Border colors
        border: {
          primary: '#9FB3C8',
          secondary: '#5F6B78',
          muted: '#47505A',
          accent: '#F8C825',
        },
      },
      
      // Custom spacing that works well with the design
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Custom shadows
      boxShadow: {
        'accent': '0 4px 14px 0 rgba(248, 200, 37, 0.25)',
        'primary': '0 4px 14px 0 rgba(159, 179, 200, 0.15)',
      },
    },
  },
  plugins: [],
}

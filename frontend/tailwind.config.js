// tailwind.config.js
// Medical Application Design System Configuration

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Custom color palette for medical/healthcare
      colors: {
        // Primary colors - Trust & Stability
        primary: {
          50: '#f0f7ff',   // Lightest - backgrounds
          100: '#e0effe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Primary blue - trust & professionalism
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
          950: '#082f49',  // Darkest
        },
        medical: {
          50: '#f0f7ff',   // Lightest - backgrounds
          100: '#e0effe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Primary blue - trust & professionalism
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
          950: '#082f49',  // Darkest
        },

        // Accent colors - Calm & Supportive
        calm: {
          50: '#f0fdf4',   // Success/positive - green
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Accent green - health, wellness
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },

        // Status colors - Healthcare specific
        status: {
          'critical': '#ef4444',   // Red
          'high': '#f97316',       // Orange
          'moderate': '#eab308',   // Yellow
          'low': '#84cc16',        // Lime
          'normal': '#10b981',     // Green
        },
      },

      // Typography system for medical readability
      fontFamily: {
        // Sans serif - Professional & accessible
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        // For headers - Clear hierarchy
        display: [
          'Poppins',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        // Monospace - Medical codes & data
        mono: [
          'Fira Code',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },

      // Custom font sizes
      fontSize: {
        // Display/Hero
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],

        // Headings
        'h1': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h5': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],

        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],  // 18px - Main content
        'body-md': ['1rem', { lineHeight: '1.6' }],       // 16px - Standard
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px - Secondary
        'body-xs': ['0.75rem', { lineHeight: '1.4' }],    // 12px - Metadata

        // Labels & forms
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },

      // Spacing system (8px base)
      spacing: {
        0: '0',
        1: '0.25rem',    // 4px
        2: '0.5rem',     // 8px
        3: '0.75rem',    // 12px
        4: '1rem',       // 16px
        5: '1.25rem',    // 20px
        6: '1.5rem',     // 24px
        8: '2rem',       // 32px
        10: '2.5rem',    // 40px
        12: '3rem',      // 48px
        16: '4rem',      // 64px
        20: '5rem',      // 80px
        24: '6rem',      // 96px
      },

      // Border radius - Friendly but professional
      borderRadius: {
        none: '0',
        xs: '0.25rem',   // 4px - Subtle
        sm: '0.5rem',    // 8px - Cards, inputs
        md: '0.75rem',   // 12px - Standard components
        lg: '1rem',      // 16px - Buttons, large cards
        xl: '1.5rem',    // 24px - Featured components
        full: '9999px',  // Fully rounded
      },

      // Shadows - Subtle depth
      boxShadow: {
        'none': 'none',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        // Healthcare specific - calm shadows
        'calm': '0 2px 8px rgba(6, 61, 107, 0.08)',
        'calm-lg': '0 8px 16px rgba(6, 61, 107, 0.12)',
      },

      // Transitions - Smooth interactions
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      // Animation for medical app
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Breakpoints for mobile responsiveness
      screens: {
        'xs': '320px',   // Mobile - small
        'sm': '640px',   // Mobile - standard
        'md': '768px',   // Tablet
        'lg': '1024px',  // Desktop - small
        'xl': '1280px',  // Desktop - standard
        '2xl': '1536px', // Desktop - large
      },
    },
  },
  plugins: [],
}

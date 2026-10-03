/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // YummyFit Prototype Green Palette
        yummy: {
          50: '#FFFDF5',
          100: '#EAF0DF',
          200: '#cddbd3',
          300: '#a8c4b5',
          400: '#7a9f8e',
          500: '#527d6b',     // Medium green
          600: '#3d7752',     // Accent / progress
          700: '#28513d',     // Form accents
          800: '#143D2B',     // Primary dark - headings, primary buttons
          900: '#102C21',     // Dark text
          950: '#0f2a1d',     // Very dark bg
        },
        brand: {
          50: '#FFFDF5',
          100: '#EAF0DF',
          200: '#cddbd3',
          300: '#a8c4b5',
          400: '#7a9f8e',
          500: '#3d7752',     // Accent green
          600: '#426443',     // Primary CTA - bright green
          700: '#28513d',     // Form accents
          800: '#143D2B',     // Primary dark
          900: '#102C21',
          950: '#0f2a1d',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      fontSize: {
        'base': ['13px', { lineHeight: '1.5' }],
        'sm': ['12px', { lineHeight: '1.4' }],
        'xs': ['11px', { lineHeight: '1.4' }],
        'eyebrow': ['10px', { lineHeight: '1.3', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        'btn': '999px',
        'card': '24px',
        'input': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        citrus: {
          100: '#fef9c3',
          500: '#eab308',
        },
        primary: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: { DEFAULT: '#0f766e', 100: '#ccfbf1', 600: '#0d9488', 700: '#0f766e' },
        accent: { DEFAULT: '#eab308', light: '#fef9c3', dark: '#a16207' },
        success: { DEFAULT: '#16a34a', light: '#dcfce7', dark: '#166534' },
        warning: { DEFAULT: '#d97706', light: '#fef3c7', dark: '#92400e' },
        error: { DEFAULT: '#dc2626', light: '#fee2e2', dark: '#991b1b' },
        info: { DEFAULT: '#2563eb', light: '#dbeafe', dark: '#1e40af' },
        neutral: {
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
        },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.5rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
      borderRadius: { control: '0.625rem', card: '1rem', modal: '1.25rem' },
      boxShadow: {
        soft: '0 12px 32px rgba(15, 23, 42, 0.08)',
        medium: '0 16px 40px rgba(15, 23, 42, 0.12)',
        overlay: '0 24px 64px rgba(15, 23, 42, 0.2)',
      },
      transitionDuration: { standard: '180ms' },
      maxWidth: { container: '80rem' },
      keyframes: {
        'overlay-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'drawer-in': {
          from: { opacity: '0', transform: 'translateX(12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'overlay-in': 'overlay-in 180ms ease-out',
        'drawer-in': 'drawer-in 180ms ease-out',
      },
    },
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
    container: { center: true, padding: { DEFAULT: '1rem', lg: '2rem' } },
  },
  plugins: [],
} satisfies Config;

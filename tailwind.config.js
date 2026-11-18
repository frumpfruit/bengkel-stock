/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#FEF2F2',
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
        sidebar: '#FFFFFF',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
        },
        appbg: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        borderLight: '#E2E8F0',
        textDark: '#1E293B',
        textSecondary: '#64748B',
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
          info: '#2563EB',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 12px 30px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'card-glow': '0 10px 25px -5px rgba(220, 38, 38, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'inset-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}

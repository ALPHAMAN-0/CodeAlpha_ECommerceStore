/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary accent: burnt terracotta — warm, editorial, storefront-appropriate.
        terracotta: {
          50: '#FCF4F1',
          100: '#F9E5DC',
          200: '#F0C6B1',
          300: '#E4A282',
          400: '#D57B56',
          500: '#C1573A', // primary
          600: '#A6432A',
          700: '#873522',
          800: '#6D2C1D',
          900: '#59251A',
          950: '#30110C',
        },
        // Warm neutrals used instead of stock white/black/gray.
        paper: '#FBF6F0',
        ink: {
          DEFAULT: '#241F1B',
          soft: '#4A423C',
          faint: '#8A7E74',
        },
        olive: {
          50: '#F4F5ED',
          100: '#E6E9D6',
          500: '#6B7A4F',
          600: '#556140',
          700: '#434C33',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(36, 31, 27, 0.04), 0 6px 16px -4px rgba(36, 31, 27, 0.10)',
        'card-hover': '0 4px 10px rgba(36, 31, 27, 0.06), 0 16px 32px -8px rgba(36, 31, 27, 0.16)',
        soft: '0 2px 24px rgba(36, 31, 27, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

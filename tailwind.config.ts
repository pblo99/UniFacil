import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B63F6',
        'primary-dark': '#084CC1',
        'primary-light': '#EAF2FF',
        background: '#F6F8FC',
        surface: '#FFFFFF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#2563EB'
      },
      boxShadow: {
        card: '0 20px 45px -28px rgba(15, 23, 42, 0.35)',
        soft: '0 16px 32px -26px rgba(11, 99, 246, 0.3)'
      },
      borderRadius: {
        card: '20px',
        button: '16px',
        input: '14px',
        frame: '32px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;

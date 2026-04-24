/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design system — Công an nhân dân & Pháp luật
        forest: {
          DEFAULT: '#113a26',
          dark: '#0a2318',
          deeper: '#0d2d1e',
          light: '#1a5c3d',
        },
        navy: {
          DEFAULT: '#1e3a8a',
          light: '#1d4ed8',
          muted: 'rgba(30,58,138,0.5)',
        },
        crimson: {
          DEFAULT: '#991b1b',
          light: '#dc2626',
        },
        gold: {
          DEFAULT: '#FFD700',
          muted: 'rgba(255,215,0,0.6)',
          faint: 'rgba(255,215,0,0.08)',
        },
        // Category accents
        accent: {
          red: '#f87171',
          blue: '#60a5fa',
          green: '#6ee7b7',
          amber: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 0.8s linear infinite',
        'slide-in': 'slideIn 0.3s ease',
        'fade-up': 'fadeUp 0.3s ease',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

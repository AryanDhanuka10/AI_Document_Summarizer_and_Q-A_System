import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        panel: '#111827',
        primary: '#6366F1',
        accent: '#8B5CF6',
        secondary: '#22D3EE',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        success: '#22C55E',
      },
      borderRadius: {
        'bubble': '20px',
        'bubble-sm': '18px',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'wide': '0.01em',
        'wider': '0.02em',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;


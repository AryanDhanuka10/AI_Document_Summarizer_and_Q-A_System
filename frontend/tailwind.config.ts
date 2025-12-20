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
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          850: '#0f172a',
          900: '#0a0f1e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-slate-indigo': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
        'gradient-indigo': 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

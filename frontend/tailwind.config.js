/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFB800',
          light: '#FFC933',
          dark: '#E6A600',
        },
        dark: {
          950: '#0F0F0F',
          900: '#1A1A1A',
          850: '#2A2A2A',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 184, 0, 0.6)',
        'glow-lg': '0 0 40px rgba(255, 184, 0, 0.8)',
        'glow-sm': '0 0 10px rgba(255, 184, 0, 0.3)',
        'glow-pulse': '0 0 30px rgba(255, 184, 0, 0.8), 0 0 60px rgba(255, 184, 0, 0.6)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 184, 0, 0.6), 0 0 40px rgba(255, 184, 0, 0.4)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 184, 0, 0.8), 0 0 60px rgba(255, 184, 0, 0.6)',
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}


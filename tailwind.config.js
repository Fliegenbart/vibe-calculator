/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // vibe moves you - Brand Colors (anpassbar)
        vibe: {
          primary: '#00D4AA',      // Electric Mint
          secondary: '#1A1A2E',    // Deep Navy
          accent: '#FF6B35',       // Energy Orange
          light: '#F0FFF4',        // Soft Mint
          dark: '#0D0D1A',         // Almost Black
          gray: {
            100: '#F7F7F8',
            200: '#E8E8EC',
            300: '#D1D1D9',
            400: '#9999A8',
            500: '#666677',
            600: '#444455',
            700: '#2A2A3C',
            800: '#1A1A28',
            900: '#0F0F1A',
          }
        },
        // Semantic Colors
        ev: {
          green: '#00D4AA',
          light: '#E6FFF7',
        },
        ice: {
          orange: '#FF6B35',
          light: '#FFF4E6',
        },
        abo: {
          purple: '#6366F1',
          light: '#EEF2FF',
        },
        saving: '#10B981',
        cost: '#EF4444',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'count-up': 'countUp 1.5s ease-out',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        countUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-vibe': 'linear-gradient(135deg, #00D4AA 0%, #00A88A 50%, #007766 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A2E 0%, #0D0D1A 100%)',
        'mesh-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2300D4AA\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      boxShadow: {
        'vibe': '0 4px 20px -2px rgba(0, 212, 170, 0.25)',
        'vibe-lg': '0 10px 40px -4px rgba(0, 212, 170, 0.3)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.15), 0 12px 32px -8px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}

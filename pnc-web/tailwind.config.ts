import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      extend: {
        colors: {
          'pnc-green-dark': '#224229',
          'pnc-green-light': '#4A7C59',
          'pnc-brown': '#8B4513',
          'pnc-sand': '#F5DEB3',
          'pnc-accent-blue': '#3498DB',
          'pnc-accent-orange': '#E67E22',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'], // Default sans-serif
          serif: ['Playfair Display', 'serif'], // For headings
        },
        keyframes: {
          'fade-in-up': {
            '0%': {
              opacity: '0',
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)',
            },
          },
        },
        animation: {
          'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        },
        animationDelay: { // Custom animation delays
          100: '100ms',
          200: '200ms',
          300: '300ms',
          400: '400ms',
        },
      },
    },
  plugins: [animate],
};


export default config;

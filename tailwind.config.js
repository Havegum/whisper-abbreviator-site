import colors from './src/lib/assets/colors.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      colors,
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '16px',
        lg: '24px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '38px',
      },
    },
  },
};

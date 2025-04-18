/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#03C988',
        'primary-hover': '#029966',
        'primary-txt': '#333333',
        'secondary-txt': '#c0c1bf',
        'primary-bg': '#f9f9f9',
        'primary-btn': '#333333',
        'primary-btn-hover': '#4d4d4d',
        'link': '#0077b5',

        'success': '#00D222',
        'success-op': 'rgba(0, 189, 64, 0.12)',
        'danger': '#FF0000',
        'danger-op': 'rgba(255, 0, 0, 0.12)',
        'sky': '#0897FF',
        'sky-op': 'rgba(8, 151, 255, 0.12)',
        'rose': '#FF5EF9',
        'rose-op':'rgba(246, 139, 255, 0.12)',
        'star': '#F8BD00',
        'star-op': 'rgba(248, 189, 0, 0.12)',
      },
      boxShadow: {
        'sidebar': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card': 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        bounce: 'bounce 1s infinite'
      }
    },
  },
  plugins: [],
}
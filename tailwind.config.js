/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink: '#292b28', paper: '#fbf8f1', amber: '#e98228', teal: '#167d73' }, boxShadow: { float: '0 14px 40px rgba(56, 45, 28, 0.08)' } } },
  plugins: [],
}
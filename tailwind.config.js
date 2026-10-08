/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink: '#0f172a', paper: '#ffffff', amber: '#2563eb', teal: '#059669' }, boxShadow: { float: '0 8px 24px rgba(15, 23, 42, 0.10)', dialog: '0 16px 40px rgba(15, 23, 42, 0.16)' } } },
  plugins: [],
}

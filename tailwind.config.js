/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4f46e5', dark: '#4338ca', soft: '#eef2ff' },
        surface: { DEFAULT: '#ffffff', sunken: '#eef2f7', raised: '#f8fafc' },
        border: { DEFAULT: '#e2e8f0', strong: '#cbd5e1' },
        ink: { DEFAULT: '#0f172a', muted: '#475569', faint: '#94a3b8' },
        topbar: '#0f172a',
        danger: { DEFAULT: '#dc2626', soft: '#fef2f2' },
        ok: '#16a34a',
      },
      borderRadius: { card: '16px', md: '10px' },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.05)',
        lg: '0 10px 40px rgba(15,23,42,.18)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


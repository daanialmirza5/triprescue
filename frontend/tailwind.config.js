/** @type {import('tailwindcss').Config} */
// Safar Sathi design tokens. Every page draws its colors, type, radii and
// shadows from here so the whole product reads as one visual system.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand + surface tokens
        ink: { DEFAULT: '#0B1B3A', soft: '#23324F', muted: '#5B6B86', faint: '#8A97AD' },
        canvas: '#F4F7FC',
        line: { DEFAULT: '#E5EBF4', strong: '#D5DEEB' },
        brand: { DEFAULT: '#1F6BFF', dark: '#1554D8', light: '#E8F0FF', cyan: '#12B5E5' },
        // Status tokens: green = on track, amber = at risk, red = disrupted, purple = AI
        safe: { DEFAULT: '#16A34A', light: '#E7F7EE' },
        risk: { DEFAULT: '#F59E0B', dark: '#C77A05', light: '#FFF4E0' },
        danger: { DEFAULT: '#EF4444', dark: '#D52C2C', light: '#FDECEC' },
        ai: { DEFAULT: '#7C3AED', light: '#F1EAFE' },
        // Legacy aliases still used by the trip modals and dependency graph
        'safar-navy': '#0B1B3A', 'safar-blue': '#1F6BFF', 'safar-sky': '#12B5E5',
        'safar-saffron': '#F59E0B', 'safar-safe': '#16A34A', 'safar-risk': '#F59E0B',
        'safar-broken': '#EF4444', 'safar-ai': '#7C3AED',
      },
      borderRadius: { card: '20px', tile: '14px' },
      boxShadow: {
        card: '0 1px 2px rgba(11,27,58,.04), 0 10px 30px -12px rgba(11,27,58,.10)',
        lift: '0 2px 4px rgba(11,27,58,.05), 0 18px 40px -16px rgba(11,27,58,.22)',
        glow: '0 10px 28px -10px rgba(31,107,255,.55)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #1F4FF0 0%, #1F6BFF 45%, #12B5E5 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out', 'fade-in-up': 'fadeInUp 0.45s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', 'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite', typing: 'typing 1.1s steps(3,end) infinite',
        'dash-flow': 'dashFlow 1.2s linear infinite', 'draw-line': 'drawLine 1.1s ease-out forwards',
        // Impact panel: each cascade stage pulses as it is revealed.
        cascade: 'cascadePulse 1.1s ease-out 2',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity: '0.8' }, '100%': { transform: 'scale(2.4)', opacity: '0' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        typing: { '0%, 20%': { opacity: '0.25' }, '50%': { opacity: '1' }, '80%, 100%': { opacity: '0.25' } },
        dashFlow: { to: { strokeDashoffset: '-20' } },
        drawLine: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        cascadePulse: { '0%': { boxShadow: '0 0 0 0 currentColor' }, '100%': { boxShadow: '0 0 0 8px transparent' } },
      },
    },
  },
  plugins: [],
};

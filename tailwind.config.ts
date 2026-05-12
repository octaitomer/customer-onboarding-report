import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#FF7032',
        'accent-soft': '#FFE9DD',
        ink: '#000000',
        'ink-soft': '#3D3D3D',
        paper: '#FFFFFF',
        bg: '#F3F1F1',
        muted: '#6D6C6C',
        rule: '#CCCBCA',
        'rule-strong': '#000000',
        fog: '#E8E7E7',
        ahead: '#1F7A3A',
        'ahead-bg': '#E1F0E5',
        track: '#B36A00',
        'track-bg': '#FBEBD2',
        behind: '#FF4D2E',
        'behind-bg': '#FCE0DA',
      },
      fontFamily: {
        sans: ['"Neue Haas Grotesk Display"', '"Helvetica Neue"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"ABC Favorit Mono"', '"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        page: '210mm',
      },
    },
  },
  plugins: [],
} satisfies Config

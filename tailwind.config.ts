import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        heading: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        background: 'var(--bg-base)',
        card: 'var(--bg-card)',
        border: 'var(--border)',
        primary: 'var(--text-primary)',
        muted: 'var(--text-muted)',
      },
    },
  },
  plugins: [],
}
export default config

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                bg: 'hsl(var(--bg) / <alpha-value>)',
                surface: 'hsl(var(--surface) / <alpha-value>)',
                'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
                border: 'hsl(var(--border) / <alpha-value>)',
                text: 'hsl(var(--text))',
                muted: 'hsl(var(--muted))',
                accent: 'hsl(var(--accent))',
            },
            borderRadius: {
                DEFAULT: 'var(--radius)',
            },
            boxShadow: {
                card: '0 1px 0 hsl(var(--border) / .6), 0 0 0 1px hsl(var(--border) / .4) inset',
            },
            fontFamily: {
                sans: [
                    'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Ubuntu',
                    'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'
                ],
            },
        },
    },
    plugins: [],
};

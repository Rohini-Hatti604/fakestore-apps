module.exports = {
  darkMode: 'media',  // Use system dark mode preferences
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // Include content inside 'app' folder
    './pages/**/*.{js,ts,jsx,tsx}',  // Include content inside 'pages' folder
    './components/**/*.{js,ts,jsx,tsx}',  // Include content inside 'components' folder
  ],
  theme: {
    extend: {
      // Extend the colors to use CSS variables from globals.css
      colors: {
        background: 'var(--background)',        // Global background color
        foreground: 'var(--foreground)',        // Global foreground color
        primary: 'var(--primary)',              // Global primary color
        secondary: 'var(--secondary)',          // Global secondary color
        accent: 'var(--accent)',                // Global accent color
        muted: 'var(--muted)',                  // Global muted color
        mutedForeground: 'var(--muted-foreground)',  // Global muted text color
        border: 'var(--border)',                // Global border color
      },
    },
  },
  plugins: [],
}

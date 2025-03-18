/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'pitch-green': '#2E7D32',
          'team-a': '#1E88E5', // Blue
          'team-b': '#D32F2F',  // Red
        }
      },
    },
    plugins: [],
  }
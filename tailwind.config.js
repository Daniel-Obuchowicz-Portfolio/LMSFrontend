// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#1a202c', // Dark mode primary background color (Dark Gray)
        secondary: '#2d3748', // Dark mode secondary background color (Darker Gray)
        accent: '#4a5568', // Accent color (Dark Gray for borders or buttons)
        lightText: '#f7fafc', // Light text color (White-ish)
        darkText: '#2d3748', // Dark text color (Dark Gray for light mode)
      },
    },
  },
  plugins: [],
};

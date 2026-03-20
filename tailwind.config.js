/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "baby-pink": "#E91E8C",
        "baby-pink-light": "#FDE8F4",
        "baby-cyan": "#00BCD4",
        "baby-cyan-light": "#E0F7FA",
        "baby-purple": "#7C4DFF",
        border: "#E2E8F0",
        muted: "#94A3B8",
        background: "#F8FAFC",
      },
    },
  },
  plugins: [],
};

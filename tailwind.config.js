/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        acid: "#caff00",
        void: "#0a0a0f",
        deep: "#111118",
        surface: "#1a1a28",
        panel: "#22223a",
        purple: "#7b4dff",
        pink: "#ff2d78",
        teal: "#00ffc2",
      },
      fontFamily: {
        display: ["Orbitron", "monospace"],
        body: ["Exo 2", "sans-serif"],
      },
    },
  },
  plugins: [],
};

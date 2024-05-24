import type { Config } from "tailwindcss";
let defaultTheme = require("tailwindcss/defaultTheme");
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        showslow: {
          "0%": { opacity: "0", transform: "scale(0) rotate(0deg) " },
          "100%": { opacity: "1", transform: "scale(1) rotate(360deg)" },
        },
        opacityshow: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        opacityshowhalf: {
          "0%": { opacity: "0" },
          "100%": { opacity: "0.7" },
        },
        spinning: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "100%": { transform: "rotate(360deg) scale(1) " },
        },
      },
      animation: {
        "spin-show": "showslow 1s linear 1",
        "opacity-slow": "opacityshow 1s linear 1",
        "opacity-slow-half": "opacityshowhalf 1s linear 1",
        "spin-slow": "spinning 3s linear infinite",
      },
      backgroundImage: {
        "gradient-45": "linear-gradient(315deg, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

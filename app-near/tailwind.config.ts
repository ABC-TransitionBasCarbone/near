import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export const colors = {
  success: "#68BEAB",
  error: "#FF3228",
  info: "#00B8D9",
  black: "#101010",
  brownLight: "#FFECC7",
  blue: "#002878",
  white: "#FFFFFF",
  gray: "#808080",
  grayLight: "#BFBFBF",
  grayExtraLight: "#F6F6F6",
  green: "#00BE8C",
  yellowLight: "#FFF2D4",
};

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
    colors,
  },
  plugins: [],
} satisfies Config;

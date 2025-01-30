import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export const colors = {
  success: '#68BEAB',
  error: '#D6296E',
  info: '#00B8D9',
  black: '#101010',
  brownLight: '#FFECC7',
  blue: '#0664F0',
  blueLight: '#29ACD6',
  white: '#FFFFFF',
  grayLight: '#BFBFBF',
  grayExtraLight: '#F6F6F6',
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

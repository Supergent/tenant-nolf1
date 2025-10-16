import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn704kmvn1w3p5a4xx8aankht17sksat/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;

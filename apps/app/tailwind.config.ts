import { config } from '@repo/tailwind-config/config';

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

config.plugins = [
	...(config.plugins || []), 
	addVariablesForColors
] 

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default config
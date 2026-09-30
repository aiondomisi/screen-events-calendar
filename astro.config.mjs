// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ["**/*.lrc"],
  },
  // Set your production site URL here (used for canonical + Open Graph URLs)
  // Replace with your real domain before deploying.
});

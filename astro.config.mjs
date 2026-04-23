// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import { loadEnv } from "vite";
const { SITE_URL, PUBLIC_PATH_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: PUBLIC_PATH_URL,
  server: {
    port: 3000,
  },
  integrations: [icon(), react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
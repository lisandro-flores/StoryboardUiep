import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://lisandro-flores.github.io',
  base: isGitHubPages ? '/StoryboardUiep' : '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

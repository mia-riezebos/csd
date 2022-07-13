import { sveltekit } from '@sveltejs/kit/vite';

import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '#': resolve(__dirname, './sketches')
    }
  },
  plugins: [sveltekit()]
};

export default config;

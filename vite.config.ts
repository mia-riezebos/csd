import { sveltekit } from '@sveltejs/kit/vite';

import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  resolve: {
    alias: {
      '@': resolve(__dirname, '/static'),
      '#': resolve(__dirname, '/sketches')
    }
  },

  // server: {
  //   fs: {
  //     allow: ['sketches/**/*.ts']
  //   }
  // },
  plugins: [sveltekit()]
};

export default config;

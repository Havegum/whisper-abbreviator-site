import { sveltekit } from '@sveltejs/kit/vite';
import yaml from '@rollup/plugin-yaml';
import dsv from '@rollup/plugin-dsv';
import json from './custom-plugins/json.js';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import websocket from './src/lib/server/websocket/plugin.js';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    sveltekit(),
    json(),
    yaml(),
    dsv(),
    vanillaExtractPlugin(),
    websocket(),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
  ],
  server: {
    port: 4173,
    open: true,
  },
  build: {},
});

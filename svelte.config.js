import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';

const assets = 'https://halvard.vegum.no/integrations/whisper-abbreviator';
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    paths: {
      assets,
      relative: false,
      base: '/integrations/whisper-abbreviator',
    },
    adapter: adapter({ pages: 'dist', fallback: 'index.html' }),
    embedded: true,
    prerender: {
      handleHttpError: details => console.error(details),
    },
  },
};

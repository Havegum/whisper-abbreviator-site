import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/websocket';
import type { Handle } from '@sveltejs/kit';
import type { ExtendedGlobal } from '$lib/server/websocket';
import setup from '$lib/api/server';

let wssInitialized = false;
function startupWebsocketServer() {
  if (wssInitialized) return;
  console.log('[wss:kit] setup');
  const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
  if (wss !== undefined) {
    setup(wss);
    wssInitialized = true;
  }
}

export const handle = (async ({ event, resolve }) => {
  startupWebsocketServer();
  // Skip WebSocket server when pre-rendering pages

  if (!building) {
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

    if (wss !== undefined) {
      event.locals.wss = wss;
    }
  }
  const response = await resolve(event, {
    filterSerializedResponseHeaders: name => name === 'content-type',
  });
  return response;
}) satisfies Handle;

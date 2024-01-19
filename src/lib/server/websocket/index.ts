import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import type { Server, WebSocket as WebSocketBase } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocketBase {
  socketId: string;
}

// You can define server-wide functions or class instances here
// export interface ExtendedServer extends Server<ExtendedWebSocket> {};

export type ExtendedWebSocketServer = Server<ExtendedWebSocket>;

export type ExtendedGlobal = typeof globalThis & {
  [GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (
  req: IncomingMessage,
  sock: Duplex,
  head: Buffer,
) => {
  console.log();

  const pathname = req.url
    ? new URL(req.url || '', 'https://_').pathname
    : null;

  if (pathname !== '/websocket') return;

  const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

  wss.handleUpgrade(req, sock, head, ws => {
    console.log('[handleUpgrade] creating new connection');
    wss.emit('connection', ws, req);
  });
};

export const createWSSGlobalInstance = () => {
  console.log('[wss:global] creating');
  console.log(globalThis[GlobalThisWSS]);

  const wss = new WebSocketServer({
    noServer: true,
  }) as ExtendedWebSocketServer;
  console.log('[wss:global] created');

  (globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

  wss.on('connection', ws => {
    ws.socketId = nanoid();
    console.log(`[wss:global] client connected (${ws.socketId})`);

    ws.on('close', () => {
      console.log(`[wss:global] client disconnected (${ws.socketId})`);
    });
  });

  return wss;
};

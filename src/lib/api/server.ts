import Agent, { functions as agentFunctions } from '$lib/agent';

import type { ExtendedWebSocketServer } from '$lib/server/websocket';

interface Command {
  type: string;
  payload: unknown;
}

export default function setup(wss: ExtendedWebSocketServer) {
  let connections = new Set<string>();
  wss.on('connection', (ws, _request) => {
    // This is where you can authenticate the client from the request
    // const session = await getSessionFromCookie(request.headers.cookie || '');
    // if (!session) ws.close(1008, 'User not authenticated');
    // ws.userId = session.userId;
    console.log(`[wss:kit] client connected (${ws.socketId})`);

    if (connections.has(ws.socketId)) {
      console.log(`[wss:kit] deduplicating connection (${ws.socketId})`);
      ws.close(1008, 'User already connected');
      return;
    }

    connections.add(ws.socketId);

    const agent = new Agent(agentFunctions, ws);

    ws.on('message', async (message: string) => {
      try {
        const command = JSON.parse(message) as Command;
        await agent.run(command.type, command.payload);
      } catch (error) {
        console.error(`[wss:kit] Error: ${error}`);
      }
    });

    ws.on('close', () => {
      console.log(`[wss:kit] client disconnected (${ws.socketId})`);
      connections.delete(ws.socketId);
    });
  });
}

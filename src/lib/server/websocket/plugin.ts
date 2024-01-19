import { createWSSGlobalInstance, onHttpServerUpgrade } from './';
import type { PluginOption } from 'vite';

const plugin: PluginOption = {
  name: 'integratedWebsocketServer',
  configureServer(server) {
    createWSSGlobalInstance();
    server.httpServer?.on('upgrade', onHttpServerUpgrade);
  },
  configurePreviewServer(server) {
    createWSSGlobalInstance();
    server.httpServer?.on('upgrade', onHttpServerUpgrade);
  },
};

export default () => plugin;

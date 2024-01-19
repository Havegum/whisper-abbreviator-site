/// <reference types="svelte" />
/// <reference types="vite/client" />
import type { ExtendedWebSocketServer } from '$lib/server/websocket';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      wss?: ExtendedWebSocketServer;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.yaml' {
  const data: any;
  export default data;
}

declare module '*.csv' {
  const data: any;
  export default data;
}

declare module '*.tsv' {
  const data: any;
  export default data;
}

declare module '*.geojson' {
  const data: any;
  export default data;
}

declare module '*.topojson' {
  const data: any;
  export default data;
}

import { lastValueFrom } from 'rxjs';
import Client from '../client';
import { expect, test, vi } from 'vitest';
class MockWebSocket {
  listeners: Set<string>;
  constructor() {
    this.listeners = new Set();
  }
  addEventListener(string: string) {
    this.listeners.add(string);
  }
  removeEventListener() {}
  close() {}
}
vi.stubGlobal('WebSocket', MockWebSocket);

vi.stubGlobal('window', { location: { host: 'localhost:4173' } });

test('constructor', async () => {
  const client = new Client();

  expect(client).toBeDefined();

  expect(client.output).toBeDefined();

  const subscription = client.output.subscribe(() => {});

  // @ts-expect-error
  const listeners = client.ws.listeners;
  expect(listeners).toBeDefined();
  expect(listeners.has('open')).toBe(true);
  expect(listeners.has('close')).toBe(true);
  expect(listeners.has('message')).toBe(true);

  subscription.unsubscribe();
});

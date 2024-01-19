import {
  type Observable,
  ReplaySubject,
  fromEvent,
  groupBy,
  map,
  scan,
} from 'rxjs';
import { CommandType, type Command, type CommandPayload } from './types';
import { addRecursively } from './utils';
import { browser } from '$app/environment';

class Client {
  private webSocketEstablished = false;
  private ws: WebSocket;

  public output: Observable<any>;

  constructor() {
    console.log('Client created');

    this.ws = this.establishWebSocket();

    this.ws.addEventListener('open', _ => {
      this.webSocketEstablished = true;
      this.log('[websocket] connection open');
    });

    this.ws.addEventListener('close', _ =>
      this.log('[websocket] connection closed'),
    );

    this.output = fromEvent<Event & { data: any }>(this.ws, 'message').pipe(
      map(message => JSON.parse(message.data)),
      groupBy(p => p.id, { connector: () => new ReplaySubject(1) }),
      map(group =>
        group.pipe(
          map(d => (d.content ? d : d.choices[0])),
          scan(
            (acc, next) =>
              next.content
                ? next.content
                : next.update
                ? addRecursively(acc, next.update, true)
                : addRecursively(acc, next.delta),
            {},
          ),
        ),
      ),
      scan((acc, next) => acc.concat(next), [] as Observable<any>[]),
    );
  }

  private log(string: string) {
    console.log(string);
  }

  private establishWebSocket(): WebSocket {
    if (this.webSocketEstablished) {
      this.log('[websocket] connection already established');
      return this.ws;
    }

    const protocol =
      !browser || window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return new WebSocket(`${protocol}//${window.location.host}/websocket`);
  }

  public async think(question: string): Promise<void> {
    this.send({ type: CommandType.Think, payload: question });
  }

  public async permit(id: string): Promise<void> {
    const payload = { id, granted: true };
    return this.respondPermissionRequest(payload);
  }

  public async deny(id: string): Promise<void> {
    const payload = { id, granted: false };
    return this.respondPermissionRequest(payload);
  }

  private async respondPermissionRequest(
    payload: CommandPayload[CommandType.Permission],
  ): Promise<void> {
    this.send({ type: CommandType.Permission, payload });
  }

  private async send(message: Command<CommandType>) {
    console.log('[websocket] sending message', message);
    this.ws.send(JSON.stringify(message));
  }

  public close() {
    this.ws.close();
  }
}

export default Client;

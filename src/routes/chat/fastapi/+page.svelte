<script lang="ts">
import { createClient } from '$lib/wa-api/api';
import { type Writable, writable, get } from 'svelte/store';
import { addRecursively } from '$lib/agent/utils';
import Responses from './Responses.svelte';
import { tick } from 'svelte';

interface Response {
  id?: string;
  role?: string;
  payload: any;
}
import mock from './mock-reply.json';

const createQueryResponse = () =>
  writable({
    payload: {
      type: 'input',
      message: '',
    },
    role: 'user',
  });

class Client {
  client: ReturnType<typeof createClient>;
  output: Writable<Array<Writable<Response>>>;

  constructor() {
    this.client = createClient(fetch);
    this.output = writable([
      // writable(mock),
      // writable({
      //   payload: {
      //     message: [
      //       'Mane is a large and dangerous creature that the players trade with in the Garden of the Moon [1]. Mane is interested in shiny and pretty items, textiles, clothing, and certain metals and minerals [1, 2, 3]. They have a collection of textiles and clothing sized for the Moonsworn [1].',
      //     ],
      //   },
      //   done: true,
      //   role: 'assistant',
      // }),
      createQueryResponse(),
    ]);
  }

  static async *iterate<T>(body: ReadableStream<T>) {
    const reader = body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }

  async send(message: string) {
    const requestPayload = { json: { message } };
    const response =
      await this.client['/api/v1/agent/stream'].post(requestPayload);
    const body = response.body;

    if (!body) return;

    const responseStoreMap = new Map();
    const addResponseStore = (id: string) => {
      const responseStore = writable({ payload: {} });
      responseStoreMap.set(id, responseStore);
      this.output.update(output => {
        output.push(responseStore);
        return output;
      });
    };

    for await (const bytes of Client.iterate(body)) {
      const textDecoder = new TextDecoder();
      const string = textDecoder.decode(bytes, { stream: true });

      const responses = string
        .replaceAll('}{', '}\n{')
        .split('\n')
        .map(str => JSON.parse(str));

      for (const data of responses) {
        const id = data.id;
        if (!responseStoreMap.has(id)) addResponseStore(id);
        const responseStore = responseStoreMap.get(id);

        responseStore.update(response => ({
          ...response,
          ...data,
          payload: addRecursively(response.payload, data.payload),
        }));

        await tick();
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }

    for (const responseStore of responseStoreMap.values()) {
      responseStore.update(response => ({
        ...response,
        done: true,
      }));

      console.log(get(responseStore));
    }

    this.output.update(output => {
      output.push(createQueryResponse());
      console.log(output);
      return output;
    });
  }

  async handleInput(event: CustomEvent) {
    const detail = event.detail;
    this.send(detail);
  }
}

let client = new Client();
</script>

<article>
  <div>
    <Responses
      responses={client.output}
      on:input={e => client.handleInput(e)}
    />
  </div>
</article>

<style>
article {
  margin: calc(var(--s-3) * -1);
  padding: var(--s-3);
  background-color: var(--gray-100);
  min-height: calc(100% + var(--s-3) * 2);

  display: grid;
  grid-template-columns: 1fr min(720px, 100%) 1fr;
}

article > div {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}
</style>

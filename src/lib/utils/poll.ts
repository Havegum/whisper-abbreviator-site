import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

enum State {
  uninitialized = 'uninitialized',
  loading_initial = 'loading_initial',
  loading = 'loading',
  resolved = 'resolved',
  error = 'error',
}

interface Data<Payload> {
  data: Payload;
  meta: object;
  links: object;
}

export default function poll<P>(
  url: string,
  { interval = 60_000 } = {},
): Writable<{ data: Data<P> | null; state: State }> {
  let timeout: ReturnType<typeof setTimeout>;

  const store: Writable<{ data: Data<P> | null; state: State }> = writable(
    {
      data: null,
      state: State.uninitialized,
    },
    () => {
      void poll(true);
      return () => clearTimeout(timeout);
    },
  );

  async function poll(initial = false): Promise<void> {
    clearTimeout(timeout);

    try {
      store.update(({ data }) => ({
        data,
        state: initial ? State.loading_initial : State.loading,
      }));

      const response = await fetch(url);
      const data = (await response.json()) as Data<P>;
      store.set({ data, state: State.resolved });
    } catch (e) {
      store.update(({ data }) => ({ data, state: State.error }));
    }

    timeout = setTimeout(() => void poll(), interval);
  }

  return store;
}

import type { ComponentConstructorOptions } from 'svelte';
import ErrorComponent from './Error.svelte';

/**
 * Catches initialization errors.
 * This ErrorBoundary-component is [fully based on this repl](https://svelte.dev/repl/006facb65ece4f808cd733e838783228?version=3.22.2).
 *
 * Wrap your crashing component with this,
 * and handle the error if it binds to anything.
 * ```svelte
 * {#if !error}
 *   <ErrorBoundary bind:error>
 *     <PotentiallyCrashingComponent />
 *   </ErrorBoundary>
 * {:else}
 *   <p>Oh noes, it crashed! :(</p>
 * {/if}
 * ```
 */
export default class ErrorBoundary extends ErrorComponent {
  constructor(config: ComponentConstructorOptions) {
    let error: null | Error = null;

    // eslint-disable-next-line
    const slots = config.props.$$slots.default.map(x => (...args) => {
      try {
        // eslint-disable-next-line
        return x(...args);
        // eslint-disable-next-line
      } catch (e) {
        // eslint-disable-next-line
        error = e;
      }
    });

    // eslint-disable-next-line
    config.props.$$slots.default = slots;

    super(config);

    if (error) this.$set({ error: error });
  }
}

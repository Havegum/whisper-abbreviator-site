<script lang="ts">
// import Section from '$lib/components/Section.svelte';
import TextInput from '$lib/components/TextInput.svelte';
import { createEventDispatcher } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import Message from './Message.svelte';

export let response: Writable<any>;

const expandedContext = writable(new Set());

const dispatch = createEventDispatcher();
function handleInput(store: Writable<any>) {
  return function ({ detail }: { detail: string }) {
    store.update(store => {
      store.payload.message = [detail];
      store.done = true;
      delete store.payload.type;
      return store;
    });
    dispatch('input', detail);
  };
}

function handleExpandReference(event: CustomEvent<number>) {
  expandedContext.update(set => {
    set.add(event.detail);
    return set;
  });
}
</script>

<div
  class="response"
  class:null={$response.role === undefined}
  class:assistant={$response.role === 'assistant'}
  class:user={$response.role === 'user'}
  class:pending={$response.done !== true}
  class:context={$response.role === 'context'}
  class:pending-input={$response.payload.type === 'input'}
  class:done={$response.done}
>
  <div class="meta">
    {#if $response.role === 'context'}
      <span>Context {$response.id}:</span>
      <span
        >Session {$response.payload.session}
        {$response.payload.type}</span
      >
    {:else}
      <span>{$response.role ?? ''}</span>
    {/if}
  </div>

  {#if $response.payload.type === 'input'}
    <div class="user-input">
      <TextInput on:click={handleInput(response)}>Ask</TextInput>
    </div>
  {:else if $response.payload.message}
    <p class="message">
      {#if $response.done}
        <Message
          message={$response.payload.message.join('')}
          on:expand-reference={handleExpandReference}
        />
      {:else}
        {#each $response.payload.message as message}
          <span>{message}</span>
        {/each}
        <span class="pending-affordance" />
      {/if}
    </p>
  {:else}
    <p>...</p>
  {/if}
</div>

{#each ($response.payload?.context ?? []).filter( ctx => $expandedContext.has(ctx.id), ) as context}
  <svelte:self response={writable(context)} />
{/each}

<style>
.response {
  border-left: 3px solid var(--theme);
  padding: var(--s-3);
  background-color: var(--white);
  border-radius: 3px;
  transition:
    border-radius 200ms ease-in-out,
    border-left-width 200ms ease-in-out;
}

.pending {
  animation: pending-response 500ms linear infinite alternate;
}

.context {
  display: block;
}

.pending-input {
  /* background-color: transparent; */
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  animation: none;
  /* border-radius: var(--s-2);
  border-left-width: var(--s-2); */
  box-shadow: 0 8px 16px -8px #0005;
}

.assistant {
  --theme: var(--purple);
  --theme-dark: var(--purple-800);
  --theme-light: var(--purple-200);
}

.user {
  --theme: var(--blue);
  --theme-dark: var(--blue-800);
  --theme-light: var(--blue-200);
}

.context {
  --theme: var(--gray);
  --theme-dark: var(--gray-800);
  --theme-light: var(--gray-200);
}

.message {
  white-space: pre-wrap;
}

.message span {
  animation: fade-in 2000ms linear;
}

.pending-affordance {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 999px;
  background-color: var(--theme-light);
  animation: bob 450ms ease-in-out infinite alternate;
}

.null {
  --theme: var(--gray-400);
  --theme-dark: var(--gray-200);
  --theme-light: var(--gray-50);
  text-align: center;
  line-height: var(--medium);
  animation: null 600ms ease-in-out infinite alternate;
}

.null p {
  color: var(--gray-400);
  font-size: var(--xhuge);
  transform: translateY(-0.2em);
}

.user-input {
  margin: calc(-1 * var(--s-1)) calc(-1 * var(--s-2) - 1px);
}

.meta {
  margin-top: calc(-1 * var(--s-2));
  margin-bottom: var(--s-2);
  font-size: var(--xsmall);
  text-transform: uppercase;
  color: var(--theme);
  font-weight: 700;
}

@keyframes null {
  0% {
    background-color: var(--theme-light);
  }

  100% {
    background-color: var(--white);
  }
}

@keyframes bob {
  0% {
    transform: translateY(-0.125em);
  }

  100% {
    transform: translateY(0.125em);
  }
}

@keyframes fade-in {
  0% {
    color: white;
  }

  5% {
    color: var(--theme);
  }

  15% {
    color: var(--theme-dark);
  }

  100% {
    color: var(--gray-800);
  }
}

@keyframes pending-response {
  0% {
    border-left-color: var(--theme-light);
  }

  100% {
    border-left-color: var(--theme);
  }
}
</style>

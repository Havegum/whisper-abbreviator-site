<script lang="ts">
import { createEventDispatcher } from 'svelte';
import Button from './Button.svelte';
const dispatch = createEventDispatcher();

export let value: string = '';
function handleClick() {
  dispatch('click', value);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    dispatch('click', value);
  }
}
</script>

<div class="text-input">
  <input type="text" bind:value autocomplete="off" on:keydown={handleKeydown} />

  <Button on:click={handleClick}>
    <slot>Enter</slot>
  </Button>
</div>

<style>
input {
  width: 100%;
  background-color: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: var(--s-1);
  line-height: 1;
  padding: var(--s-1) var(--s-2);
}

.text-input {
  display: flex;
  gap: var(--s-3);
}

/* .text-input button {
  flex-shrink: 0;
} */

input:focus-visible {
  outline: 5px solid var(--blue-200);
  border-color: var(--blue);
  background-color: white;
}

/* button:focus-visible {
  outline: 3px solid var(--blue-700);
  outline-offset: 2px;
} */
</style>

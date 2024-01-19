<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let id: number;

const dispatch = createEventDispatcher();
</script>

<button
  class="bg-gray-100 p-0 ml-0.5 rounded w-4 h-4 text-center text-xs hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white focus-visible:bg-blue-100 focus-visible:outline-blue-700 focus-visible:outline-offset-2 focus-visible:relative focus-visible:z-1"
  on:click={() => dispatch('expand-reference', id)}>{id}</button
>

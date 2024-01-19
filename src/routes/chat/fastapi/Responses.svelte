<script lang="ts">
import type { Writable } from 'svelte/store';
import Response from './Response.svelte';

export let responses: Writable<Writable<any>[]>;
</script>

{#if $responses}
  {#each $responses as response}
    <Response {response} on:input />
  {/each}
{/if}

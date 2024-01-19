<script lang="ts">
import Section from '$lib/components/Section.svelte';
import Client from '$lib/agent/client';
import { onDestroy, onMount } from 'svelte';
import Response from '$lib/components/response/Response.svelte';
import type { Observable } from 'rxjs';
import TextInput from '$lib/components/TextInput.svelte';

let client: Client;
let question: string = 'What was Lyra doing throughout the last session?';

let output: Observable<Observable<any>[]>;
onMount(() => {
  if (!client) {
    client = new Client();
    output = client.output;
  }
});

onDestroy(() => {
  if (client) client.close();
});
</script>

<article>
  <div>
    <Section>
      <TextInput value={question} on:click={e => client.think(e.detail)}
        >Ask</TextInput
      >
    </Section>
    <div class="spacer" />

    <Section flat={true} --padding={0}>
      {#if output !== undefined && $output !== undefined}
        <ul>
          {#each $output as message}
            <li>
              <Response
                on:permit={e => client.permit(e.detail)}
                on:deny={e => client.deny(e.detail)}
                {message}
              />
            </li>
          {/each}
        </ul>
      {/if}
    </Section>
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
}

ul {
  list-style: none;
  padding: 0;
}

li {
  white-space: pre-wrap;
  display: flex;
  margin-top: 1px;
}

li:first-of-type {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}

.spacer {
  --s: var(--s-3);

  height: var(--s);
  width: var(--s);
}
</style>

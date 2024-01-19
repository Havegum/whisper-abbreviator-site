<script lang="ts">
import { browser } from '$app/environment';
import Section from '$lib/components/Section.svelte';
import journal from './journal_text.json';
import DOMPurify from 'dompurify';

let selectedJournal = journal[0];

const purify = DOMPurify();
function safeRender(str: string): string {
  if (purify.sanitize) {
    return purify.sanitize(
      str.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''),
    );
  } else {
    return '';
  }
}
</script>

<div class="flex max-h-full overflow-hidden gap-2 -ml-4 -my-4">
  <ul class="grow-0 shrink-0 overflow-y-auto bg-white py-4">
    {#each journal as j}
      <li>
        <button
          class="text-left px-2 py-1 text-gray-700 leading-6 w-full hover:bg-blue-100"
          class:active={selectedJournal === j}
          class:empty={j.pages.every(page => !page)}
          on:click={() => (selectedJournal = j)}
        >
          {j.name}
        </button>
      </li>
    {/each}
  </ul>

  <div class="grow-1 w-full overflow-y-auto py-4">
    <div class="max-w-prose">
      <Section>
        <h2 class="font-bold">{selectedJournal.name}</h2>
        {#each selectedJournal.pages as text}
          <p>{safeRender(text)}</p>
        {/each}
      </Section>
    </div>
  </div>
</div>

<style lang="postcss">
button.active {
  @apply bg-blue-800 text-blue-100;
}

button.active:hover {
  @apply bg-blue-900;
}

button.empty {
  @apply text-gray-300;
}

p {
  white-space: pre-wrap;
}

ul {
  max-width: 20ch;
}
</style>

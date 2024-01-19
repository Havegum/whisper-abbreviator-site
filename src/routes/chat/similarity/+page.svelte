<script lang="ts">
import { base } from '$app/paths';
import Section from '$lib/components/Section.svelte';
import TextInput from '$lib/components/TextInput.svelte';

let similar = [];

async function getSimilar(sentence: string) {
  const data = await fetch(`${base}/api/chat/similar`, {
    body: JSON.stringify({ sentence }),
    method: 'POST',
  });

  console.log('data sent');

  const json = await data.json();
  similar = json;
}
</script>

<article>
  <div>
    <Section textContent>
      <h2>Sentence Similarity</h2>
      <p>
        Enter a sentence, and this tool will attempt find the most semantically
        similar sentence in the database.
      </p>

      <p>
        Under the hood, the sentence is transformed into an <em>embedding</em>.
        The embedding is actually just an array of numbers. We'll take this
        array and compare it to the embeddings of all the sentences in the
        database. The sentence with the smallest distance to the input sentence
        is the most similar.
      </p>

      <TextInput on:click={({ detail }) => getSimilar(detail)}>Check</TextInput>
    </Section>

    {#if similar.length > 0}
      {#each similar as s}
        <Section>
          <div class="chunk">
            <div class="meta">
              <span class="field">Source:</span>
              {s.source_type}
              <span class="field">Session:</span>
              {s.source_session}
            </div>
            <div class="content">
              {s.content}
            </div>
          </div>
        </Section>
      {/each}
    {/if}
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

.meta .field {
  font-size: var(--xsmall);
  text-transform: uppercase;
  color: var(--gray-600);
}

.chunk .content {
  max-height: 15ch;
  overflow-y: auto;
  background-color: var(--gray-50);

  padding: calc(var(--s-3) - 3px);
  margin: calc(-1 * var(--s-3) + 3px);
  margin-top: var(--s-1);
}
</style>

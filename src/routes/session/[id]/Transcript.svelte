<script lang="ts">
import Section from '$lib/components/Section.svelte';

export let content: string;

// const regex = /(?<timestamp>\[(\d{2}:?){3}->(\d{2}:?){3}\])\s?(?<content>.+)/;
const regex = /(?<timestamp>(\d{2}:?){3})\s?(?<content>.+)/;
console.log(content);

$: lines = content.split('\n');
$: parsed = lines.map((line: string) => {
  let content = line;
  let timestamp = '';
  const match = line.match(regex);
  if (match && match.groups) {
    timestamp = match.groups.timestamp;
    timestamp = timestamp.split('->')[0].replace('[', '');
    content = match.groups.content;
  }
  return { timestamp, content };
});
</script>

<Section flat>
  <h2 class="text-lg font-medium">Transcript</h2>
  {#each parsed as { timestamp, content }}
    <div class="transcript">
      {#if timestamp}
        <p class="timestamp">{timestamp}</p>
      {/if}
      <p>{content}</p>
    </div>
  {/each}
</Section>

<style>
.timestamp {
  font-family: monospace;
  font-size: var(--xsmall);
  color: var(--gray-700);
}

.transcript {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: var(--s-2);
}
</style>

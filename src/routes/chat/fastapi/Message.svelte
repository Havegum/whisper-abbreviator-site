<script lang="ts">
import Reference from './Reference.svelte';
export let message: string;

function getParts(message: string) {
  let match = / *\[\d+(, *\d+)*\]/g.exec(message);

  const parts = [];

  while (match) {
    const part = message.slice(0, match.index);

    if (part) {
      parts.push({ type: 'string', content: part });
    }

    const references: number[] = JSON.parse(match[0]);
    references
      .map(ref => ({ type: 'reference', content: ref }))
      .forEach(ref => parts.push(ref));

    message = message.slice(match.index + match[0].length);

    match = / *\[\d+(, *\d+)*\]/g.exec(message);
  }

  parts.push({ type: 'string', content: message });

  return parts;
}

$: parts = getParts(message);
</script>

{#each parts as part}
  {#if part.type === 'string'}
    <span>{part.content}</span>
  {:else if part.type === 'reference'}
    <Reference id={part.content} on:expand-reference />
  {/if}
{/each}

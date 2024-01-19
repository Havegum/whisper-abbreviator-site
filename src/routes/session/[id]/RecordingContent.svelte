<script lang="ts">
import Summary from './Summary.svelte';
import Transcript from './Transcript.svelte';

export let recording;

$: transcript = recording.transcript;
$: summary = transcript?.summaries[0];

// $: response = fetch(`/api/recording/${recording.uuid}/transcripts`).then(
//   async d => await d.json(),
// );
</script>

{#if transcript}
  <div class="contents">
    {#if summary}
      <div class="content">
        <Summary content={summary.content} />
      </div>
    {:else}
      <p>Ikke oppsummert</p>
    {/if}

    <div class="content">
      <Transcript content={transcript.content} />
    </div>
  </div>
{:else}
  <p>Ikke transkribert</p>
{/if}

<style>
.contents {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--s-3);
}

.content {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}
</style>

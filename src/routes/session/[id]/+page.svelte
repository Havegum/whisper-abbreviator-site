<script lang="ts">
import { browser } from '$app/environment';
import { base } from '$app/paths';
import { enhance } from '$app/forms';
import type { PageData } from './$types';
import RecordingContent from './RecordingContent.svelte';

export let data: PageData;
$: recording = data.recording;
</script>

<header>
  <h1 class="text-xl font-medium">Session {data.session.number}</h1>
  {#if browser && recording && import.meta.env.DEV}
    <button
      class="btn btn-danger"
      on:click={async () => {
        const res = await fetch(
          `${base}/api/recording/${recording.uuid}/delete`,
          {
            method: 'DELETE',
          },
        );
        if (res.ok) {
          data.recordings = data.recordings.filter(
            r => r.uuid !== recording.uuid,
          );
        }
      }}>Slett notes</button
    >
  {/if}
</header>

{#if recording}
  {#if browser}
    <RecordingContent {recording} />
  {/if}
  <!-- {:else if import.meta.env.DEV}
  <li>Fant ingen opptak</li>

  <form
    action="{base}/api/recording"
    method="POST"
    use:enhance
    enctype="multipart/form-data"
  >
    <label>Opptak: <input type="file" name="audio_file" /></label>
    <label class="visually-hidden"
      >Session: <input
        type="text"
        name="session_id"
        value={data.session.uuid}
      /></label
    >
    <label
      >Transkriber: <input
        type="checkbox"
        name="transcribe"
        checked={true}
      /></label
    >
    <label
      >Sammendrag: <input
        type="checkbox"
        name="summarize"
        checked={true}
      /></label
    >
    <button>Last opp</button>
  </form> -->
{/if}

<style>
label {
  display: block;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--s-3);
  margin-bottom: var(--s-4);
}
</style>

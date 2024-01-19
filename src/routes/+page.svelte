<script lang="ts">
import { base } from '$app/paths';

base;
// import { enhance } from '$app/forms';
import Dev from '$lib/components/Dev.svelte';
import Section from '$lib/components/Section.svelte';
import type { PageData } from './$types';

export let data: PageData;

function deleteSession(session: any) {
  return async () => {
    const res = await fetch(`${base}/api/session/${session.uuid}/delete`, {
      method: 'DELETE',
    });
    if (res.ok) {
      data.sessions = data.sessions.filter(s => s.uuid !== session.uuid);
    }
  };
}
</script>

<Section>
  <h2>Sessions</h2>
  <ol>
    {#each data.sessions as session}
      <li>
        {session.number}
        <button class="delete" on:click={deleteSession(session)}>Slett</button>
      </li>
    {:else}
      <li>Fant ingen sessions</li>
    {/each}
  </ol>

  <!-- <Dev>
    <details>
      <summary>Legg til ny session</summary>
      <form action="/api/session" method="POST" use:enhance>
        <label>
          Session-nummer:
          <input type="text" name="number" />
        </label>
        <button>Legg til</button>
      </form>
    </details>
  </Dev> -->
</Section>

<Section>
  <h2>Opptak</h2>
  <ol>
    {#each data.recordings as recording}
      <li>
        {recording.uuid}
        {recording.name}
      </li>
    {:else}
      <li>Fant ingen opptak</li>
    {/each}
  </ol>

  <button>Legg til</button>
</Section>

<style>
ol {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button.delete {
  background: none;
  border: none;
  color: var(--red-600);
  font-size: var(--xsmall);
}

button.delete:hover {
  background-color: var(--red-600);
  color: var(--white);
}
</style>

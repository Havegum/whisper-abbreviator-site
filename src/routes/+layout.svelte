<script lang="ts">
import 'tailwindcss/tailwind.css';
import { Pane, Splitpanes } from 'svelte-splitpanes';

import profile from '$lib/assets/profile.css?url';
import global from '$lib/assets/global.css?url';
import '$lib/assets/variables.css.ts';
import { setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import Navigation from '$lib/components/Navigation.svelte';
import type { LayoutData } from './$types';

const target: Writable<null | HTMLElement> = writable(null);
setContext('target', target);

export let data: LayoutData;

function bind(node: HTMLDivElement) {
  $target = node.parentElement;
}
</script>

<svelte:head>
  <link rel="stylesheet" href={profile} />
  <link rel="stylesheet" href={global} />
</svelte:head>

<div use:bind style:display="contents">
  <main>
    <Splitpanes>
      <Pane class="sidebar" minSize={10} snapSize={2} maxSize={40} size={10}>
        <aside><Navigation {...data} /></aside>
      </Pane>
      <Pane>
        <div class="content">
          <slot />
        </div>
      </Pane>
    </Splitpanes>
  </main>
</div>

<style>
main {
  width: 100%;
  height: 100lvh;
  background-color: var(--gray-50);
  /* display: grid; */
  /* grid-template-columns: 200px 1fr; */
  color: var(--gray-900);
  overflow: hidden;
}

main :global(.splitpanes__pane.sidebar) {
  min-width: 150px;
}

aside {
  /* grid-column: 1; */
  /* grid-row: 1 / -1; */
  /* border-right: 1px solid var(--gray-100); */
  height: 100%;
  padding: var(--s-3);
  overflow-y: auto;
  background-color: var(--white);
}

.content {
  overflow-y: auto;
  height: 100%;
  padding: var(--s-3);
}

main :global(.button) {
  background-color: var(--blue-600);
  color: var(--white);
  border-radius: 999px;
  padding: var(--s-2) var(--s-3);
  line-height: 1;
}

main :global(.button:hover) {
  background-color: var(--blue-700);
}

main :global(.button:active) {
  background-color: var(--blue-800);
}

main :global(.button.negative) {
  background-color: var(--red-600);
}

main :global(.button.negative:hover) {
  background-color: var(--red-700);
}

main :global(.button.negative:active) {
  background-color: var(--red-800);
}
</style>

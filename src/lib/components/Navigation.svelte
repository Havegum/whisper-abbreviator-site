<script lang="ts">
import NavTree, { type Node } from './NavTree.svelte';
import type { WAType } from '$lib/wa-api/api';
import type { OASModel } from 'fets';
import { base } from '$app/paths';

export let sessions: OASModel<WAType, 'Session'>[];

const root: Node[] = [
  {
    name: 'Wiki',
    path: `${base}/wiki/`,
    disabled: true,
  },

  {
    name: 'Journal',
    path: `${base}/journal/`,
  },
  {
    name: 'Map',
    path: `${base}/map/`,
  },
  {
    name: 'Chat',
    children: [
      {
        name: 'Chat agent',
        path: `${base}/chat/`,
        disabled: import.meta.env.PROD,
      },
      {
        name: 'Fastapi',
        path: `${base}/chat/fastapi/`,
        disabled: import.meta.env.PROD,
      },
      {
        name: 'Similarity',
        path: `${base}/chat/similarity/`,
        disabled: import.meta.env.PROD,
      },
    ],
  },
  {
    name: 'Sessions',
    children: sessions.map(session => ({
      name: session.number ?? 'navnløs session',
      path: `${base}/session/${session.uuid}/`,
    })),
  },
];
</script>

<nav>
  <a href={base}>
    <h2 class="title">Whisper Abbreviator</h2>
  </a>
  <NavTree nodes={root} topLevel />
</nav>

<style>
a .title {
  font-size: var(--large);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
}

a {
  display: block;
  color: var(--gray-800);
  text-decoration: none;
  border-bottom: 1px solid var(--gray-100);
  padding-bottom: var(--s-3);
  margin-bottom: var(--s-3);
}
</style>

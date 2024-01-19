<script context="module" lang="ts">
interface LeafNode {
  name: string;
  path: string;
  disabled?: boolean;
}

interface BranchNode {
  name: string;
  path?: string;
  children: Node[];
}

export type Node = LeafNode | BranchNode;
</script>

<script lang="ts">
import { page } from '$app/stores';

export let nodes: Node[];
export let topLevel = false;
</script>

<ol
  class="list-none m-0 p-0 pl-2 border-l border-gray-100"
  class:top-level={topLevel}
>
  {#each nodes as node}
    <li>
      {#if node.path && !node.disabled}
        <a
          class="relative block select-none py-1 pl-2 -ml-2 text-ellipsis overflow-hidden text-gray-700"
          href={node.path}
          class:active={node.path === $page.url.pathname}>{node.name}</a
        >
      {:else}
        <p
          class="relative block select-none py-1 pl-2 -ml-2 text-ellipsis overflow-hidden text-gray-700"
          class:disabled={node.disabled}
        >
          {node.name}
        </p>
      {/if}
      {#if node.children}
        <svelte:self nodes={node.children} />
      {/if}
    </li>
  {/each}
</ol>

<style>
a {
  margin-left: calc(var(--s-2) * -1 - 1px);
  padding-left: calc(var(--s-2) + 1px);
}

a::after {
  content: '';
  display: block;
  width: 2px;
  left: -1px;
  top: 0;
  bottom: 0;
  position: absolute;
  background-color: var(--gray-100);
  border: none;

  transition:
    width 0.2s ease-in-out,
    top 0.2s ease-in-out,
    bottom 0.2s ease-in-out;
}

a:hover {
  background-color: var(--blue-50);
  color: var(--gray-900);
}

a:hover::after {
  background-color: var(--blue-400);
  width: 3px;
}

a.active {
  color: var(--blue-800);
  font-weight: 550;
}

a.active::after {
  background-color: var(--blue);
  width: 5px;
  top: var(--s-1-5);
  bottom: var(--s-1-5);
}

a.active:hover::after {
  top: 0;
  bottom: 0;
  width: 4px;
}

ol.top-level {
  padding-left: 0;
  margin-left: 0;
  border-left: none;
}

p {
  margin-top: var(--s-3);
  margin-bottom: var(--s-1);
  font-size: var(--xsmall);
  text-transform: uppercase;

  color: var(--gray-700);
}

.disabled {
  opacity: 0.3;
  text-decoration: line-through;
}
</style>

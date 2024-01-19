<script lang="ts">
import Suggest from '$lib/nrk/Suggest.svelte';

interface CoreSuggest extends HTMLElement {
  attributeChangedCallback: (name: string) => void;
}

export let value: string = '';
export let options: string[] = [];
export let placeholder: string = '';
export let icon: string | null = null;
export let emptyMessage: string = 'Fant ingen treff';

function handleSelect(evt: CustomEvent<CustomEvent<HTMLElement>>): void {
  value = evt.detail.detail.innerText;
}

function handleInput(evt: Event): void {
  const target = evt.target as HTMLInputElement;
  const suggest = target.nextElementSibling as CoreSuggest;
  suggest.attributeChangedCallback('highlight');
}

let ul: HTMLUListElement | null = null;
let hasNoResults = false;
let hidden = true;

function handleFilter(): void {
  if (ul === null) return;
  hasNoResults = ul.querySelectorAll('li:not([hidden])').length === 0;
}

const search =
  'M62.54,55.47,51.06,44h0l-6.77-6.78a24.1,24.1,0,1,0-7.08,7.08L44,51.06h0L55.47,62.54a5,5,0,0,0,7.07-7.07ZM11.27,36.88a18.12,18.12,0,1,1,12.8,5.3A18.13,18.13,0,0,1,11.27,36.88Z';
const dropdown = 'M48.37,27.22,32,46.78,15.63,27.22Z';

function getIcon(icon: string): string {
  switch (icon) {
    case 'search':
      return search;
    case 'dropdown':
      return dropdown;
    default:
      return icon;
  }
}
</script>

<div>
  <input
    bind:value
    type="text"
    on:input={handleInput}
    {placeholder}
    class:icon={icon !== null}
  />
  <Suggest
    on:suggest.select={handleSelect}
    on:suggest.filter={handleFilter}
    bind:hidden
    {emptyMessage}
  >
    <ul bind:this={ul}>
      {#each options as option}
        <li>
          <button>{option}</button>
        </li>
      {/each}
    </ul>
  </Suggest>
  {#if !hidden && hasNoResults}
    <div class="no-results"><p>{emptyMessage}</p></div>
  {/if}

  {#if icon !== null}
    <svg aria-hidden="true" viewBox="0 0 64 64" width="1em" height="1em">
      <path d={getIcon(icon)} />
    </svg>
  {/if}
</div>

<style>
div {
  position: relative;
}

input {
  border-radius: var(--s-1);
  padding: var(--s-2) var(--s-3);
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  border-radius: var(--s-1);
  width: 100%;
  position: relative;
  z-index: 1;
  background-color: transparent;
  background-color: var(--white);
  border: 1px solid var(--gray-200);
}

input::selection {
  background-color: var(--blue-100);
  color: var(--blue-800);
}

svg {
  position: absolute;
  top: 0;
  left: var(--s-1-5);
  height: 100%;
  width: 2.25em;
  padding: var(--s-1-5) var(--s-2);
  color: inherit;
  border-right: 1px solid var(--gray-100);
  pointer-events: none;
  user-select: none;
  z-index: 1;
}

svg path {
  fill: var(--gray-700);
}

input.icon {
  padding-left: 5ch;
}

div :global(input[aria-expanded='true']) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-color: var(--gray-100);
}

input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--blue-100);
  border-color: var(--blue);
}

input:focus-visible ~ svg {
  border-color: var(--blue);
}

input:focus-visible ~ svg path {
  fill: var(--blue);
}

ul,
.no-results {
  position: absolute;
  box-shadow: 0 0 16px -8px black;
  background-color: var(--white);
  list-style-type: none;
  width: 100%;
  padding: var(--s-1) var(--s-2);
  border: 1px solid var(--gray-200);
  border-top: none;
  border-bottom-right-radius: var(--s-2);
  border-bottom-left-radius: var(--s-2);
}

.no-results {
  font-size: var(--small);
  color: var(--gray-600);
  text-align: center;
  padding: var(--s-2) var(--s-3-5);
}

button {
  display: block;
  width: calc(100% + 2 * var(--s-2));
  margin: 0 calc(-1 * var(--s-2));
  padding: var(--s-0-5) var(--s-3);
  border: 1px solid transparent;
  text-align: left;
}

div :global(mark) {
  background-color: transparent;
  font-weight: 700;
}

button:hover,
button:focus {
  background-color: var(--blue-100);
}

button:focus-visible {
  outline: none;
  background-color: var(--white);
  border: 1px solid var(--blue);
  box-shadow: 0 0 0 4px var(--blue-100);
}
</style>

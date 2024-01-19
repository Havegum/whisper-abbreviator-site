<!--
  This component is a wrapper for @nrk/core-tabs.
  Documentation for that can be found here:
  https://static.nrk.no/core-components/latest/index.html?core-tabs/readme.md
-->
<script context="module" lang="ts">
import CoreTabs from '@nrk/core-tabs';
import { browser } from '$app/environment';

if (browser && customElements.get('core-tabs') === undefined) {
  window.customElements.define(
    'core-tabs',
    CoreTabs as CustomElementConstructor,
  );
}
</script>

<script lang="ts">
import { createEventDispatcher } from 'svelte';

interface Tab extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tab: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let tab: any = undefined;

let tabsElement: Tab;
const dispatch = createEventDispatcher();
function init(node: Tab): void {
  tabsElement = node;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  node.tab = tab;

  node.addEventListener('tabs.toggle', event => {
    dispatch('toggle', event);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
$: if (tabsElement) tabsElement.tab = tab;
</script>

<core-tabs use:init>
  <slot />
</core-tabs>

<slot name="panels" />

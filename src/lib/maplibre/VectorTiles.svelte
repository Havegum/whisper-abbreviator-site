<script lang="ts">
import { writable, type Readable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { Map, StyleSpecification } from 'maplibre-gl';

export let style: StyleSpecification;

const map: Readable<Map> = getContext('map');
const labelLayerID = writable('highway_name_other');
setContext('label-layer-id', labelLayerID);

let initialized = false;
$: init($map, style);

async function init(map: Map, style: StyleSpecification) {
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }

  map.setStyle(style);
  initialized = true;
}
</script>

{#if initialized}
  <slot />
{/if}

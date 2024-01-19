<script lang="ts">
import type { Readable } from 'svelte/store';
import type {
  Map,
  RasterSourceSpecification,
  RasterLayerSpecification,
} from 'maplibre-gl';

import { getContext, onDestroy } from 'svelte';

export let url: string | undefined = undefined;
export let tiles: string[] | undefined = undefined;
export let attribution: string | undefined = undefined;
export let brightness = 1;
export let interpolation: 'nearest' | 'linear' = 'nearest';
export let opacity = 1;
export let insertBefore: null | string = null;

const sourceID = url ?? tiles?.[0];

const map: Readable<Map> = getContext('map');
const source: RasterSourceSpecification = {
  type: 'raster',
  tileSize: 256,
};
if (tiles) source.tiles = tiles;
if (url) source.url = url;

let initialized = false;
$: !initialized && init($map);

const layer: RasterLayerSpecification = {
  id: sourceID,
  type: 'raster',
  source: sourceID,
  paint: {
    'raster-resampling': interpolation,
    'raster-brightness-max': brightness,
    'raster-opacity': opacity,
  },
};

async function init(map: Map) {
  if (!map) return;
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }
  map.addSource(sourceID, source);
  map.addLayer(layer, insertBefore);
  initialized = true;
}

onDestroy(() => {
  if (!$map) return;
  $map.removeLayer(url);
  $map.removeSource(url);
});
</script>

{#if initialized}
  <slot />
{/if}

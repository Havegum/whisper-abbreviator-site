<!-- @component
  # RasterSource

  Mirrors the corresponding maplibre class.

  `id` is optional, it will be set to the source url if undefined.
-->
<script lang="ts">
import { writable, type Readable } from 'svelte/store';
import type { Map, RasterSourceSpecification, Source } from 'maplibre-gl';
import { onDestroy, getContext, setContext } from 'svelte';
const map: Readable<Map> = getContext('map');

const source = writable<Source | undefined>(undefined);
setContext('source', source);

export let id: string | undefined = undefined;

export let attribution: RasterSourceSpecification['attribution'] = undefined;
export let bounds: RasterSourceSpecification['bounds'] = undefined;
export let maxZoom: RasterSourceSpecification['maxzoom'] = undefined;
export let minZoom: RasterSourceSpecification['minzoom'] = undefined;
export let scheme: RasterSourceSpecification['scheme'] = undefined;
export let tileSize: RasterSourceSpecification['tileSize'] = undefined;
export let tiles: RasterSourceSpecification['tiles'] = undefined;
export let url: RasterSourceSpecification['url'] = undefined;
export let volatile: RasterSourceSpecification['volatile'] = undefined;

$: _id =
  id !== undefined
    ? id
    : url !== undefined
    ? url
    : tiles !== undefined
    ? tiles[0]
    : ((Math.random() * 1e10) >>> 97).toString(36);

async function init(
  map: Map,
  rasterSource: RasterSourceSpecification,
  id: string,
) {
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }

  if (!map.getSource(id)) {
    map.addSource(id, rasterSource);
  }

  $source = map.getSource(id);
}

$: rasterSource = Object.fromEntries(
  [
    ['type', 'raster'],
    ['attribution', attribution],
    ['bounds', bounds],
    ['maxzoom', maxZoom],
    ['minzoom', minZoom],
    ['scheme', scheme],
    ['tileSize', tileSize],
    ['tiles', tiles],
    ['url', url],
    ['volatile', volatile],
  ].filter(([_, value]) => value !== undefined),
) as RasterSourceSpecification;

$: init($map, rasterSource, _id);

onDestroy(() => {
  $source = undefined;

  if ($map.getSource(_id)) {
    $map
      .getStyle()
      .layers.filter((d: any) => d.source === _id)
      .forEach(layer => $map.removeLayer(layer.id));
    $map.removeSource(_id);
  }
});
</script>

{#if $source}
  <slot />
{/if}

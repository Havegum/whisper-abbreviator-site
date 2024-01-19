<!-- @component
  # GeojsonSource

  Mirrors the corresponding maplibre class.
-->
<script lang="ts">
import { writable, type Readable } from 'svelte/store';
import type {
  Map,
  GeoJSONSourceSpecification as Specification,
  Source,
} from 'maplibre-gl';
import { onDestroy, getContext, setContext, tick } from 'svelte';
const map: Readable<Map> = getContext('map');

const source = writable<Source | undefined>(undefined);
setContext('source', source);

export let id: string;

export let data: Specification['data'];
export let maxZoom: Specification['maxzoom'] = undefined;
export let attribution: Specification['attribution'] = undefined;
export let buffer: Specification['buffer'] = undefined;
export let filter: Specification['filter'] = undefined;
export let tolerance: Specification['tolerance'] = undefined;
export let cluster: Specification['cluster'] = undefined;
export let clusterRadius: Specification['clusterRadius'] = undefined;
export let clusterMaxZoom: Specification['clusterMaxZoom'] = undefined;
export let clusterMinPoints: Specification['clusterMinPoints'] = undefined;
export let clusterProperties: Specification['clusterProperties'] = undefined;
export let lineMetrics: Specification['lineMetrics'] = undefined;
export let generateId: Specification['generateId'] = undefined;
export let promoteId: Specification['promoteId'] = undefined;

async function init(map: Map, geojsonSource: Specification, id: string) {
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }

  if (!map.getSource(id)) {
    map.addSource(id, geojsonSource);
  }

  while (!map.isSourceLoaded(id)) {
    await new Promise(resolve => map.on('sourcedata', resolve));
  }

  $source = map.getSource(id);
}

$: rasterSource = Object.fromEntries(
  [
    ['type', 'geojson'],
    ['data', data],
    ['maxzoom', maxZoom],
    ['attribution', attribution],
    ['buffer', buffer],
    ['filter', filter],
    ['tolerance', tolerance],
    ['cluster', cluster],
    ['clusterRadius', clusterRadius],
    ['clusterMaxZoom', clusterMaxZoom],
    ['clusterMinPoints', clusterMinPoints],
    ['clusterProperties', clusterProperties],
    ['lineMetrics', lineMetrics],
    ['generateId', generateId],
    ['promoteId', promoteId],
  ].filter(([_, value]) => value !== undefined),
) as Specification;

$: init($map, rasterSource, id);

onDestroy(() => {
  $source = undefined;

  if ($map.getSource(id)) {
    $map
      .getStyle()
      .layers.filter((d: any) => d.source === id)
      .forEach(layer => $map.removeLayer(layer.id));
    $map.removeSource(id);
  }
});
</script>

{#if $source}
  <slot />
{/if}

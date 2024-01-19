<!-- @component
  # Layer

  This component mirrors the [maplibre layer specification](https://maplibre.org/maplibre-style-spec/layers/).

  You can use it directly, but it's likely easier to use the wrappers for specific layer types found in this project.
-->
<script lang="ts">
import { onDestroy, getContext, createEventDispatcher } from 'svelte';
import type {
  Map,
  Source,
  LayerSpecification,
  FilterSpecification,
} from 'maplibre-gl';
import type { Readable } from 'svelte/store';
const map: Readable<Map> = getContext('map');
const ctxSource: Readable<Source | null> = getContext('source');
const ctxSourceLayer: Readable<string> = getContext('source-layer');
const dispatch = createEventDispatcher();

export let id: string;
export let insertBefore: string | undefined = undefined;
export let clickable = false;

export let type: LayerSpecification['type'];
export let metadata: unknown = undefined;
export let source: string | undefined = undefined;
export let sourceLayer: string | undefined = undefined;
export let minZoom: number = 0;
export let maxZoom: number = 24;
export let layout: LayerSpecification['layout'] = {};
export let paint: LayerSpecification['paint'] = {};
export let filter: FilterSpecification | undefined = undefined;

$: if (source === undefined) source = $ctxSource?.id;
$: if (sourceLayer === undefined) sourceLayer = $ctxSourceLayer;

$: init($map);
$: $map?.getLayer(id) && $map.setFilter(id, filter);

$: updateProperties('paint', $map, id)(paint);
$: updateProperties('layout', $map, id)(layout);

function updateProperties(type: 'layout' | 'paint', map: Map, id: string) {
  if (type === 'paint') {
    return (paint: LayerSpecification['paint']) => {
      if (map.getLayer(id) === undefined) return;

      for (const [key, value] of Object.entries(paint as object)) {
        map.setPaintProperty(id, key, value);
      }
    };
  } else {
    return (layout: LayerSpecification['layout']) => {
      if (map.getLayer(id) === undefined) return;

      for (const [key, value] of Object.entries(layout as object)) {
        map.setLayoutProperty(id, key, value);
      }
    };
  }
}

async function init(map: Map) {
  if (source === undefined) throw new Error('Must have source');
  const sourceDefinition = map.getSource(source);
  if (sourceDefinition === undefined) throw new Error('Could not find source');

  const layer = {
    id,
    metadata,
    type,
    minzoom: minZoom,
    maxzoom: maxZoom,
    source,
    paint,
    layout,
  } as LayerSpecification;

  if (layer.type !== 'background') {
    if (filter) layer.filter = filter;

    if (sourceDefinition.type === 'vector') {
      layer['source-layer'] = sourceLayer;
    }
  }

  const before =
    insertBefore === undefined ? undefined : map.getLayer(insertBefore)?.id;
  map.addLayer(layer, before);

  if (clickable) {
    map.on('click', id, e => dispatch('click', e));
    map.on('mouseenter', id, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', id, () => (map.getCanvas().style.cursor = ''));
  }
}

onDestroy(() => {
  $map.getLayer(id) && $map.removeLayer(id);
});
</script>

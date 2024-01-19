<!-- @component
  # ImageSource

  Mirrors the corresponding maplibre class.

  `id` is optional, it will be set to the source url if undefined.
-->
<script lang="ts">
import { writable, type Readable } from 'svelte/store';
import type { Map, ImageSourceSpecification, Source } from 'maplibre-gl';
import { onDestroy, getContext, setContext, tick } from 'svelte';
const map: Readable<Map> = getContext('map');

const source = writable<Source | undefined>(undefined);
setContext('source', source);

export let id: string | undefined = undefined;

export let url: ImageSourceSpecification['url'];
export let coordinates: ImageSourceSpecification['coordinates'];

$: _id =
  id !== undefined
    ? id
    : url !== undefined
    ? url
    : ((Math.random() * 1e10) >>> 97).toString(36);

async function init(
  map: Map,
  imageSource: ImageSourceSpecification,
  id: string,
) {
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }

  if (!map.getSource(id)) {
    map.addSource(id, imageSource);
  }

  $source = map.getSource(id);
}

$: init($map, { type: 'image', url, coordinates }, _id);

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

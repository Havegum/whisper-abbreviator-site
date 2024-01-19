<script>
import { getContext, onDestroy } from 'svelte';
const map = getContext('map');
const config = getContext('config');

export let url;
export let attribution;
export let exaggeration = 1;
export let hillshade = true;
export let hillshadeExaggeration = 0.15;
export let insertBefore = 'water_way';

if (config) {
  exaggeration = $config.terrainLayer?.exaggeration ?? 1;
  hillshade = $config.terrainLayer?.hillshade ?? true;
  hillshadeExaggeration = $config.terrainLayer?.hillshadeExaggeration ?? 0.15;
}

$: if (config) {
  exaggeration = $config.terrainLayer?.exaggeration ?? 1;
  hillshade = $config.terrainLayer?.hillshade ?? true;
  hillshadeExaggeration = $config.terrainLayer?.hillshadeExaggeration ?? 0.15;
}

let initialized = false;
$: !initialized && init($map);

const source = {
  type: 'raster-dem',
  tiles: [url],
  tileSize: 256,
  attribution,
};

const terrain = {
  source: url,
  exaggeration,
};

$: $map.getSource(url) &&
  $map?.setTerrain({
    source: url,
    exaggeration,
  });

$: $map.getLayer('hillshading') &&
  $map.setPaintProperty(
    'hillshading',
    'hillshade-exaggeration',
    hillshadeExaggeration
  );

const hillshadeLayer = {
  id: 'hillshading',
  source: url,
  type: 'hillshade',
  paint: {
    'hillshade-exaggeration': hillshadeExaggeration,
  },
};

async function init(map) {
  if (!map) return;
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }

  if (!map.getSource(url)) {
    map.addSource(url, source);
    map.setTerrain(terrain);
    if (hillshade) {
      if (map.getLayer(insertBefore)) {
        map.addLayer(hillshadeLayer, insertBefore);
      } else {
        map.addLayer(hillshadeLayer);
      }
    }
    initialized = true;
  }

  map.redraw();
}

onDestroy(() => {
  $map?.setTerrain(null);
  $map?.getLayer('hillshading') && $map.removeLayer('hillshading');
  $map?.getSource(url) && $map.removeSource(url);
});
</script>

{#if initialized}
  <slot />
{/if}

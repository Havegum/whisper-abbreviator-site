<script lang="ts">
// @ts-ignore
import ard from './ard.geojson';
// @ts-ignore
import labels from './georeferenced-entities.geojson';
import GeojsonSource from '$lib/maplibre/GeojsonSource.svelte';
import Map from '$lib/maplibre/Map.svelte';
import LineLayer from '$lib/maplibre/LineLayer.svelte';
import SymbolLayer from '$lib/maplibre/SymbolLayer.svelte';
import { Popup } from 'maplibre-gl';
import RasterSource from '$lib/maplibre/RasterSource.svelte';
import RasterLayer from '$lib/maplibre/RasterLayer.svelte';
import MapImage from '$lib/maplibre/MapImage.svelte';

const icons = Object.entries(
  import.meta.glob('./icons/*.png', {
    eager: true,
    import: 'default',
  }),
).map(([key, value]) => ({
  id: key.split('/').pop().split('.').shift() as string,
  href: value as string,
}));

let showRaster = true;
let showVector = false;

const maxBounds = [
  [7.568, -18.049], // Southwest coordinates
  [50.255, 17.93], // Northeast coordinates
];

let ready = false; // HACK.
setTimeout(() => (ready = true), 200); // TODO: fix

function handleFeatureClick(event: CustomEvent) {
  const map = event.detail.target;
  const feature = event.detail.features[0];

  const coordinates = feature.geometry.coordinates.slice();
  // const description = feature.properties.description;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  console.log(event);

  while (Math.abs(event.detail.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += event.detail.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  new Popup()
    .setLngLat(coordinates)
    .setHTML(JSON.parse(feature.properties.notes).join('\n'))
    .addTo(map);
}

const base = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://halvard.vegum.no/integrations/west-marches-map';
</script>

<div class="outer">
  <div class="map">
    <Map
      {maxBounds}
      lonLat={[29.0626983, -11.8795933]}
      minZoom={2}
      maxZoom={23.5}
      zoom={14}
      unlockable={false}
      unlocked={true}
      hash={true}
    >
      {#each icons as source}
        <MapImage id={source.id} imageURL={source.href} sdf={true} />
      {/each}

      {#if ready && showRaster}
        <RasterSource
          tiles={[`${base}/world-map/{z}/{x}/{y}.png`]}
          attribution="Kart: Marius Strømmen"
          tileSize={256}
        >
          <RasterLayer id="world-map" />
        </RasterSource>

        <RasterSource
          tiles={[`${base}/region-map/{z}/{x}/{y}.png`]}
          minZoom={5}
          attribution="Kart: Marius Strømmen"
          tileSize={256}
        >
          <RasterLayer
            id="region-map"
            minZoom={5}
            resampling="nearest"
            opacity={['interpolate', ['linear'], ['zoom'], 5, 0, 6, 1]}
          />
        </RasterSource>

        <RasterSource
          tiles={[`${base}/camp-map/{z}/{x}/{y}.png`]}
          minZoom={5}
          attribution="Kart: Marius Strømmen"
          tileSize={256}
        >
          <RasterLayer
            id="camp-map"
            minZoom={14}
            opacity={['interpolate', ['linear'], ['zoom'], 15, 0, 16, 1]}
          />
        </RasterSource>

        <GeojsonSource id="ard" data={ard}>
          <LineLayer
            id="ard-lines"
            width={2}
            color="red"
            dasharray={[2, 2]}
            opacity={['interpolate', ['linear'], ['zoom'], 5, 1, 6, 0]}
          />
        </GeojsonSource>

        <GeojsonSource id="labels" data={labels}>
          <SymbolLayer
            id="labels-text"
            clickable={true}
            on:click={handleFeatureClick}
            iconImage="diamond"
            iconColor="#831102"
            iconHaloColor="white"
            iconHaloWidth={0.6}
            iconHaloBlur={2}
          />
          <!-- textFont={['Inter-SemiBold']}
          textField={'{name}'}
          textVariableAnchor={['left', 'right', 'top', 'bottom']}
          textJustify="auto"
          textRadialOffset={0.6}
          textColor="#4e1109"
          textLineHeight={1}
          textSize={12}
          textHaloColor="white"
          textHaloWidth={0.6}
          textHaloBlur={1}
          textOptional={true} -->
        </GeojsonSource>
      {/if}

      <!-- {#if showVector}
        <OsmRender data={osm} id="osm-render" />
      {/if} -->
    </Map>
  </div>
</div>

<!-- <div class="control-panel">
    <label>
      <input type="checkbox" bind:checked={showRaster} />
      Vis rastertiles</label
    >
  
    <label>
      <input type="checkbox" bind:checked={showVector} />
      Vis vektortiles</label
    >
  </div> -->

<style>
.outer {
  margin: calc(var(--s-3) * -1);
  width: calc(100% + 2 * var(--s-3));
  height: calc(100% + 2 * var(--s-3));
}
.map {
  width: 100%;
  height: 100%;

  background-color: #fff5e8;
}
</style>

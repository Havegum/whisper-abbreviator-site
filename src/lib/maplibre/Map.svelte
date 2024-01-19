<script context="module">
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

export const map = writable(null);
</script>

<script>
import { writable } from 'svelte/store';
import { setContext, tick } from 'svelte';
import { Map, NavigationControl } from 'maplibre-gl';
import { browser } from '$app/environment';

export let lonLat;

export let unlockable = true;
export let zoom = 13;
export let bearing = 0;
export let pitch = 0;
export let unlocked = false;
export let minZoom = 0;
export let maxZoom = 24;
export let hash = false;
export let customAttribution = undefined;
export let attributionControl = false;
let grabbing = false;
export let maxBounds = undefined;

setContext('map', map);

const zoomContext = writable(zoom);
setContext('zoom', zoomContext);

function attachMap(node) {
  const mapInstance = new Map({
    container: node,
    center: lonLat,
    maxBounds,
    zoom,
    bearing,
    pitch,
    minZoom,
    maxZoom,
    customAttribution,
    attributionControl,
    style: {
      version: 8,
      name: 'font',
      sources: {},
      layers: [],
      glyphs: 'https://maps.vgc.no/api/fonts/{fontstack}/{range}.pbf',
    },
    hash,
    interactive: unlocked,
  });

  mapInstance.on('zoom', () => zoomContext.set(mapInstance.getZoom()));

  mapInstance.on('moveend', () => {
    const { lng, lat } = mapInstance.getCenter();
    lonLat = [lng, lat];
    zoom = mapInstance.getZoom();
    bearing = mapInstance.getBearing();
    pitch = mapInstance.getPitch();
  });

  (async () => {
    await new Promise(resolve => mapInstance.on('load', resolve));
    map.set(mapInstance);

    await tick();
    mapInstance.resize();
  })();
}

$: if ($map) {
  const fn = unlocked ? 'enable' : 'disable';
  const controls = [
    'boxZoom',
    'scrollZoom',
    'dragPan',
    'dragRotate',
    'keyboard',
    'doubleClickZoom',
    'touchZoomRotate',
    'touchPitch',
  ];

  controls.forEach(c => $map[c][fn]());
}

let navigationControl;
if (browser) {
  navigationControl = new NavigationControl({
    showZoom: true,
    showCompass: false,
  });
}

$: if ($map && browser) {
  if (unlocked) {
    $map.addControl(navigationControl, 'top-left');
  } else {
    if ($map.hasControl(navigationControl)) {
      $map.removeControl(navigationControl);
    }
  }
}
</script>

<div
  class="map"
  class:grabbing
  class:unlocked
  use:attachMap
  on:pointerdown={() => (grabbing = true)}
  on:pointerup={() => (grabbing = false)}
  on:pointercancel={() => (grabbing = false)}
>
  {#if unlockable}
    <button
      class:lock-button={unlocked}
      on:click={() => (unlocked = !unlocked)}
    >
      {unlocked ? 'Lås kart' : 'Utforsk kart'}
    </button>
    <div class="locked-screen" class:visible={!unlocked} />
  {/if}
  {#if $map}
    <slot />
  {/if}
</div>

<style>
.map {
  width: 100%;
  height: 100%;
  border-top-left-radius: var(--s-1);
  border-top-right-radius: var(--s-1);
  position: relative;
  font-family: inherit;
}

.unlocked.grabbing {
  cursor: grabbing;
}

.unlocked {
  cursor: grab;
}

.map :global(.maplibregl-control-container details) {
  color: var(--gray-shade-4);
}

.map :global(.maplibregl-ctrl-attrib) {
  font-family: var(--sans);
}

button {
  position: absolute;
  cursor: pointer;
  pointer-events: all;
  bottom: var(--s-5);
  right: 50%;
  transform: translate(50%, 50%);
  border-radius: 999px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--gray-tint-4);
  background-color: white;
  color: var(--gray-shade-1);
  padding: var(--s-1-5) var(--s-3-5);
  z-index: 4;
  font-size: var(--medium);
  /* prettier-ignore */
  transition:
      color 200ms,
      border-color 200ms,
      background-color 200ms,
      right 750ms var(--ease-expo-out),
      bottom 750ms var(--ease-expo-out),
      transform 750ms var(--ease-expo-out);
}

button:hover {
  color: var(--blue-shade-4);
  border-color: var(--blue-tint-3);
  background-color: var(--blue-tint-4);
}

button:focus-visible {
  outline: 3px solid var(--blue-tint-1);
  border-color: var(--blue-tint-1);
  color: var(--blue-shade-1);
}

.lock-button {
  right: var(--s-3);
  bottom: var(--s-3);
  top: auto;
  transform: translate(0%, 0%);
}

button::before,
button::after {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
  display: block;
  border-radius: 999px;
  content: '';
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms;
}

button::after {
  opacity: 0.2;
  box-shadow: 0 1px 2px 1px black;
}

button:hover::after {
  opacity: 0;
}

button::before {
  box-shadow: 0 2px 8px 0 black;
}

button:hover::before {
  opacity: 0.2;
}

.locked-screen {
  width: 100%;
  height: 50%;
  position: absolute;
  left: 0;
  bottom: 0;
  background-image: linear-gradient(
    to top,
    hsl(0, 0%, 0%) 0%,
    hsla(0, 0%, 0%, 0.987) 8.1%,
    hsla(0, 0%, 0%, 0.951) 15.5%,
    hsla(0, 0%, 0%, 0.896) 22.5%,
    hsla(0, 0%, 0%, 0.825) 29%,
    hsla(0, 0%, 0%, 0.741) 35.3%,
    hsla(0, 0%, 0%, 0.648) 41.2%,
    hsla(0, 0%, 0%, 0.55) 47.1%,
    hsla(0, 0%, 0%, 0.45) 52.9%,
    hsla(0, 0%, 0%, 0.352) 58.8%,
    hsla(0, 0%, 0%, 0.259) 64.7%,
    hsla(0, 0%, 0%, 0.175) 71%,
    hsla(0, 0%, 0%, 0.104) 77.5%,
    hsla(0, 0%, 0%, 0.049) 84.5%,
    hsla(0, 0%, 0%, 0.013) 91.9%,
    hsla(0, 0%, 0%, 0) 100%
  );
  opacity: 0;
  z-index: 3;
  transition: opacity 500ms;
  pointer-events: none;
}

.locked-screen.visible {
  pointer-events: all;
  opacity: 0.3;
}
</style>

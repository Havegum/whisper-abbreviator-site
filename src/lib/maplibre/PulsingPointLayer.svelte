<script lang="ts">
import type { Map, Source } from 'maplibre-gl';
import type { Readable } from 'svelte/store';
import colors from '$lib/assets/colors';
const { red } = colors;
import { onDestroy, getContext } from 'svelte';
import { expoInOut as easing } from 'svelte/easing';
import { Color } from '@maplibre/maplibre-gl-style-spec';

const map: Readable<Map> = getContext('map');
const source: Readable<Source> = getContext('source');

export let id: string;
export let duration = 2500;
export let radius = 30;
export let pulseRadius = 1;
export let coreRadius = 0.5;
let _color = red.base;
export { _color as color };

const setAlpha = ({ r, g, b }, a: number) =>
  `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
    b * 255,
  )},${a})`;

const color: Color | void = Color.parse(_color);
const size = (radius + pulseRadius * radius) * 2;
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d', { willReadFrequently: true });
  },

  render: function () {
    if (!color) return;
    const { width, height, context } = this;

    const pulseAlpha = 0.333;

    const i = (performance.now() % duration) / duration;
    const t = easing(i);
    const outerRadius = radius + t * radius * pulseRadius;

    const x = width / 2;
    const y = height / 2;

    // draw outer circle
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.arc(x, y, outerRadius, 0, Math.PI * 2);

    const outerCircleColor = setAlpha(color, pulseAlpha * (1 - t));

    context.fillStyle = outerCircleColor;
    context.fill();

    // draw inner circle
    const innerCircleRadius = radius - (1 - t) * (1 - coreRadius) * radius;
    context.beginPath();
    context.arc(x, y, innerCircleRadius, 0, Math.PI * 2);

    const innerCircleColor = setAlpha(
      color,
      pulseAlpha + (1 - t) * (1 - pulseAlpha),
    );
    context.fillStyle = innerCircleColor;
    context.fill();

    // draw core
    context.beginPath();
    context.arc(x, y, radius * coreRadius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();

    this.data = context.getImageData(0, 0, width, height).data;

    // continuously repaint the map, resulting in the smooth animation of the dot
    $map.triggerRepaint();

    return true; // return true to tell the map the image was updated
  },
};

$: init($map);

async function init(map: Map) {
  if (!map.isStyleLoaded()) {
    await new Promise(resolve => map.on('styledata', resolve));
  }

  const img_id = `${id}-pulsing-dot`;
  if (map.hasImage(img_id)) {
    map.removeImage(img_id);
  }
  map.addImage(img_id, pulsingDot, { pixelRatio: 2 });

  console.log($source);

  const layer = {
    id,
    type: 'symbol',
    source: $source.id,
    layout: {
      'icon-image': img_id,
    },
  };

  map.addLayer(layer);
}

onDestroy(() => {
  $map.getLayer(id) && $map.removeLayer(id);
});
</script>

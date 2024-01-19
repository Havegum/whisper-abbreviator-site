<script context="module">
import { writable } from 'svelte/store';
export let selected = writable(null);
</script>

<script>
import { select } from 'd3-selection';
import {
  annotation as d3annotation,
  annotationLabel,
  annotationCalloutCircle,
  annotationCustomType,
} from 'd3-svg-annotation';

import maplibre from 'maplibre-gl';
const { Marker } = maplibre;
import { onDestroy, getContext } from 'svelte';
const map = getContext('map');
const zoom = getContext('zoom');
const dev = getContext('dev');

let settings;
export { settings as annotation };

// ### SETTINGS ###
settings.lngLat;
settings.minZoom = settings.minZoom !== undefined ? settings.minZoom : 1;
settings.maxZoom = settings.maxZoom !== undefined ? settings.maxZoom : NaN;
settings.title = settings.title !== undefined ? settings.title : '';
settings.label = settings.label !== undefined ? settings.label : '';
settings.dy = settings.dy !== undefined ? settings.dy : 50;
settings.dx = settings.dx !== undefined ? settings.dx : 50;
// prettier-ignore
settings.textPadding = settings.textPadding !== undefined ? settings.textPadding : 10;
// prettier-ignore
settings.textWidth = settings.textWidth !== undefined ? settings.textWidth : 120;
settings.end = settings.end !== undefined ? settings.end : 'arrow'; // 'arrow' | 'dot' | null
// prettier-ignore
settings.connectorType = settings.connectorType !== undefined ? settings.connectorType : 'elbow'; // null | 'line' | 'elbow' | ('curve')
settings.lineType = settings.lineType !== undefined ? settings.lineType : null; // null | 'horizontal' | 'vertical'
settings.circle = settings.circle !== undefined ? settings.circle : false;
// prettier-ignore
settings.circleRadius = settings.circleRadius !== undefined ? settings.circleRadius : 25;
// prettier-ignore
settings.circleRadiusPadding = settings.circleRadiusPadding !== undefined ? settings.circleRadiusPadding : 5;
settings.align = settings.align !== undefined ? settings.align : 'dynamic';
// prettier-ignore
settings.orientation = settings.orientation !== undefined ? settings.orientation : 'topBottom';
// prettier-ignore
settings.strokeWidth = settings.strokeWidth !== undefined ? settings.strokeWidth : 1;
// prettier-ignore
settings.subjectDasharray = settings.subjectDasharray !== undefined ? settings.subjectDasharray : '';

settings.stroke ||= 'rgba(60, 60, 60, 1)';
settings.textFill ||= 'rgba(60, 60, 60, 1)';
settings.textStroke ||= 'rgba(255, 255, 255, 1)';
settings.textBoxFill ||= 'rgba(255, 255, 255, 0)';
settings.textBoxStroke ||= 'rgba(60, 60, 60, 0)';
settings.circleFill ||= 'rgba(60, 60, 60, 0)';
// ################

let marker, element, annotation;
$: init($map, element);
$: isSelected = $selected === settings;
$: devUpdate(), $selected;

function getAnnotationSettings(s) {
  return {
    dy: s.dy,
    dx: s.dx,
    note: {
      title: s.title || ' ',
      label: s.label || ' ',
      padding: s.textPadding,
      bgPadding: s.textPadding,
      wrap: s.textWidth,
      lineType: s.lineType,
      align: s.align,
      orientation: s.orientation,
    },
    type: new annotationCustomType(
      s.circle ? annotationCalloutCircle : annotationLabel,
      {
        connector: s.connectorType && {
          end: s.end,
          type: s.connectorType,
        },
        disable: [s.connectorType === null && 'connector'],
      }
    ),
    subject: s.circle
      ? {
          radius: s.circleRadius,
          radiusPadding: s.circleRadiusPadding,
        }
      : null,
  };
}

async function init(map, element) {
  if (!element || !map) return;
  marker = new Marker({ element }).setLngLat(settings.lngLat).addTo(map);

  annotation = d3annotation()
    .editMode(isSelected)
    .annotations([getAnnotationSettings(settings)]);

  const svg = select(element).select('svg');
  // @ts-ignore
  svg.call(annotation);
}

function handleSelect() {
  if (!dev) return;
  $selected = settings;

  $map.once('click', () => {
    if (isSelected) $selected = null;
  });
}

function devUpdate() {
  if (!annotation || !marker || !dev) return;
  if (isSelected) {
    if ($selected.circle && !settings.circle) $selected.lineType = 'horizontal';
    settings = $selected;
  }

  marker.setDraggable(isSelected).on('dragend', function (event) {
    const { lng, lat } = event.target.getLngLat();
    $selected.lngLat = settings.lngLat = [
      // https://xkcd.com/2170/
      +lng.toPrecision(7),
      +lat.toPrecision(7),
    ];

    event.target.setLngLat(settings.lngLat);
  });

  annotation
    .editMode(isSelected)
    .annotations([getAnnotationSettings(settings)])
    .update()
    .on('dragend', e => {
      if (isSelected) {
        $selected.dx = settings.dx = e.dx;
        $selected.dy = settings.dy = e.dy;
      }
    });
}

$: colors = `
  --stroke: ${settings.stroke};
  --text-fill: ${settings.textFill};
  --text-stroke: ${settings.textStroke};
  --text-box-fill: ${settings.textBoxFill};
  --text-box-stroke: ${settings.textBoxStroke};
  --circle-fill: ${settings.circleFill};
  --stroke-width: ${settings.strokeWidth}px;
  --subject-dasharray: ${settings.subjectDasharray};
`
  .replace(/\s+/, '')
  .trim();

onDestroy(() => marker && marker.remove());
</script>

<div class="container" aria-hidden={!marker}>
  <div
    class="marker"
    bind:this={element}
    on:pointerdown={handleSelect}
    aria-hidden={$zoom < (settings.minZoom ?? NaN) ||
      (settings.maxZoom ?? NaN) < $zoom}
  >
    {#if isSelected}
      <div class="drag-handle" />
    {/if}
    <svg
      style={colors}
      class:no-line={!settings.lineType}
      width="1px"
      height="1px"
    />
  </div>
</div>

<style>
.container {
  display: contents;
}

.container[aria-hidden='true'] {
  display: none;
}

.marker {
  opacity: 1;
  transition: opacity 200ms;
}

.marker[aria-hidden='true'] {
  opacity: 0;
  user-select: none;
  pointer-events: none;
}

.drag-handle {
  width: var(--s-4);
  height: var(--s-4);
  border-radius: var(--s-3);
  background-color: #0001;
  border: 1px dashed #0009;
}

svg,
.drag-handle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

svg {
  overflow: visible;
  display: block;
  max-width: unset;
}

svg :global(text) {
  font-family: var(--sans);
  font-weight: 500;
  fill: var(--text-fill);
  stroke: var(--text-stroke);
  stroke-opacity: 0.75;
  stroke-width: 5px;
  paint-order: stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
}

svg :global(.annotation-note-title) {
  font-weight: 800;
  shape-rendering: crispEdges;
}

svg :global(.annotation-subject .handle) {
  display: none;
}

svg :global(.annotation-note-bg) {
  fill: var(--text-box-fill);
  fill-opacity: 1;
  stroke: var(--text-box-stroke);
}

svg :global(.annotation-connector .connector),
svg :global(.note-line) {
  stroke: var(--stroke);
  stroke-width: var(--stroke-width);
  stroke-linecap: square;
  stroke-linejoin: miter;
}

svg :global(.annotation-connector .connector-end) {
  fill: var(--stroke);
  stroke: var(--stroke);
  stroke-linejoin: miter;
  stroke-width: var(--stroke-width);
}

svg :global(.annotation-subject .subject) {
  fill: var(--circle-fill);
  fill-opacity: 1;
  stroke: var(--stroke);
  stroke-width: var(--stroke-width);
  stroke-dasharray: var(--subject-dasharray);
  stroke-linejoin: round;
  stroke-linecap: round;
}

.no-line :global(.note-line) {
  visibility: hidden;
}
</style>

<!-- @component
  # CircleLayer
  This component mirrors the style specification for [maplibre circle layers](https://maplibre.org/maplibre-style-spec/layers/#circle) with two modification:

  * The "circle-"-prefix is omitted: `circle-color` is just `color`.
  * Properties are camel case: `circle-translate-anchor` is `translateAnchor`.
-->
<script lang="ts">
import { getContext } from 'svelte';
import type {
  FilterSpecification,
  CircleLayerSpecification,
} from 'maplibre-gl';

type Paint = Exclude<CircleLayerSpecification['paint'], undefined>;
type Layout = Exclude<CircleLayerSpecification['layout'], undefined>;

import type { Readable } from 'svelte/store';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

export let id: string;

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let blur: Paint['circle-blur'] = undefined;
export let color: Paint['circle-color'] = undefined;
export let opacity: Paint['circle-opacity'] = undefined;
export let pitchAlignment: Paint['circle-pitch-alignment'] = undefined;
export let pitchScale: Paint['circle-pitch-scale'] = undefined;
export let radius: Paint['circle-radius'] = undefined;
export let strokeColor: Paint['circle-stroke-color'] = undefined;
export let strokeOpacity: Paint['circle-stroke-opacity'] = undefined;
export let strokeWidth: Paint['circle-stroke-width'] = undefined;
export let translate: Paint['circle-translate'] = undefined;
export let translateAnchor: Paint['circle-translate-anchor'] = undefined;

export let sortKey: Layout['circle-sort-key'] = undefined;
export let visibility: Layout['visibility'] = undefined;

$: paint = Object.fromEntries(
  [
    ['circle-blur', blur],
    ['circle-color', color],
    ['circle-opacity', opacity],
    ['circle-pitch-alignment', pitchAlignment],
    ['circle-pitch-scale', pitchScale],
    ['circle-radius', radius],
    ['circle-stroke-color', strokeColor],
    ['circle-stroke-opacity', strokeOpacity],
    ['circle-stroke-width', strokeWidth],
    ['circle-translate', translate],
    ['circle-translate-anchor', translateAnchor],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = Object.fromEntries(
  [
    ['circle-sort-key', sortKey],
    ['visibility', visibility],
  ].filter(([_, value]) => value !== undefined),
) as Layout;
</script>

<Layer
  type="circle"
  {id}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

<!-- @component
  # LineLayer

  This component mirrors the style specification for [maplibre line layers](https://maplibre.org/maplibre-style-spec/layers/#line) with two modification:

  * The "line-"-prefix is omitted: `line-color` is just `color`.
  * Properties are camel case: `line-translate-anchor` is `translateAnchor`.
-->
<script lang="ts">
import type { LineLayerSpecification, FilterSpecification } from 'maplibre-gl';
import { getContext } from 'svelte';
import type { Readable } from 'svelte/store';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

type Paint = Exclude<LineLayerSpecification['paint'], undefined>;
type Layout = Exclude<LineLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let width: Paint['line-width'] = undefined;
export let color: Paint['line-color'] = undefined;
export let opacity: Paint['line-opacity'] = undefined;
export let dasharray: Paint['line-dasharray'] = undefined;
export let gapWidth: Paint['line-gap-width'] = undefined;
export let offset: Paint['line-offset'] = undefined;
export let translate: Paint['line-translate'] = undefined;
export let translateAnchor: Paint['line-translate-anchor'] = undefined;
export let blur: Paint['line-blur'] = undefined;
export let gradient: Paint['line-gradient'] = undefined;
export let pattern: Paint['line-pattern'] = undefined;

export let visibility: Layout['visibility'] = undefined;
export let cap: Layout['line-cap'] = 'round';
export let join: Layout['line-join'] = 'round';
export let miterLimit: Layout['line-miter-limit'] = undefined;
export let roundLimit: Layout['line-round-limit'] = undefined;
export let sortKey: Layout['line-sort-key'] = undefined;

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;

$: paint = Object.fromEntries(
  [
    ['line-width', width],
    ['line-color', color],
    ['line-opacity', opacity],
    ['line-dasharray', dasharray],
    ['line-gap-width', gapWidth],
    ['line-offset', offset],
    ['line-translate', translate],
    ['line-translate-anchor', translateAnchor],
    ['line-blur', blur],
    ['line-gradient', gradient],
    ['line-pattern', pattern],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = Object.fromEntries(
  [
    ['line-sort-key', sortKey],
    ['line-cap', cap],
    ['line-join', join],
    ['line-miter-limit', miterLimit],
    ['line-round-limit', roundLimit],
    ['visibility', visibility],
  ].filter(([_, value]) => value !== undefined),
) as Layout;
</script>

<Layer
  type="line"
  {id}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

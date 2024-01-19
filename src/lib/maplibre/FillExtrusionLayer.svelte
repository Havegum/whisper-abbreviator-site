<!-- @component
  # FillExtrusionLayer

  This component mirrors the style specification for [maplibre fill-extrusion layers](https://maplibre.org/maplibre-style-spec/layers/#fill-extrusion) with two modification:

  * The "fill-extrusion-"-prefix is omitted: `fill-extrusion-color` is just `color`.
  * Properties are camel case: `fill-extrusion-translate-anchor` is `translateAnchor`.
-->
<script lang="ts">
import { getContext } from 'svelte';
import type {
  FillExtrusionLayerSpecification,
  FilterSpecification,
} from 'maplibre-gl';
import type { Readable } from 'svelte/store';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

type Paint = Exclude<FillExtrusionLayerSpecification['paint'], undefined>;
type Layout = Exclude<FillExtrusionLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let base: Paint['fill-extrusion-base'] = undefined;
export let color: Paint['fill-extrusion-color'] = undefined;
export let height: Paint['fill-extrusion-height'] = undefined;
export let opacity: Paint['fill-extrusion-opacity'] = undefined;
export let pattern: Paint['fill-extrusion-pattern'] = undefined;
export let translate: Paint['fill-extrusion-translate'] = undefined;
export let translateAnchor: Paint['fill-extrusion-translate-anchor'] =
  undefined;
export let verticalGradient: Paint['fill-extrusion-vertical-gradient'] =
  undefined;
export let visibility: Layout['visibility'] = undefined;

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;

$: paint = Object.fromEntries(
  [
    ['fill-extrusion-base', base],
    ['fill-extrusion-color', color],
    ['fill-extrusion-height', height],
    ['fill-extrusion-opacity', opacity],
    ['fill-extrusion-pattern', pattern],
    ['fill-extrusion-translate', translate],
    ['fill-extrusion-translate-anchor', translateAnchor],
    ['fill-extrusion-vertical-gradient', verticalGradient],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = { visibility } as Layout;
</script>

<Layer
  type="fill-extrusion"
  {id}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

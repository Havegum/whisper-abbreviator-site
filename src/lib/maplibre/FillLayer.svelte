<!-- @component
  # FillLayer

  This component mirrors the style specification for [maplibre line layers](https://maplibre.org/maplibre-style-spec/layers/#fill) with two modification:

  * The "fill-"-prefix is omitted: `fill-color` is just `color`.
  * Properties are camel case: `fill-translate-anchor` is `translateAnchor`.
-->
<script lang="ts">
import { getContext } from 'svelte';
import type { FillLayerSpecification, FilterSpecification } from 'maplibre-gl';
import type { Readable } from 'svelte/store';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

type Paint = Exclude<FillLayerSpecification['paint'], undefined>;
type Layout = Exclude<FillLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let color: Paint['fill-color'] = undefined;
export let opacity: Paint['fill-opacity'] = 1;
export let outlineColor: Paint['fill-outline-color'] = undefined;
export let pattern: Paint['fill-pattern'] = undefined;
export let antialias: Paint['fill-antialias'] = undefined;
export let translate: Paint['fill-translate'] = undefined;
export let translateAnchor: Paint['fill-translate-anchor'] = undefined;

export let sortKey: Layout['fill-sort-key'] = undefined;
export let visibility: Layout['visibility'] = 'visible';

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;

$: paint = Object.fromEntries(
  [
    ['fill-color', color],
    ['fill-opacity', opacity],
    ['fill-outline-color', outlineColor],
    ['fill-pattern', pattern],
    ['fill-antialias', antialias],
    ['fill-translate', translate],
    ['fill-translate-anchor', translateAnchor],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = Object.fromEntries(
  [
    ['fill-sort-key', sortKey],
    ['visibility', visibility],
  ].filter(([_, value]) => value !== undefined),
) as Layout;
</script>

<Layer
  type="fill"
  {id}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

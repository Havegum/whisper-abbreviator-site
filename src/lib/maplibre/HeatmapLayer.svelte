<!-- @component
  # HeatmapLayer

  This component mirrors the style specification for [maplibre heatmap layers](https://maplibre.org/maplibre-style-spec/layers/#heatmap) with one modification:

  * The "heatmap-"-prefix is omitted: `heatmap-color` is just `color`.
-->
<script lang="ts">
import type {
  FilterSpecification,
  HeatmapLayerSpecification,
} from 'maplibre-gl';
import type { Readable } from 'svelte/store';
import { getContext } from 'svelte';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

type Paint = Exclude<HeatmapLayerSpecification['paint'], undefined>;
type Layout = Exclude<HeatmapLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let color: Paint['heatmap-color'] = undefined;
export let intensity: Paint['heatmap-intensity'] = undefined;
export let opacity: Paint['heatmap-opacity'] = undefined;
export let radius: Paint['heatmap-radius'] = undefined;
export let weight: Paint['heatmap-weight'] = undefined;
export let visibility: Layout['visibility'] = 'visible';

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;

$: paint = Object.fromEntries(
  [
    ['heatmap-color', color],
    ['heatmap-intensity', intensity],
    ['heatmap-opacity', opacity],
    ['heatmap-radius', radius],
    ['heatmap-weight', weight],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = { visibility: visibility } as Layout;
</script>

<Layer
  type="heatmap"
  {id}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

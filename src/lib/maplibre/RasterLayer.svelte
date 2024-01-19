<!-- @component
  # RasterLayer

  This component mirrors the style specification for [maplibre raster layers](https://maplibre.org/maplibre-style-spec/layers/#raster) with two modifications:

  * The "raster-"-prefix is omitted: `raster-opacity` is just `opacity`.
  * Properties are camel case: `raster-brightness-max` is `brightnessMax`.
-->
<script lang="ts">
import type {
  FilterSpecification,
  RasterLayerSpecification,
} from 'maplibre-gl';
import type { Readable } from 'svelte/store';
import { getContext } from 'svelte';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

type Paint = Exclude<RasterLayerSpecification['paint'], undefined>;
type Layout = Exclude<RasterLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let brightnessMax: Paint['raster-brightness-max'] = undefined;
export let brightnessMin: Paint['raster-brightness-min'] = undefined;
export let contrast: Paint['raster-contrast'] = undefined;
export let fadeDuration: Paint['raster-fade-duration'] = undefined;
export let hueRotate: Paint['raster-hue-rotate'] = undefined;
export let opacity: Paint['raster-opacity'] = undefined;
export let resampling: Paint['raster-resampling'] = undefined;
export let saturation: Paint['raster-saturation'] = undefined;
export let visibility: Layout['visibility'] = undefined;

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;

$: paint = Object.fromEntries(
  [
    ['raster-brightness-max', brightnessMax],
    ['raster-brightness-min', brightnessMin],
    ['raster-contrast', contrast],
    ['raster-fade-duration', fadeDuration],
    ['raster-hue-rotate', hueRotate],
    ['raster-opacity', opacity],
    ['raster-resampling', resampling],
    ['raster-saturation', saturation],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = Object.fromEntries(
  [['visibility', visibility]].filter(([_, value]) => value !== undefined),
) as Layout;
</script>

<Layer
  type="raster"
  {id}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

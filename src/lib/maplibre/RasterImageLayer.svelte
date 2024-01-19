<script lang="ts">
import { getContext } from 'svelte';
import type { AttributionStore } from '../Attribution.svelte';
import RasterLayer from './RasterLayer.svelte';
import ImageSource from './ImageSource.svelte';

import type {
  ImageSourceSpecification,
  RasterLayerSpecification,
} from 'maplibre-gl';

type Paint = Exclude<RasterLayerSpecification['paint'], undefined>;
type Layout = Exclude<RasterLayerSpecification['layout'], undefined>;

export let attribution = undefined;

export let url: ImageSourceSpecification['url'];
export let coordinates: ImageSourceSpecification['coordinates'];

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

if (attribution !== undefined) {
  const attributionStore: AttributionStore = getContext('attribution');
  attributionStore.credit('map', attribution);
}
</script>

<ImageSource {url} {coordinates}>
  <RasterLayer
    {id}
    {minZoom}
    {maxZoom}
    {brightnessMax}
    {brightnessMin}
    {contrast}
    {fadeDuration}
    {hueRotate}
    {opacity}
    {resampling}
    {saturation}
    {visibility}
  />
  <slot />
</ImageSource>

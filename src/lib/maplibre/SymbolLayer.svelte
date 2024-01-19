<!-- @component
  # SymbolLayer

  This component mirrors the style specification for [maplibre symbol layers](https://maplibre.org/maplibre-style-spec/layers/#symbol) with two modification:

  * The "symbol-"-prefix is omitted: `symbol-placement` is just `placement`.
  * Properties are camel case: `symbol-sort-key` is `sortKey`.
-->
<script lang="ts">
import type {
  FilterSpecification,
  SymbolLayerSpecification,
} from 'maplibre-gl';
import { getContext } from 'svelte';
import type { Readable } from 'svelte/store';
import Layer from './Layer.svelte';
const labelLayerID: Readable<string> = getContext('label-layer-id');

type Paint = Exclude<SymbolLayerSpecification['paint'], undefined>;
type Layout = Exclude<SymbolLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let iconOpacity: Paint['icon-opacity'] = undefined;
export let iconColor: Paint['icon-color'] = undefined;
export let iconHaloColor: Paint['icon-halo-color'] = undefined;
export let iconHaloWidth: Paint['icon-halo-width'] = undefined;
export let iconHaloBlur: Paint['icon-halo-blur'] = undefined;
export let iconTranslate: Paint['icon-translate'] = undefined;
export let iconTranslateAnchor: Paint['icon-translate-anchor'] = undefined;
export let textOpacity: Paint['text-opacity'] = undefined;
export let textColor: Paint['text-color'] = undefined;
export let textHaloColor: Paint['text-halo-color'] = undefined;
export let textHaloWidth: Paint['text-halo-width'] = undefined;
export let textHaloBlur: Paint['text-halo-blur'] = undefined;
export let textTranslate: Paint['text-translate'] = undefined;
export let textTranslateAnchor: Paint['text-translate-anchor'] = undefined;

export let placement: Layout['symbol-placement'] = undefined;
export let spacing: Layout['symbol-spacing'] = undefined;
export let avoidEdges: Layout['symbol-avoid-edges'] = undefined;
export let sortKey: Layout['symbol-sort-key'] = undefined;
export let zOrder: Layout['symbol-z-order'] = undefined;
export let iconAllowOverlap: Layout['icon-allow-overlap'] = undefined;
export let iconOverlap: Layout['icon-overlap'] = undefined;
export let iconIgnorePlacement: Layout['icon-ignore-placement'] = undefined;
export let iconOptional: Layout['icon-optional'] = undefined;
export let iconRotationAlignment: Layout['icon-rotation-alignment'] = undefined;
export let iconSize: Layout['icon-size'] = undefined;
export let iconTextFit: Layout['icon-text-fit'] = undefined;
export let iconTextFitPadding: Layout['icon-text-fit-padding'] = undefined;
export let iconImage: Layout['icon-image'] = undefined;
export let iconRotate: Layout['icon-rotate'] = undefined;
export let iconPadding: Layout['icon-padding'] = undefined;
export let iconKeepUpright: Layout['icon-keep-upright'] = undefined;
export let iconOffset: Layout['icon-offset'] = undefined;
export let iconAnchor: Layout['icon-anchor'] = undefined;
export let iconPitchAlignment: Layout['icon-pitch-alignment'] = undefined;
export let textPitchAlignment: Layout['text-pitch-alignment'] = undefined;
export let textRotationAlignment: Layout['text-rotation-alignment'] = undefined;
export let textField: Layout['text-field'] = undefined;
export let textFont: Layout['text-font'] = ['Inter-Medium'];
export let textSize: Layout['text-size'] = undefined;
export let textMaxWidth: Layout['text-max-width'] = undefined;
export let textLineHeight: Layout['text-line-height'] = undefined;
export let textLetterSpacing: Layout['text-letter-spacing'] = undefined;
export let textJustify: Layout['text-justify'] = undefined;
export let textRadialOffset: Layout['text-radial-offset'] = undefined;
export let textVariableAnchor: Layout['text-variable-anchor'] = undefined;
export let textVariableAnchorOffset: Layout['text-variable-anchor-offset'] =
  undefined;
export let textAnchor: Layout['text-anchor'] = undefined;
export let textMaxAngle: Layout['text-max-angle'] = undefined;
export let textWritingMode: Layout['text-writing-mode'] = undefined;
export let textRotate: Layout['text-rotate'] = undefined;
export let textPadding: Layout['text-padding'] = undefined;
export let textKeepUpright: Layout['text-keep-upright'] = undefined;
export let textTransform: Layout['text-transform'] = undefined;
export let textOffset: Layout['text-offset'] = undefined;
export let textAllowOverlap: Layout['text-allow-overlap'] = undefined;
export let textOverlap: Layout['text-overlap'] = undefined;
export let textIgnorePlacement: Layout['text-ignore-placement'] = undefined;
export let textOptional: Layout['text-optional'] = undefined;
export let visibility: Layout['visibility'] = 'visible';

export let insertBefore = $labelLayerID;
export let filter: FilterSpecification | undefined = undefined;
export let clickable = false;

$: paint = Object.fromEntries(
  [
    ['icon-opacity', iconOpacity],
    ['icon-color', iconColor],
    ['icon-halo-color', iconHaloColor],
    ['icon-halo-width', iconHaloWidth],
    ['icon-halo-blur', iconHaloBlur],
    ['icon-translate', iconTranslate],
    ['icon-translate-anchor', iconTranslateAnchor],
    ['text-opacity', textOpacity],
    ['text-color', textColor],
    ['text-halo-color', textHaloColor],
    ['text-halo-width', textHaloWidth],
    ['text-halo-blur', textHaloBlur],
    ['text-translate', textTranslate],
    ['text-translate-anchor', textTranslateAnchor],
  ].filter(([_, value]) => value !== undefined),
) as Paint;

$: layout = Object.fromEntries(
  [
    ['symbol-placement', placement],
    ['symbol-spacing', spacing],
    ['symbol-avoid-edges', avoidEdges],
    ['symbol-sort-key', sortKey],
    ['symbol-z-order', zOrder],
    ['icon-allow-overlap', iconAllowOverlap],
    ['icon-overlap', iconOverlap],
    ['icon-ignore-placement', iconIgnorePlacement],
    ['icon-optional', iconOptional],
    ['icon-rotation-alignment', iconRotationAlignment],
    ['icon-size', iconSize],
    ['icon-text-fit', iconTextFit],
    ['icon-text-fit-padding', iconTextFitPadding],
    ['icon-image', iconImage],
    ['icon-rotate', iconRotate],
    ['icon-padding', iconPadding],
    ['icon-keep-upright', iconKeepUpright],
    ['icon-offset', iconOffset],
    ['icon-anchor', iconAnchor],
    ['icon-pitch-alignment', iconPitchAlignment],
    ['text-pitch-alignment', textPitchAlignment],
    ['text-rotation-alignment', textRotationAlignment],
    ['text-field', textField],
    ['text-font', textFont],
    ['text-size', textSize],
    ['text-max-width', textMaxWidth],
    ['text-line-height', textLineHeight],
    ['text-letter-spacing', textLetterSpacing],
    ['text-justify', textJustify],
    ['text-radial-offset', textRadialOffset],
    ['text-variable-anchor', textVariableAnchor],
    ['text-variable-anchor-offset', textVariableAnchorOffset],
    ['text-anchor', textAnchor],
    ['text-max-angle', textMaxAngle],
    ['text-writing-mode', textWritingMode],
    ['text-rotate', textRotate],
    ['text-padding', textPadding],
    ['text-keep-upright', textKeepUpright],
    ['text-transform', textTransform],
    ['text-offset', textOffset],
    ['text-allow-overlap', textAllowOverlap],
    ['text-overlap', textOverlap],
    ['text-ignore-placement', textIgnorePlacement],
    ['text-optional', textOptional],
    ['visibility', visibility],
  ].filter(([_, value]) => value !== undefined),
) as Layout;
</script>

<Layer
  type="symbol"
  on:click
  {id}
  {clickable}
  {insertBefore}
  {paint}
  {layout}
  {filter}
  {minZoom}
  {maxZoom}
/>

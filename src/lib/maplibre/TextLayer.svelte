<!-- @component
  # TextLayer

  This component mirrors the style specification for [maplibre symbol layers](https://maplibre.org/maplibre-style-spec/layers/#symbol) with the following modification:

  * The "text-"-prefix is omitted: `text-color` is just `color`.
  * The "symbol-"-prefix is omitted: `symbol-placement` is just `placement`.
  * Properties are camel case: `text-letter-spacing` is `letterSpacing`.
-->
<script lang="ts">
import type {
  SymbolLayerSpecification,
  FilterSpecification,
} from 'maplibre-gl';
import SymbolLayer from './SymbolLayer.svelte';

type Paint = Exclude<SymbolLayerSpecification['paint'], undefined>;
type Layout = Exclude<SymbolLayerSpecification['layout'], undefined>;

export let id: string;
export let minZoom: number = 0;
export let maxZoom: number = 24;

export let opacity: Paint['text-opacity'] = undefined;
export let color: Paint['text-color'] = undefined;
export let haloColor: Paint['text-halo-color'] = undefined;
export let haloWidth: Paint['text-halo-width'] = undefined;
export let haloBlur: Paint['text-halo-blur'] = undefined;
export let translate: Paint['text-translate'] = undefined;
export let translateAnchor: Paint['text-translate-anchor'] = undefined;

export let placement: Layout['symbol-placement'] = undefined;
export let spacing: Layout['symbol-spacing'] = undefined;
export let avoidEdges: Layout['symbol-avoid-edges'] = undefined;
export let sortKey: Layout['symbol-sort-key'] = undefined;
export let zOrder: Layout['symbol-z-order'] = undefined;
export let pitchAlignment: Layout['text-pitch-alignment'] = undefined;
export let rotationAlignment: Layout['text-rotation-alignment'] = undefined;
export let field: Layout['text-field'] = undefined;
export let font: Layout['text-font'] = ['Inter-Medium'];
export let size: Layout['text-size'] = undefined;
export let maxWidth: Layout['text-max-width'] = undefined;
export let lineHeight: Layout['text-line-height'] = undefined;
export let letterSpacing: Layout['text-letter-spacing'] = undefined;
export let justify: Layout['text-justify'] = undefined;
export let radialOffset: Layout['text-radial-offset'] = undefined;
export let variableAnchor: Layout['text-variable-anchor'] = undefined;
export let variableAnchorOffset: Layout['text-variable-anchor-offset'] =
  undefined;
export let anchor: Layout['text-anchor'] = undefined;
export let maxAngle: Layout['text-max-angle'] = undefined;
export let writingMode: Layout['text-writing-mode'] = undefined;
export let rotate: Layout['text-rotate'] = undefined;
export let padding: Layout['text-padding'] = undefined;
export let keepUpright: Layout['text-keep-upright'] = undefined;
export let transform: Layout['text-transform'] = undefined;
export let offset: Layout['text-offset'] = undefined;
export let allowOverlap: Layout['text-allow-overlap'] = undefined;
export let overlap: Layout['text-overlap'] = undefined;
export let ignorePlacement: Layout['text-ignore-placement'] = undefined;
export let optional: Layout['text-optional'] = undefined;
export let visibility: Layout['visibility'] = 'visible';

export let filter: FilterSpecification | undefined = undefined;
</script>

<SymbolLayer
  {id}
  {minZoom}
  {maxZoom}
  {filter}
  {placement}
  {spacing}
  {avoidEdges}
  {sortKey}
  {zOrder}
  {visibility}
  textOpacity={opacity}
  textColor={color}
  textHaloColor={haloColor}
  textHaloWidth={haloWidth}
  textHaloBlur={haloBlur}
  textTranslate={translate}
  textTranslateAnchor={translateAnchor}
  textPitchAlignment={pitchAlignment}
  textRotationAlignment={rotationAlignment}
  textField={field}
  textFont={font}
  textSize={size}
  textMaxWidth={maxWidth}
  textLineHeight={lineHeight}
  textLetterSpacing={letterSpacing}
  textJustify={justify}
  textRadialOffset={radialOffset}
  textVariableAnchor={variableAnchor}
  textVariableAnchorOffset={variableAnchorOffset}
  textAnchor={anchor}
  textMaxAngle={maxAngle}
  textWritingMode={writingMode}
  textRotate={rotate}
  textPadding={padding}
  textKeepUpright={keepUpright}
  textTransform={transform}
  textOffset={offset}
  textAllowOverlap={allowOverlap}
  textOverlap={overlap}
  textIgnorePlacement={ignorePlacement}
  textOptional={optional}
/>

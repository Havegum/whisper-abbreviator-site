<!-- @component
  
  # SimpleStyleLayer

  This layer component must be used in a geojson source context, and
  will render the features in the source using the simplestyle-spec
  style properties.

  See style specification for [simplestyle](https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0)

  Specifically, it will render geojson features with the following
  properties:

  - `marker-size` (small, medium, large)
  - `marker-symbol` (any string)
  - `marker-color` (any color string)
  - `stroke` (any color string)
  - `stroke-width` (any number)
  - `stroke-opacity` (any number)
  - `fill` (any color string)
  - `fill-opacity` (any number)


  @prop {string} id - The layer id
-->
<script lang="ts">
import { getContext } from 'svelte';
import type { Source } from 'maplibre-gl';
import type { Readable } from 'svelte/store';

import CircleLayer from './CircleLayer.svelte';
import LineLayer from './LineLayer.svelte';
import FillLayer from './FillLayer.svelte';
import TextLayer from './TextLayer.svelte';

export let id: string;
</script>

<LineLayer
  id="{id}-line"
  color={['coalesce', ['get', 'stroke'], '#555555']}
  width={['coalesce', ['get', 'stroke-width'], 2]}
  opacity={['coalesce', ['get', 'stroke-opacity'], 1]}
  filter={['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']]}
/>

<FillLayer
  id="{id}-fill"
  opacity={['coalesce', ['get', 'fill-opacity'], 0.6]}
  color={['coalesce', ['get', 'fill'], '#555555']}
  filter={['==', '$type', 'Polygon']}
/>

<CircleLayer
  id="{id}-circle"
  color={['coalesce', ['get', 'marker-color'], '#7e7e7e']}
  radius={[
    'match',
    ['get', 'marker-size'],
    'small',
    5,
    'medium',
    10,
    'large',
    15,
    10,
  ]}
  filter={['all', ['==', '$type', 'Point']]}
/>

<!-- "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right", but found "middle-left" instead. -->

<TextLayer
  id="{id}-text"
  filter={['all', ['==', '$type', 'Point'], ['has', 'title']]}
  field={['get', 'title']}
  anchor={[
    'match',
    ['coalesce', ['get', 'anchor'], 'middle-left'],
    'middle-left',
    'left',
    'middle-right',
    'right',
    'top',
  ]}
  color={[
    'get',
    'color',
    ['coalesce', ['get', 'text'], ['literal', { color: '#333333' }]],
  ]}
  haloColor={[
    'get',
    'halo',
    ['coalesce', ['get', 'text'], ['literal', { halo: '#f2f3f0' }]],
  ]}
  size={[
    'get',
    'fontSize',
    ['coalesce', ['get', 'text'], ['literal', { fontSize: 14 }]],
  ]}
  haloWidth={1}
  radialOffset={0.8}
/>
<!-- haloColor={'#ffffff'} -->

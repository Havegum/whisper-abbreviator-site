<!-- @component
  # DatawrapperLayer

  This layer component accepts a geojson file, and will
  attempt to render features similar to how Datawrapper would
  render them.

-->
<script lang="ts">
import CircleLayer from './CircleLayer.svelte';
import LineLayer from './LineLayer.svelte';
import FillLayer from './FillLayer.svelte';
import TextLayer from './TextLayer.svelte';
import MapImage from './MapImage.svelte';
import SymbolLayer from './SymbolLayer.svelte';
import GeojsonSource from './GeojsonSource.svelte';

export let id: string;
export let geojson: unknown;

$: icons = new Set(
  (geojson as any).features
    .filter((d: any) => d.geometry.type === 'Point')
    .map((d: any) => d.properties.icon.id),
);

$: sources = Promise.all(
  Array.from(icons).map(id =>
    import(`/src/lib/assets/map-icons/${id}.png`).then(d => ({
      id,
      href: d.default,
    })),
  ),
) as Promise<{ id: string; href: string }[]>;
</script>

<GeojsonSource id="{id}-source" data={geojson}>
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
    filter={['all', ['==', '$type', 'Point'], ['any', ['!has', 'icon']]]}
  />

  {#await sources then sources}
    <MapImage
      id={sources.map(d => d.id)}
      imageURL={sources.map(d => d.href)}
      sdf={true}
    >
      <SymbolLayer
        id="{id}-symbol"
        filter={['all', ['==', '$type', 'Point'], ['any', ['has', 'icon']]]}
        iconImage={['get', 'marker-symbol']}
        iconSize={['*', 0.3, ['get', 'marker-size']]}
        iconColor={['get', 'marker-color']}
        textField={['get', 'title']}
        textAnchor={[
          'match',
          ['coalesce', ['get', 'anchor'], 'middle-left'],
          'middle-left',
          'left',
          'middle-right',
          'right',
          'top',
        ]}
        textColor={[
          'get',
          'color',
          ['coalesce', ['get', 'text'], ['literal', { color: '#333333' }]],
        ]}
        textHaloColor={[
          'get',
          'halo',
          ['coalesce', ['get', 'text'], ['literal', { halo: '#f2f3f0' }]],
        ]}
        textSize={[
          'get',
          'fontSize',
          ['coalesce', ['get', 'text'], ['literal', { fontSize: 14 }]],
        ]}
        textHaloWidth={1}
        textRadialOffset={0.8}
      />
    </MapImage>
  {/await}

  <TextLayer
    id="{id}-text"
    filter={[
      'all',
      ['==', '$type', 'Point'],
      ['has', 'title'],
      ['!has', 'icon'],
    ]}
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
</GeojsonSource>

{#await import('./TerrainLayer.svelte') then { default: TerrainLayer }}
  <TerrainLayer
    url={'https://maps.vgc.no/api/tiles/maptiler-terrain-rgb/{z}/{x}/{y}.png'}
    attribution=""
    exaggeration={1}
    hillshadeExaggeration={0.07}
    hillshade={true}
  />
{/await}

<script lang="ts">
import type { Map } from 'maplibre-gl';
import { getContext } from 'svelte';
import type { Readable } from 'svelte/store';
const map: Readable<Map> = getContext('map');

export let id: string | string[];
export let imageURL: string | string[];
export let sdf = false;
let initialized = false;

async function init(
  map: Map,
  id: string | string[],
  imageURL: string | string[],
  root = false,
) {
  if (!imageURL) return;
  if (
    Array.isArray(id) &&
    Array.isArray(imageURL) &&
    id.length === imageURL.length
  ) {
    for (let i = 0; i < id.length; i++) {
      await init(map, id[i], imageURL[i]);
    }
  } else if (typeof id === 'string' && typeof imageURL === 'string') {
    await new Promise<void>((resolve, reject) =>
      map.loadImage(imageURL, (error, image) => {
        if (error) reject(error);
        if (image == null) return reject();

        if (map.hasImage(id)) {
          map.updateImage(id, image);
        } else {
          map.addImage(id, image, { sdf });
        }

        resolve();
      }),
    );
  } else {
    throw new Error('id and imageURL both be strings, or array of strings');
  }

  if (root) {
    initialized = true;
  }
}

init($map, id, imageURL, true);
</script>

{#if initialized}
  <slot />
{/if}

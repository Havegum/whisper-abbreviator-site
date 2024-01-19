<script>
import Annotation from './Annotation.svelte';

export let annotations;
</script>

{#each annotations as annotation (annotation.id)}
  <Annotation {annotation} />
{/each}

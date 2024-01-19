<script>
export let flat = false;
export let textContent = false;
</script>

<section class:flat class:text-content={textContent}>
  <slot />
</section>

<style>
section {
  background-color: var(--white);
  padding: var(--padding, var(--s-3));
  border-radius: var(--s-2);
  box-shadow: 0 8px 16px -8px #0005;
  overflow: hidden;
}

section :global(+ section) {
  margin-top: var(--s-3);
}

.flat {
  background-color: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
}
</style>

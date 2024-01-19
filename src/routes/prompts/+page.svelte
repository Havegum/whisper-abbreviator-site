<script>
const prompts = import.meta.glob('$lib/agent/prompts/*.txt', {
  eager: true,
  import: 'default',
});

console.log(prompts);
</script>

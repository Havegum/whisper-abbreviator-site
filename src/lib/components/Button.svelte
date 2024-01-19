<script lang="ts">
const _class = '';
export { _class as class };
</script>

<button
  on:click
  class="bg-blue-700 text-white px-4 py-1 rounded-full
    hover:bg-blue-800
    focus:ring-4
    ring-blue-200
    focus-visible:bg-blue-800
    focus-visible:outline-blue-800
    focus-visible:outline-2
    focus-visible:outline-offset-8
    {_class}"><slot /></button
>

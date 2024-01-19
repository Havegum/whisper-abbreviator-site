<script lang="ts">
export let error: Error | null = null;
</script>

<slot>
  {#if error}
    <div class="error">
      <b>{error.message}</b>
      <pre class="trace">
          {error.stack}
        </pre>
    </div>
  {/if}
</slot>

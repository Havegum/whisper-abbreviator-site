<script lang="ts">
import { parse } from 'marked';
import DOMPurify from 'dompurify';

import Section from '$lib/components/Section.svelte';

export let content: string;

function safeRender(markdown: string): string {
  return DOMPurify().sanitize(
    parse(markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')),
  );
}
</script>

<Section textContent>
  {@html safeRender(content)}
</Section>

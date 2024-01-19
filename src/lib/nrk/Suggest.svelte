<!--
  This component is a wrapper for @nrk/core-tabs.
  Documentation for that can be found here:
  https://static.nrk.no/core-components/latest/index.html?core-suggest/readme.md
-->
<script context="module">
import { browser } from '$app/environment';
import CoreSuggest from '@nrk/core-suggest';

if (browser && customElements.get('core-suggest') === undefined) {
  window.customElements.define('core-suggest', CoreSuggest);
}
</script>

<script lang="ts">
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

export let limit = 5;
export let highlight = 'on';
export let hidden = false;
export let id = undefined;
export let emptyMessage = undefined;

let suggest: CoreSuggest;
function init(node: CoreSuggest) {
  suggest = node;
  suggest.limit = limit;
  suggest.highlight = highlight;
  suggest.hidden = hidden;

  if (id !== undefined) suggest.id = id;
  if (emptyMessage !== undefined)
    suggest.setAttribute('data-sr-empty-message', emptyMessage);

  const observer = new MutationObserver(mut =>
    mut
      .filter(mut => mut.type === 'attributes')
      .filter(mut => mut.attributeName === 'hidden')
      .map(mut => mut.target as HTMLElement)
      .forEach(target => (hidden = target.hidden)),
  );

  observer.observe(suggest, { attributes: true });

  const forward = eventName => event => dispatch(eventName, event);

  // suggest.addEventListener('suggest.filter', forward('suggest.filter'));
  suggest.addEventListener('suggest.select', forward('suggest.select'));
  suggest.addEventListener(
    'suggest.ajax.beforeSend',
    forward('suggest.ajax.beforeSend'),
  );
  suggest.addEventListener('suggest.ajax', forward('suggest.ajax'));
  suggest.addEventListener('suggest.ajax.error', forward('suggest.ajax.error'));

  suggest.addEventListener('suggest.filter', event => {
    event.preventDefault();
    event.target; // The core-suggest element
    const value = suggest.input.value.toLowerCase();
    const items = suggest.querySelectorAll('a,button');
    for (let i = 0, l = items.length; i < l; ++i) {
      const hidden = !(items[i].value || items[i].textContent)
        .toLowerCase()
        .startsWith(value);
      toggleItem(items[i], hidden);
    }
    dispatch('suggest.filter', event);
  });

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

function toggleAttribute(el, name, _) {
  const force =
    arguments.length > 2 && arguments[2] !== undefined
      ? arguments[2]
      : !this.hasAttribute(name);
  if (!force === el.hasAttribute(name))
    el[force ? 'setAttribute' : 'removeAttribute'](name, '');
  return force;
}
function toggleItem(item, show) {
  const li = item.parentElement; // JAWS requires hiding parent <li> (if existing)
  if (li.nodeName === 'LI') toggleAttribute(li, 'hidden', show);
  toggleAttribute(item, 'hidden', show);
}
$: if (suggest) suggest.limit = limit;
$: if (suggest) suggest.highlight = highlight;
$: if (suggest) suggest.hidden = hidden;
</script>

<core-suggest use:init>
  <slot />
</core-suggest>

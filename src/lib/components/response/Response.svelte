<script lang="ts">
import type { Observable } from 'rxjs';
import { createEventDispatcher } from 'svelte';

export let message: Observable<any>;

const dispatch = createEventDispatcher();

let expanded = $message.role === 'assistant';
</script>

<div
  class="message"
  class:assistant={$message.role === 'assistant'}
  class:function={$message.role === 'function'}
  class:system={$message.role === 'system'}
  class:user={$message.role === 'user'}
  class:function-manifest={$message.role === 'function-manifest'}
>
  {#if expanded}
    <p class="role">Role: {$message.role}</p>
    {#if $message.content}
      {#if $message.role === 'function' || $message.role === 'function-manifest'}
        <pre class="">{JSON.stringify($message.content, null, 2)}</pre>
      {:else}
        <p>{$message.content}</p>
      {/if}
    {/if}
    {#if $message.function_call}
      {@const call = $message.function_call}
      <div class="box function-call">
        <p><strong><code>{call.name}</code></strong></p>
        <pre>{call.arguments}</pre>
      </div>
      {#if call.permission}
        <div class="permission">
          <button
            class="btn btn-approve"
            disabled={call.permission !== 'pending'}
            class:choice={call.permission === 'granted'}
            on:click={() => dispatch('permit', call.id)}>Godkjenn</button
          >
          <button
            class="btn btn-danger btn-secondary"
            disabled={call.permission !== 'pending'}
            class:choice={call.permission === 'denied'}
            on:click={() => dispatch('deny', call.id)}>Avvis</button
          >
        </div>
      {/if}
    {/if}
  {:else}
    <button class="expand" on:click={() => (expanded = true)}
      ><span>▶</span> {$message.role}</button
    >
  {/if}
</div>

<style>
.message {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;

  border-left: 4px solid var(--purple-300);
  background-color: var(--purple-50);
  padding-left: var(--s-3);
  padding: var(--s-3);
}

.message.assistant {
  border-color: var(--purple-300);
  background-color: var(--purple-50);
}

.message.function-manifest,
.message.function {
  border-color: var(--blue-300);
  background-color: var(--blue-50);
}

.message.system {
  border-color: var(--gray-300);
  background-color: var(--gray-50);
}

.message.user {
  background-color: var(--white);
  border-color: var(--gray-200);
}

.role {
  font-size: var(--small);
  color: var(--gray-700);
  margin: 0;
}

p {
  white-space: pre-wrap;
}

.box {
  padding: var(--s-2);
  border: 1px solid var(--gray-100);
  border-radius: var(--s-1);
}

.box.function-call {
  background-color: var(--gray-800);
  color: var(--purple-300);
  font-family: var(--mono);
}

.box.function-call code {
  font-size: var(--small);
  background-color: var(--purple-700);
  color: var(--purple-100);
  border: none;
}

.box.function-call pre {
  font-size: var(--small);
  white-space: pre-wrap;
  background-color: transparent;
  color: var(--purple-300);
  border: none;
}

.function-manifest pre,
.function pre {
  font-size: var(--small);
  white-space: pre-wrap;
  background-color: transparent;
  color: var(--blue-300);
  background-color: var(--gray-800);
  overflow-x: auto;
  max-height: 20em;
  padding: var(--s-2);
  border: none;
}

/* button {
  background-color: var(--purple-100);
  color: var(--purple-700);
  border: none;
  border-radius: 999px;
  line-height: 1;
  padding: var(--s-2) var(--s-2-5);
  font-size: var(--small);
  font-weight: 550;
  margin-top: var(--s-2);
  cursor: pointer;
} */

/* button.approve {
  background-color: var(--green-400);
  color: var(--green-800);
}

button.deny {
  background-color: var(--red-400);
  color: var(--red-800);
}

button.approve:hover {
  background-color: var(--green-300);
}

button.deny:hover {
  background-color: var(--red-300);
}

button.approve:active {
  background-color: var(--green-800);
  color: var(--green-200);
}

button.deny:active {
  background-color: var(--red-800);
  color: var(--red-200);
} */

button.expand {
  text-align: left;
  margin: calc(-1 * var(--s-3));
  padding: var(--s-3);
  font-size: var(--small);
  color: var(--gray-700);
}

button.expand:hover {
  color: var(--gray-900);
}

button.expand span {
  font-size: var(--xsmall);
}

button:disabled,
button:disabled:hover,
button:disabled:active {
  background-color: transparent;
  color: var(--gray-600);
  cursor: default;
}

button.choice:hover,
button.choice:active,
button.choice {
  background-color: var(--blue-200);
  color: var(--blue-700);
}

button.choice::after {
  content: '✓';
  margin-left: var(--s-1);
}
</style>

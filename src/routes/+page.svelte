<script lang="ts">
	import ChatWindow from '$lib/components/ChatWindow.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';

	let isOpen = $state(false);
</script>

<svelte:head>
	<title>Support Widget</title>
</svelte:head>

<div class="flex h-screen items-center justify-center bg-slate-100 p-4">
	<div class="text-center text-slate-500">
		<h1 class="mb-2 text-2xl font-bold text-slate-800">Support Widget</h1>
		<p class="mb-4 text-sm">Click the chat bubble to start a conversation.</p>
		<p class="text-xs text-slate-400">
			Embed this widget:
			<code class="rounded bg-slate-200 px-2 py-1 text-xs"
				>&lt;iframe src="/embed" width="400" height="600"&gt;</code
			>
		</p>
	</div>
</div>

{#if isOpen}
	<div
		class="fixed right-5 bottom-24 z-50 h-[600px] w-[380px] max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
	>
		<ChatWindow mode="standalone" onclose={() => (isOpen = false)} />
	</div>
{/if}

<ChatBubble onclick={() => (isOpen = !isOpen)} {isOpen} />

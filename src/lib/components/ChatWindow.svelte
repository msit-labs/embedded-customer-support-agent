<script lang="ts">
	import { getChat } from '$lib/stores/chat.svelte';
	import { splitContentAndTicket } from '$lib/utils/markdown';
	import MessageBubble from './MessageBubble.svelte';
	import MessageInput from './MessageInput.svelte';
	import TicketCard from './TicketCard.svelte';
	import TypingIndicator from './TypingIndicator.svelte';

	let {
		mode = 'standalone',
		onclose
	}: { mode?: 'standalone' | 'embed'; onclose?: () => void } = $props();

	const chat = getChat();
	let messagesEl: HTMLDivElement;

	$effect(() => {
		// scroll to bottom when messages change or stream updates
		chat.messages.length;
		chat.currentStreamContent;
		if (messagesEl) {
			requestAnimationFrame(() => {
				messagesEl.scrollTop = messagesEl.scrollHeight;
			});
		}
	});

	function handleSend(content: string) {
		chat.send(content);
	}

	let streamParsed = $derived(
		chat.currentStreamContent
			? splitContentAndTicket(chat.currentStreamContent)
			: { text: '', ticket: null }
	);
</script>

<div class="flex h-full flex-col bg-[var(--color-widget-bg)]">
	<!-- Header -->
	<div
		class="flex items-center justify-between bg-[var(--color-widget-header)] px-4 py-3 text-white"
	>
		<div class="flex items-center gap-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
					></path>
				</svg>
			</div>
			<div>
				<p class="m-0 text-sm font-semibold">Support Agent</p>
				<p class="m-0 text-xs text-slate-300">We'll help you create a ticket</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			{#if chat.messages.length > 0}
				<button
					onclick={() => chat.reset()}
					class="rounded-md px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
				>
					New chat
				</button>
			{/if}
			{#if mode === 'standalone' && onclose}
				<button
					onclick={onclose}
					aria-label="Close chat"
					class="rounded-md p-1 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Messages -->
	<div bind:this={messagesEl} class="flex-1 overflow-y-auto p-4">
		{#if chat.messages.length === 0 && !chat.isStreaming}
			<div class="flex h-full items-center justify-center">
				<div class="text-center text-slate-400">
					<svg
						class="mx-auto mb-2 h-10 w-10 text-slate-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						></path>
					</svg>
					<p class="m-0 text-sm">Describe your issue and we'll create a ticket for your team.</p>
				</div>
			</div>
		{/if}

		{#each chat.messages as message}
			<MessageBubble {message} />
		{/each}

		{#if chat.isStreaming && chat.currentStreamContent}
			<div class="flex justify-start mb-3">
				<div
					class="max-w-[85%] rounded-[var(--radius-bubble)] bg-[var(--color-bubble-assistant)] px-4 py-2.5 text-sm leading-relaxed text-[var(--color-bubble-assistant-text)]"
				>
					{#if streamParsed.text}
						<p class="m-0 whitespace-pre-wrap">{streamParsed.text}</p>
					{/if}
					{#if streamParsed.ticket}
						<TicketCard ticket={streamParsed.ticket} />
					{/if}
				</div>
			</div>
		{:else if chat.isStreaming}
			<TypingIndicator />
		{/if}
	</div>

	<!-- Input -->
	<MessageInput onSend={handleSend} disabled={chat.isStreaming} />
</div>

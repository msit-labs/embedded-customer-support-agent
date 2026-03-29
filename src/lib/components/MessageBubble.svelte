<script lang="ts">
	import type { Message } from '$lib/types/chat';
	import { splitContentAndTicket } from '$lib/utils/markdown';
	import TicketCard from './TicketCard.svelte';

	let { message }: { message: Message } = $props();

	let parsed = $derived(
		message.role === 'assistant'
			? splitContentAndTicket(message.content)
			: { text: message.content, ticket: null }
	);
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3">
	<div
		class="max-w-[85%] rounded-[var(--radius-bubble)] px-4 py-2.5 text-sm leading-relaxed {message.role ===
		'user'
			? 'bg-[var(--color-bubble-user)] text-[var(--color-bubble-user-text)]'
			: 'bg-[var(--color-bubble-assistant)] text-[var(--color-bubble-assistant-text)]'}"
	>
		{#if parsed.text}
			<p class="m-0 whitespace-pre-wrap">{parsed.text}</p>
		{/if}
		{#if parsed.ticket}
			<TicketCard ticket={parsed.ticket} />
		{/if}
	</div>
</div>

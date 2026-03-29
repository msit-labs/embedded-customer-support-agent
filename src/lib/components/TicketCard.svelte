<script lang="ts">
	let { ticket }: { ticket: string } = $props();
	let copied = $state(false);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(ticket);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = ticket;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div
	class="mt-3 rounded-[var(--radius-card)] border border-[var(--color-ticket-border)] bg-[var(--color-ticket-bg)] p-4"
>
	<div class="mb-2 flex items-center justify-between">
		<span class="text-xs font-semibold tracking-wide text-emerald-700 uppercase"
			>Generated Ticket</span
		>
		<button
			onclick={copyToClipboard}
			class="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
		>
			{#if copied}
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
					></path>
				</svg>
				Copied!
			{:else}
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					></path>
				</svg>
				Copy Ticket
			{/if}
		</button>
	</div>
	<pre
		class="m-0 overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-700">{ticket}</pre>
</div>

<script lang="ts">
	let { onSend, disabled = false }: { onSend: (content: string) => void; disabled?: boolean } =
		$props();
	let value = $state('');
	let textarea: HTMLTextAreaElement;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	function submit() {
		const trimmed = value.trim();
		if (!trimmed || disabled) return;
		onSend(trimmed);
		value = '';
		if (textarea) textarea.style.height = 'auto';
	}

	function autoResize(e: Event) {
		const el = e.target as HTMLTextAreaElement;
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, 120) + 'px';
	}
</script>

<div class="flex items-end gap-2 border-t border-[var(--color-input-border)] bg-white p-3">
	<textarea
		bind:this={textarea}
		bind:value
		oninput={autoResize}
		onkeydown={handleKeydown}
		{disabled}
		placeholder="Describe your issue..."
		rows="1"
		class="flex-1 resize-none rounded-lg border border-[var(--color-input-border)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-input-focus)] disabled:opacity-50"
	></textarea>
	<button
		onclick={submit}
		disabled={disabled || !value.trim()}
		aria-label="Send message"
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bubble-user)] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
	>
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 19V5m0 0l-7 7m7-7l7 7"
			></path>
		</svg>
	</button>
</div>

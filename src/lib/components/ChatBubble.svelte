<script lang="ts">
	let { onclick, isOpen = false }: { onclick: () => void; isOpen?: boolean } = $props();
</script>

<button
	{onclick}
	class="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bubble-user)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
>
	{#if isOpen}
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			></path>
		</svg>
	{:else}
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
			></path>
		</svg>
	{/if}
</button>

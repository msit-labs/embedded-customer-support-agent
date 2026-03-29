export async function streamChat(
	messages: { role: string; content: string }[],
	onChunk: (content: string) => void,
	onDone: () => void,
	onError: (error: Error) => void
) {
	try {
		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages })
		});

		if (!response.ok || !response.body) {
			onError(new Error(`HTTP ${response.status}`));
			return;
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			buffer = lines.pop() ?? '';

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6).trim();
					if (data === '[DONE]') {
						onDone();
						return;
					}
					try {
						const parsed = JSON.parse(data);
						if (parsed.error) {
							onError(new Error(parsed.error));
							return;
						}
						if (parsed.content) onChunk(parsed.content);
					} catch {
						// skip malformed chunks
					}
				}
			}
		}
		onDone();
	} catch (err) {
		onError(err instanceof Error ? err : new Error('Network error'));
	}
}

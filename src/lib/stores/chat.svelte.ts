import type { Message } from '$lib/types/chat';
import { streamChat } from '$lib/utils/stream';

let messages = $state<Message[]>([]);
let isStreaming = $state(false);
let currentStreamContent = $state('');

export function getChat() {
	return {
		get messages() {
			return messages;
		},
		get isStreaming() {
			return isStreaming;
		},
		get currentStreamContent() {
			return currentStreamContent;
		},

		async send(content: string) {
			messages.push({ role: 'user', content });
			isStreaming = true;
			currentStreamContent = '';

			const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));

			await streamChat(
				apiMessages,
				(chunk) => {
					currentStreamContent += chunk;
				},
				() => {
					if (currentStreamContent) {
						messages.push({ role: 'assistant', content: currentStreamContent });
					}
					currentStreamContent = '';
					isStreaming = false;
				},
				(error) => {
					console.error('Stream error:', error);
					messages.push({
						role: 'assistant',
						content: 'Sorry, something went wrong. Please try again.'
					});
					currentStreamContent = '';
					isStreaming = false;
				}
			);
		},

		reset() {
			messages = [];
			isStreaming = false;
			currentStreamContent = '';
		}
	};
}

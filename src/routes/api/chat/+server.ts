import { openai } from '$lib/server/openai';
import { SYSTEM_PROMPT } from '$lib/server/prompts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = await request.json();

	const stream = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
		stream: true
	});

	const encoder = new TextEncoder();

	const readable = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of stream) {
					const content = chunk.choices[0]?.delta?.content;
					if (content) {
						controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
					}
				}
				controller.enqueue(encoder.encode('data: [DONE]\n\n'));
			} catch (err) {
				console.error('OpenAI stream error:', err);
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
				);
			} finally {
				controller.close();
			}
		}
	});

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};

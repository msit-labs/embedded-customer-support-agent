import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.delete('X-Frame-Options');
	response.headers.set('Content-Security-Policy', 'frame-ancestors *;');
	return response;
};

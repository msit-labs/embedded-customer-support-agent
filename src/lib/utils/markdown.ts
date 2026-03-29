const TICKET_REGEX = /```ticket\n([\s\S]*?)```/;

export function extractTicket(content: string): string | null {
	const match = content.match(TICKET_REGEX);
	return match ? match[1].trim() : null;
}

export function splitContentAndTicket(content: string): {
	text: string;
	ticket: string | null;
} {
	const match = content.match(TICKET_REGEX);
	if (!match) return { text: content, ticket: null };

	const ticket = match[1].trim();
	const text = content.replace(TICKET_REGEX, '').trim();
	return { text, ticket };
}

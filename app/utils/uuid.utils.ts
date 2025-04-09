import short from 'short-uuid';

export function toShort(id: string) {

	const translator = short();

	return translator.fromUUID(id);
}

export function toUUID(shortId: string) {

	const translator = short();

	return translator.toUUID(shortId);
}
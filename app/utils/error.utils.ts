export function toError(error: unknown): Error {

	if (error instanceof Error) return error;
	if (typeof error === "string") return new Error(error);

	try {
		const stringified = JSON.stringify(error);

		return new Error(stringified);
	}
	catch {
		return new Error('Unable to stringify the thrown value');
	}
}

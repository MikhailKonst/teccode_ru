export function toErrorMessage(err: unknown, fallback: string): string {
	if (err instanceof Error) return err.message || fallback;
	if (err && typeof err === 'object' && 'message' in err) {
		return String((err as { message?: unknown }).message ?? fallback);
	}
	return fallback;
}

export function isImagePreview(value: unknown): boolean {
	const v = String(value ?? '').trim();
	if (!v) return false;
	return (
		v.startsWith('data:image/') ||
		v.startsWith('http://') ||
		v.startsWith('https://') ||
		v.startsWith('/')
	);
}

export function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result ?? ''));
		reader.onerror = () => reject(new Error('read_failed'));
		reader.readAsDataURL(file);
	});
}

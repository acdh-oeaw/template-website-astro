let isOpen = $state(false);

export function get(): boolean {
	return isOpen;
}

export function open(): void {
	isOpen = true;
}

export function close(): void {
	isOpen = false;
}

export function toggle(): void {
	isOpen = !isOpen;
}

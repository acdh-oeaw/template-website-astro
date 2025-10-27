let isOpen = $state(false);

export function toggle(): void {
	isOpen = !isOpen;
}

export function get(): boolean {
	return isOpen;
}

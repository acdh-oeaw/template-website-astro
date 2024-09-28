import { createSignal } from "solid-js";

export interface ToggleState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

export function useToggleState(): ToggleState {
	const [isOpen, setIsOpen] = createSignal(false);

	function open() {
		setIsOpen(true);
	}

	function close() {
		setIsOpen(false);
	}

	function toggle() {
		setIsOpen((isOpen) => !isOpen);
	}

	return {
		get isOpen() {
			return isOpen();
		},
		open,
		close,
		toggle,
	};
}

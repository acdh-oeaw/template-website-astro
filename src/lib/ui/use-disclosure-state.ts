import { createSignal } from "solid-js";

export function useDisclosureState() {
	const [isOpen, setIsOpen] = createSignal(false);

	function toggle() {
		setIsOpen((isOpen) => !isOpen);
	}

	return {
		get isOpen() {
			return isOpen();
		},
		toggle,
	};
}

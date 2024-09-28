import { onCleanup } from "solid-js";

export function clickOutside(el: HTMLElement, close) {
	function onClick(event: MouseEvent) {
		if (!el.contains(event.target)) {
			close()?.();
		}
	}

	function onKey(event: KeyboardEvent) {
		if (event.key === "Escape") {
			close()?.();
		}
	}

	document.addEventListener("click", onClick);
	document.addEventListener("keydown", onKey);

	onCleanup(() => {
		document.removeEventListener("click", onClick);
		document.removeEventListener("keydown", onKey);
	});
}

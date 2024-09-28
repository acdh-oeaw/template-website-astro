import { onCleanup, type Accessor } from "solid-js";

export function clickOutside(element: HTMLElement, close: Accessor<() => void>) {
	function onClick(event: MouseEvent) {
		if (!element.contains(event.target as Node)) {
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

declare module "solid-js" {
	namespace JSX {
		interface DirectiveFunctions {
			clickOutside: typeof clickOutside;
		}
	}
}

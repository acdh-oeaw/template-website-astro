import { type Accessor,onCleanup } from "solid-js";

export function clickOutside(element: HTMLElement, accessor: Accessor<() => void>): void {
	function onClick(event: MouseEvent) {
		if (!element.contains(event.target as Node)) {
			accessor()();
		}
	}

	function onKey(event: KeyboardEvent) {
		if (event.key === "Escape") {
			accessor()();
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

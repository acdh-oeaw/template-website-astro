import { type Accessor,onCleanup } from "solid-js";

export function windowChange(element: HTMLElement, accessor: Accessor<() => void>): void {
	function onWindowChange() {
		accessor()();
	}

	window.addEventListener("resize", onWindowChange, { once: true, passive: true });
	window.addEventListener("scroll", onWindowChange, { once: true, passive: true });

	onCleanup(() => {
		window.removeEventListener("resize", onWindowChange);
		window.removeEventListener("scroll", onWindowChange);
	});
}

declare module "solid-js" {
	namespace JSX {
		interface DirectiveFunctions {
			windowChange: typeof windowChange;
		}
	}
}

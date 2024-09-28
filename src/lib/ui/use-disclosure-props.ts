import type { ToggleState } from "@/lib/ui/use-toggle-state";
import { createUniqueId } from "solid-js";

export function useDisclosureProps(state: ToggleState) {
	const id = createUniqueId();

	return {
		get triggerProps() {
			const props = { "aria-expanded": state.isOpen };

			if (state.isOpen) {
				return { ...props, "aria-controls": id };
			}

			return props;
		},
		get panelProps() {
			return { id };
		},
	};
}

import type { ToggleState } from "@/lib/ui/use-toggle-state";
import { createUniqueId } from "solid-js";

export function useDisclosureProps(state: ToggleState) {
	const panelId = createUniqueId();

	return {
		get triggerProps() {
			const props = {
				"aria-expanded": state.isOpen,
				onClick: state.toggle,
			};

			if (state.isOpen) {
				return {
					...props,
					"aria-controls": panelId,
				};
			}

			return props;
		},
		get panelProps() {
			return {
				id: panelId,
			};
		},
	};
}

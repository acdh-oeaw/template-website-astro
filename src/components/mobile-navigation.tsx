/* @jsxImportSource solid-js */

import { type JSX, Show } from "solid-js";

import { useDisclosureProps } from "@/lib/ui/use-disclosure-props";
import { useToggleState } from "@/lib/ui/use-toggle-state";

interface MobileNavigationProps {
	children: JSX.Element;
	label: JSX.Element;
}

export function MobileNavigation(props: MobileNavigationProps) {
	const state = useToggleState();
	const disclosure = useDisclosureProps(state);

	// TODO: ESC key (?), clickoutside, windochange

	return (
		<nav
			class="grid"
			onFocusOut={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					state.close();
				}
			}}
		>
			<button {...disclosure.triggerProps} type="button">
				{props.label}
			</button>
			<Show when={state.isOpen}>
				<div {...disclosure.panelProps}>{props.children}</div>
			</Show>
		</nav>
	);
}

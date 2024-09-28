/* @jsxImportSource solid-js */

import { useDisclosureProps } from "@/lib/ui/use-disclosure-props";
import { useToggleState } from "@/lib/ui/use-toggle-state";
import { type JSX } from "solid-js";

interface MobileNavigationProps {
	children: JSX.Element;
	label: JSX.Element;
}

export function MobileNavigation(props: MobileNavigationProps) {
	const state = useToggleState();
	const disclosure = useDisclosureProps(state);

	return (
		<nav>
			<button {...disclosure.triggerProps} onClick={state.toggle}>
				{props.label}
			</button>
			<div {...disclosure.panelProps}>{props.children}</div>
		</nav>
	);
}

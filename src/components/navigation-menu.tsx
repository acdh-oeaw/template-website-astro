/* @jsxImportSource solid-js */

import { clickOutside } from "@/lib/ui/click-outside";
import { useDisclosureProps } from "@/lib/ui/use-disclosure-props";
import { useToggleState } from "@/lib/ui/use-toggle-state";
import { useOverlayPosition } from "@/lib/ui/use-overlay-position";
import { windowChange } from "@/lib/ui/window-change";
import { Show, type JSX } from "solid-js";

interface NavigationMenuProps {
	children: JSX.Element;
	label: JSX.Element;
}

export function NavigationMenu(props: NavigationMenuProps) {
	const state = useToggleState();
	const disclosure = useDisclosureProps(state);
	const position = useOverlayPosition();

	/** Typescript does not understand which directives are being used. */
	false && clickOutside;
	false && windowChange;

	return (
		<div
			onFocusOut={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					state.close();
				}
			}}
		>
			<button ref={position.setTriggerElement} {...disclosure.triggerProps} onClick={state.toggle}>
				{props.label}
			</button>
			<Show when={state.isOpen}>
				<div
					ref={position.setPopoverElement}
					{...disclosure.panelProps}
					class="z-10 bg-background-overlay rounded-2 shadow-md border border-stroke-weak py-2 my-1"
					style={{
						position: position.strategy,
						top: `${position.y}px`,
						left: `${position.x}px`,
					}}
					use:clickOutside={state.close}
					use:windowChange={state.close}
				>
					{props.children}
				</div>
			</Show>
		</div>
	);
}

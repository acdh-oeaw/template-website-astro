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

	// TODO: should this be part of a hook
	// TODO: how does it behave with click-outside
	function close() {
		position.triggerElement?.focus();
		state.close();
	}

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
			<button
				ref={position.setTriggerElement}
				{...disclosure.triggerProps}
				class="inline-flex gap-x-2 items-center"
				type="button"
			>
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
					use:clickOutside={close}
					use:windowChange={close}
				>
					{props.children}
				</div>
			</Show>
		</div>
	);
}

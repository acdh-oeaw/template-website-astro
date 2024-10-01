/* @jsxImportSource solid-js */

import { type JSX, Show } from "solid-js";

import { clickOutside } from "@/lib/ui/click-outside";
import { useDisclosureProps } from "@/lib/ui/use-disclosure-props";
import { useOverlayPosition } from "@/lib/ui/use-overlay-position";
import { useToggleState } from "@/lib/ui/use-toggle-state";
import { windowChange } from "@/lib/ui/window-change";

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
				class="inline-flex items-center gap-x-2"
				type="button"
			>
				{props.label}
			</button>
			<Show when={state.isOpen}>
				<div
					ref={position.setPopoverElement}
					{...disclosure.panelProps}
					class="z-10 my-1 rounded-2 border border-stroke-weak bg-background-overlay py-2 shadow-md"
					style={{
						position: position.strategy,
						top: `${String(position.y)}px`,
						left: `${String(position.x)}px`,
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

/* @jsxImportSource solid-js */

import { clickOutside } from "@/lib/ui/click-outside";
import { useDisclosureState } from "@/lib/ui/use-disclosure-state";
import { useOverlayPosition } from "@/lib/ui/use-overlay-position";
import { createUniqueId, Show, type JSX } from "solid-js";

interface NavigationMenuProps {
	children: JSX.Element;
	label: string;
}

export function NavigationMenu(props: NavigationMenuProps) {
	const state = useDisclosureState();
	const position = useOverlayPosition();

	const id = createUniqueId();

	/** Typescript does not understand which directives are being used. */
	false && clickOutside;

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
				aria-controls={id}
				aria-expanded={state.isOpen}
				onClick={state.toggle}
			>
				{props.label}
			</button>
			<Show when={state.isOpen}>
				<div
					ref={position.setPopoverElement}
					id={id}
					class="z-10 bg-background-overlay rounded-2 shadow-md border border-stroke-weak py-2 my-1"
					style={{
						position: position.strategy,
						top: `${position.y}px`,
						left: `${position.x}px`,
					}}
					use:clickOutside={state.close}
				>
					{props.children}
				</div>
			</Show>
		</div>
	);
}

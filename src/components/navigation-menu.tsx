/* @jsxImportSource solid-js */

import { clickOutside } from "@/lib/ui/click-outside";
import { useDisclosureState } from "@/lib/ui/use-disclosure-state";
import { useOverlayPosition } from "@/lib/ui/use-overlay-position";
import { Show, type JSX } from "solid-js";

interface NavigationMenuProps {
	children: JSX.Element;
	label: string;
}

export function NavigationMenu(props: NavigationMenuProps) {
	const state = useDisclosureState();
	const position = useOverlayPosition();

	return (
		<div>
			<button ref={position.setTriggerElement} onClick={state.toggle}>
				{props.label}
			</button>
			<Show when={state.isOpen}>
				<div
					ref={position.setPopoverElement}
					class="z-10 bg-background-overlay rounded-2"
					style={{
						position: position.strategy,
						top: `${position.y}px`,
						left: `${position.x}px`,
					}}
					use:clickOutside={state.toggle}
				>
					{props.children}
				</div>
			</Show>
		</div>
	);
}

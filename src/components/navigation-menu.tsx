/* @jsxImportSource solid-js */

import { createEffect, createSignal, Show, type JSX } from "solid-js";
import { computePosition } from "@floating-ui/dom";

interface NavigationMenuProps {
	children: JSX.Element;
	label: string;
}

export function NavigationMenu(props: NavigationMenuProps) {
	const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
	const [popoverRef, setPopoverRef] = createSignal<HTMLDivElement>();

	const [isOpen, setIsOpen] = createSignal(false);

	createEffect(() => {
		if (isOpen()) {
			const reference = triggerRef();
			const floating = popoverRef();

			if (reference && floating) {
				computePosition(reference, floating);
			}
		}
	});

	return (
		<div>
			<button
				ref={setTriggerRef}
				onClick={() => {
					setIsOpen((isOpen) => !isOpen);
				}}
			>
				{props.label}
			</button>
			<Show when={isOpen()}>
				<div ref={setPopoverRef}>{props.children}</div>
			</Show>
		</div>
	);
}

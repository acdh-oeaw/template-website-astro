import {
	computePosition,
	shift,
	type ComputePositionConfig,
	type ComputePositionReturn,
} from "@floating-ui/dom";
import { createEffect, createSignal, onCleanup } from "solid-js";

export function useOverlayPosition() {
	const config = {
		middleware: [shift()],
		placement: "bottom",
		strategy: "absolute",
	} satisfies ComputePositionConfig;

	const [triggerElement, setTriggerElement] = createSignal<HTMLButtonElement>();
	const [popoverElement, setPopoverElement] = createSignal<HTMLElement>();

	const [position, setPosition] = createSignal<ComputePositionReturn>({
		middlewareData: {},
		placement: config.placement,
		strategy: config.strategy,
		x: 0,
		y: 0,
	});

	createEffect(() => {
		const reference = triggerElement();
		const floating = popoverElement();

		if (reference && floating) {
			let isCanceled = false;

			onCleanup(() => {
				isCanceled = true;
			});

			computePosition(reference, floating, config).then((position) => {
				if (!isCanceled) {
					setPosition(position);
				}
			});
		}
	});

	return {
		get x() {
			return position().x;
		},
		get y() {
			return position().y;
		},
		get strategy() {
			return position().strategy;
		},
		setPopoverElement,
		setTriggerElement,
	};
}

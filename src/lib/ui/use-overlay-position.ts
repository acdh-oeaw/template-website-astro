import {
	computePosition,
	shift,
	type ComputePositionConfig,
	type ComputePositionReturn,
	type Strategy,
} from "@floating-ui/dom";
import { createEffect, createSignal, onCleanup, type Setter } from "solid-js";

export interface OverlayPosition {
	x: number;
	y: number;
	strategy: Strategy;
	popoverElement: HTMLElement | undefined;
	setPopoverElement: Setter<HTMLElement | undefined>;
	triggerElement: HTMLButtonElement | undefined;
	setTriggerElement: Setter<HTMLButtonElement | undefined>;
}

export function useOverlayPosition(): OverlayPosition {
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
		get popoverElement() {
			return popoverElement();
		},
		setPopoverElement,
		get triggerElement() {
			return triggerElement();
		},
		setTriggerElement,
	};
}

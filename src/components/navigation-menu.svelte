<script lang="ts">
	import { autoUpdate, computePosition, shift } from "@floating-ui/dom";
	import { onDestroy, type Snippet } from "svelte";

	interface Props {
		chevron: Snippet;
		children: Snippet;
		className?: string;
		label: string;
	}

	const { chevron, children, className, label }: Props = $props();

	const controller = new AbortController();

	onDestroy(() => {
		controller.abort();
	});

	let isOpen = $state(false);

	function open() {
		isOpen = true;
		document.addEventListener("keydown", onKeyDown, { signal: controller.signal });
		document.addEventListener("pointerdown", onPointerDown, { signal: controller.signal });
	}

	function close() {
		isOpen = false;
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("pointerdown", onPointerDown);
	}

	let triggerElement = $state<HTMLButtonElement | null>(null);
	let popoverElement = $state<HTMLElement | null>(null);

	$effect(() => {
		if (triggerElement == null || popoverElement == null) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return autoUpdate(triggerElement, popoverElement, async () => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (triggerElement == null || popoverElement == null) {
				return;
			}

			const { x, y } = await computePosition(triggerElement, popoverElement, {
				middleware: [shift({ padding: 8 })],
				placement: "bottom",
				strategy: "fixed",
			});

			Object.assign(popoverElement.style, {
				position: "fixed",
				left: `${String(x)}px`,
				top: `${String(y)}px`,
			});
		});
	});

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			close();
			triggerElement?.focus();
		}
	}

	function onPointerDown(event: PointerEvent) {
		const element = event.target as Node | null;

		if (popoverElement?.contains(element)) {
			return;
		}
		if (triggerElement?.contains(element)) {
			return;
		}

		close();
	}

	function onFocusOut(event: FocusEvent) {
		const element = event.relatedTarget as Node | null;

		if (popoverElement?.contains(element)) {
			return;
		}

		close();
	}

	const popoverId = `navigation-menu-${crypto.randomUUID()}`;

	// svelte-ignore state_referenced_locally
	const ChevronIcon = chevron;
</script>

<button
	bind:this={triggerElement}
	aria-controls={isOpen ? popoverId : undefined}
	aria-expanded={isOpen}
	class={className}
	onblur={(event) => {
		const element = event.relatedTarget as Node | null;

		if (element == null || !isOpen) {
			return;
		}

		if (element.compareDocumentPosition(event.currentTarget) & Node.DOCUMENT_POSITION_FOLLOWING) {
			close();
		}
	}}
	onclick={() => {
		if (isOpen) {
			close();
		} else {
			open();
		}
	}}
>
	{label}
	<ChevronIcon />
</button>

{#if isOpen}
	<div
		bind:this={popoverElement}
		{@attach (_node: HTMLDivElement) => {
			/**
			 * Not rendering in a portal so we can rely on dom tab order when entering and
			 * exiting the popover.
			 */
			// document.body.append(node);
			//
			// return () => {
			// 	node.remove();
			// };
		}}
		class="z-10"
		id={popoverId}
		onfocusout={onFocusOut}
	>
		{@render children()}
	</div>
{/if}

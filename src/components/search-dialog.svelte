<script lang="ts">
	import "@pagefind/default-ui/css/ui.css";

	import { onDestroy, onMount, type Snippet, tick } from "svelte";

	interface Props {
		closeLabel: string;
		label: string;
		search: Snippet;
		x: Snippet;
	}

	const { closeLabel, label, search, x }: Props = $props();

	let dialogElement = $state<HTMLDialogElement | null>(null);
	let pagefindElement = $state<HTMLElement | null>(null);

	onMount(() => {
		/** Pagefind assets are only generated on build. */
		if (import.meta.env.DEV) {
			return;
		}

		const onIdle =
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			window.requestIdleCallback ||
			((callback) => {
				return setTimeout(callback, 1);
			});

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return onIdle(async () => {
			// @ts-expect-error — Missing types for `@pagefind/default-ui` package.
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const { PagefindUI } = await import("@pagefind/default-ui");

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const ui = new PagefindUI({
				element: pagefindElement,
				baseUrl: import.meta.env.BASE_URL,
				bundlePath: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/pagefind/`,
				showImages: false,
				showSubResults: true,
			});

			return () => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				ui.destroy();
			};
		});
	});

	const triggerId = "search-dialog-trigger";

	// svelte-ignore state_referenced_locally
	const SearchIcon = search;
	// svelte-ignore state_referenced_locally
	const XIcon = x;

	onDestroy(() => {
		dialogElement?.close();
	});
</script>

<button
	class="inline-flex items-center gap-x-2 rounded-xs p-2 text-text-weak focus-outline transition hover:text-text-strong focus-visible:text-text-strong focus-visible:outline-offset-4 disabled:opacity-50"
	disabled={import.meta.env.DEV}
	id={triggerId}
	onclick={() => {
		dialogElement?.showModal();

		void tick().then(() => {
			dialogElement?.querySelector("input")?.focus();
		});
	}}
>
	<SearchIcon />
	{label}
</button>

<dialog
	bind:this={dialogElement}
	aria-labelledby={triggerId}
	class="fixed mx-auto min-h-full w-full max-w-(--breakpoint-md) border border-stroke-weak bg-background-base backdrop:bg-black/50 backdrop:backdrop-blur-sm focus-visible:outline-hidden sm:mt-20 sm:max-h-[calc(100%-10rem)] sm:min-h-64 sm:rounded-sm sm:shadow-lg"
>
	<div class="flex size-full flex-col gap-y-4 px-8 py-6">
		<form method="dialog">
			<button
				class="touch-target absolute top-4 right-4 inline-block rounded-xs text-icon-neutral focus-outline transition hover:text-text-strong focus-visible:text-text-strong focus-visible:outline-offset-4"
			>
				<XIcon />
				<span class="sr-only">{closeLabel}</span>
			</button>
		</form>
		<div class="relative mt-8">
			<div bind:this={pagefindElement}></div>
		</div>
	</div>
</dialog>

<style>
	:global {
		:root:has(dialog[open]) {
			overflow: hidden;
		}

		.pagefind-ui {
			--pagefind-ui-text: var(--color-text-strong);
			--pagefind-ui-background: var(--color-background-base);
			--pagefind-ui-border: var(--color-stroke-weak);
			--pagefind-ui-font: var(--font-body);
		}

		.pagefind-ui :focus-visible {
			outline: 2px solid var(--color-focus-outline);
			outline-offset: 0;
		}

		.pagefind-ui pagefind-ui__search-input {
			--pagefind-ui-border: var(--color-stroke-strong);
		}

		/* stylelint-disable-next-line selector-class-pattern */
		.pagefind-ui .pagefind-ui__search-clear {
			padding-inline: 12px;
		}

		/* stylelint-disable-next-line selector-class-pattern */
		.pagefind-ui .pagefind-ui__result-link:focus-visible {
			padding: 2px;
			border-radius: var(--radius-xs);
			outline-offset: 2px;
			margin-inline-start: -2px;
		}

		.pagefind-ui mark {
			background-color: var(--color-text-strong);
			color: var(--color-background-base);
			font-weight: 500;
		}
	}
</style>

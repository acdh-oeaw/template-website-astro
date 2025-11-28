<script lang="ts">
	import type { Snippet } from "svelte";

	import * as state from "@/components/mobile-nav-menu-store.svelte";

	interface Props {
		children: Snippet;
		className?: string;
	}

	const { children, className }: Props = $props();

	const controller = new AbortController();

	$effect(() => {
		document.addEventListener("astro:before-swap", () => {
			state.close();
		});

		return () => {
			controller.abort();
		};
	});
</script>

<button class={className} onclick={state.toggle}>
	{@render children()}
</button>

<script lang="ts">
	import type { Snippet } from "svelte";

	import * as state from "@/components/mobile-nav-menu-store.svelte";

	interface Props {
		children: Snippet;
		className?: string;
	}

	const { children, className }: Props = $props();
</script>

<button class={className} onclick={state.toggle}>
	{@render children()}
</button>

<script lang="ts">
	import type { Snippet } from "svelte";

	type ColorScheme = "system" | "dark" | "light";

	interface Props {
		colorSchemes: Record<ColorScheme, string>;
		label: string;
		dark: Snippet;
		light: Snippet;
		system: Snippet;
	}

	const { colorSchemes, label, ...icons }: Props = $props();

	let colorSchemeState = $state(window.__colorScheme.get());

	$effect(() => {
		return window.__colorScheme.subscribe(() => {
			colorSchemeState = window.__colorScheme.get();
		});
	});

	const selectedValue = $derived<ColorScheme>(
		colorSchemeState.kind === "system" ? "system" : colorSchemeState.colorScheme,
	);

	function onChange(value: ColorScheme) {
		window.__colorScheme.set(value === "system" ? null : value);
	}

	const groupId = "color-scheme-toggle";
</script>

<div aria-labelledby={groupId} role="group">
	<div class="sr-only" id={groupId}>{label}</div>
	<div class="inline-flex gap-x-2.5">
		{#each Object.entries(colorSchemes) as [value, label] (value)}
			{@const Icon = icons[value as ColorScheme]}
			<label
				class="group touch-target shrink-0"
				data-checked={value === selectedValue || undefined}
			>
				<input
					class="sr-only"
					checked={value === selectedValue}
					name="color-scheme"
					onchange={(event) => {
						onChange(event.currentTarget.value as ColorScheme);
					}}
					type="radio"
					{value}
				/>
				<span class="sr-only">
					{label}
				</span>
				<Icon />
			</label>
		{/each}
	</div>
</div>

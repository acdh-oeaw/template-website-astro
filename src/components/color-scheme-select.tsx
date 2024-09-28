/* @jsxImportSource solid-js */

import { createEffect, For, type JSX } from "solid-js";
import type { ColorScheme } from "@/lib/color-scheme";

interface ColorSchemeSelectProps {
	children: JSX.Element;
}

export function ColorSchemeSelect(props: ColorSchemeSelectProps) {
	function getColorScheme() {
		const colorSchemeState = window.__colorScheme.get();
		return colorSchemeState.kind === "system" ? "system" : colorSchemeState.colorScheme;
	}

	function setColorScheme(value: ColorScheme | "system") {
		window.__colorScheme.set(value === "system" ? null : value);
	}

	const onChange: JSX.ChangeEventHandler<HTMLSelectElement, Event> = function onChange(event) {
		const value = event.currentTarget.value as ColorScheme | "system";
		setColorScheme(value);
	};

	createEffect(() => {
		function update() {
			const value = getColorScheme();
			// TODO: set selection state
		}

		window.__colorScheme.subscribe(update);
	});

	return (
		<select onChange={onChange} value={getColorScheme()}>
			{props.children}
		</select>
	);
}

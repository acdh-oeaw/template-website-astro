type ColorScheme = "dark" | "light";

interface ColorSchemeState {
	kind: "system" | "user";
	colorScheme: ColorScheme;
}

declare global {
	interface Window {
		__colorScheme: {
			apply: () => void;
			get: () => ColorSchemeState;
			set: (colorScheme: ColorScheme | null) => void;
			subscribe: (listener: () => void) => () => void;
		};
	}
}

export {};

import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";

const preset = createPreset();

const config = {
	content: [
		"./src/components/**/*.@(astro|css|ts|tsx)",
		"./src/content/**/*.@(md|mdoc|mdx)",
		"./src/layouts/**/*.@(astro|css|ts|tsx)",
		"./src/pages/**/*.@(astro|css|ts|tsx)",
		"./src/styles/**/*.css",
	],
	presets: [preset],
} satisfies Config;

export default config;

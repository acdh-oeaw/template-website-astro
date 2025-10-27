import { vitePreprocess } from "@astrojs/svelte";
import type { SvelteConfig } from "@sveltejs/vite-plugin-svelte";

const config = {
	preprocess: vitePreprocess(),
} satisfies SvelteConfig;

export default config;

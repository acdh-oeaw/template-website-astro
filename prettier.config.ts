import sharedConfig from "@acdh-oeaw/prettier-config";
import type { Config } from "prettier";

const config: Config = {
	...sharedConfig,
	plugins: ["prettier-plugin-astro", "prettier-plugin-svelte"],
	overrides: [
		...(sharedConfig.overrides ?? []),
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
			},
		},
	],
};

export default config;

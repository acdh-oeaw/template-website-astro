import * as path from "node:path";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import { loadEnv } from "vite";

import { defaultLocale } from "./src/lib/i18n/locales";
import { localeToPrefix } from "./src/lib/i18n/routing";

// eslint-disable-next-line no-restricted-syntax
const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
	base: env.PUBLIC_APP_BASE_PATH,
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: "Inter",
				cssVariable: "--_font-body",
				weights: ["100 900"],
			},
		],
	},
	integrations: [
		icon({
			iconDir: "./src/assets/icons",
			/** @see https://www.astroicon.dev/reference/configuration/#include */
			include: {
				lucide: [
					"chevron-down",
					"globe",
					"laptop",
					"mail",
					"menu",
					"moon",
					"rss",
					"search",
					"sun",
					"x",
				],
				simpleIcons: ["bluesky", "instagram", "linkedin", "mastodon", "twitter", "youtube"],
			},
			svgoOptions: {
				multipass: true,
				plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }],
			},
		}),
		/**
		 * Even though we are using our own mdx processing pipeline, the astro mdx integration is
		 * required. Not entirely sure why, but probably because it disables the built-in astro-jsx
		 * plugin.
		 */
		mdx(),
		svelte({
			exclude: ["**/keystatic/**"],
		}),
		sitemap({
			i18n: {
				locales: localeToPrefix,
				defaultLocale,
			},
		}),
	],
	server: {
		port: 3000,
	},
	site: env.PUBLIC_APP_BASE_URL!,
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@content": path.resolve(".content/generated"),
			},
		},
		server: {
			watch: {
				ignored: ["content/**"],
			},
		},
	},
});

import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import type { Writable } from "type-fest";

import { env } from "./src/config/env.config";
import { defaultLocale, locales } from "./src/config/i18n.config";

export default defineConfig({
	adapter: node({
		mode: "standalone",
	}),
	base: env.PUBLIC_APP_BASE_PATH,
	experimental: {
		contentCollectionCache: true,
	},
	i18n: {
		defaultLocale,
		locales: locales as Writable<typeof locales>,
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: true,
			strategy: "pathname",
		},
	},
	integrations: [
		icon({
			/** @see https://www.astroicon.dev/reference/configuration/#include */
			include: {
				lucide: ["*"],
			},
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: "preset-default",
						params: {
							overrides: {
								removeViewBox: false,
							},
						},
					},
				],
			},
		}),
		keystatic(),
		mdx(),
		react(),
		sitemap({
			i18n: {
				defaultLocale,
				locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
			},
		}),
	],
	markdown: {
		shikiConfig: {
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
		},
	},
	output: "hybrid",
	prefetch: {
		defaultStrategy: "hover",
		prefetchAll: true,
	},
	server: {
		port: 3000,
	},
	site: env.PUBLIC_APP_BASE_URL,
});

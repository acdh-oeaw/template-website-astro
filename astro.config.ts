import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import prefetch from "@astrojs/prefetch";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig, sharpImageService } from "astro/config";
import icon from "astro-icon";

import { env } from "./src/config/env.config";
import { defaultLocale, locales } from "./src/config/i18n.config";

export default defineConfig({
	adapter: node({
		mode: "standalone",
	}),
	experimental: {
		assets: true,
	},
	image: {
		service: sharpImageService(),
	},
	integrations: [
		icon({
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
		markdoc(),
		mdx(),
		prefetch(),
		react(),
		sitemap({
			i18n: {
				defaultLocale,
				locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
			},
		}),
	],
	output: "hybrid",
	server: {
		headers: {
			"X-Robots-Tag": env.BOTS !== "enabled" ? "noindex, nofollow" : undefined,
		},
	},
	site: env.PUBLIC_APP_BASE_URL,
});

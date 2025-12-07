import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config as createConfig } from "@keystatic/core";

import { createPages } from "@/lib/content/keystatic/collections/pages";
import { createIndexPage } from "@/lib/content/keystatic/singletons/index-page";
import { createMetadata } from "@/lib/content/keystatic/singletons/metadata";
import { createNavigation } from "@/lib/content/keystatic/singletons/navigation";

export const config = createConfig({
	collections: {
		[withI18nPrefix("pages", "de")]: createPages("de"),
		[withI18nPrefix("pages", "en")]: createPages("en"),
	},
	singletons: {
		[withI18nPrefix("index-page", "de")]: createIndexPage("de"),
		[withI18nPrefix("index-page", "en")]: createIndexPage("en"),

		[withI18nPrefix("metadata", "de")]: createMetadata("de"),
		[withI18nPrefix("metadata", "en")]: createMetadata("en"),

		[withI18nPrefix("navigation", "de")]: createNavigation("de"),
		[withI18nPrefix("navigation", "en")]: createNavigation("en"),
	},
	storage: {
		kind: "local",
	},
	ui: {
		brand: {
			name: "ACDH Website",
		},
		navigation: {
			Pages: [
				withI18nPrefix("index-page", "de"),
				withI18nPrefix("index-page", "en"),

				withI18nPrefix("pages", "de"),
				withI18nPrefix("pages", "en"),
			],
			Settings: [
				withI18nPrefix("navigation", "de"),
				withI18nPrefix("navigation", "en"),

				withI18nPrefix("metadata", "de"),
				withI18nPrefix("metadata", "en"),
			],
		},
	},
});

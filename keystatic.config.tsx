/* @jsxImportSource react */

import { config } from "@keystatic/core";
import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";

import { Logo } from "@/lib/keystatic/logo";
import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { createPages } from "@/lib/keystatic/collections";
import { createMetadata, createNavigation } from "@/lib/keystatic/singletons";

export default config({
	collections: {
		[withI18nPrefix("pages", "de")]: createPages("de"),
		[withI18nPrefix("pages", "en")]: createPages("en"),
	},
	singletons: {
		[withI18nPrefix("metadata", "de")]: createMetadata("de"),
		[withI18nPrefix("metadata", "en")]: createMetadata("en"),

		[withI18nPrefix("navigation", "de")]: createNavigation("de"),
		[withI18nPrefix("navigation", "en")]: createNavigation("en"),
	},
	storage:
		env.PUBLIC_KEYSTATIC_MODE === "github" &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "Website",
		},
		navigation: {
			Pages: locales.map((locale) => {
				return withI18nPrefix("pages", locale);
			}),
			Navigation: locales.map((locale) => {
				return withI18nPrefix("navigation", locale);
			}),
			Metadata: locales.map((locale) => {
				return withI18nPrefix("metadata", locale);
			}),
		},
	},
});

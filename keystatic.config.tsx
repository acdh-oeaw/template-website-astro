/* @jsxImportSource react */

import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { createPages } from "@/lib/keystatic/collections";
import { Logo } from "@/lib/keystatic/logo";
import { createIndexPage, createMetadata, createNavigation } from "@/lib/keystatic/singletons";

export default config({
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
			HomePage: locales.map((locale) => {
				return withI18nPrefix("index-page", locale);
			}),
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

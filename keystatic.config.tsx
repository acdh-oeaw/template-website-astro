/* @jsxImportSource react */

import { config } from "@keystatic/core";

import { Logo } from "@/components/content/logo";
import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { collections } from "@/lib/content/collections";
import { i18n, withI18nPrefix } from "@/lib/content/i18n";
import { singletons } from "@/lib/content/singletons";

export default config({
	collections: i18n(collections),
	singletons: i18n(singletons),
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
			data: [],
			pages: [
				...locales.map((locale) => withI18nPrefix(locale, "indexPage")),
				"---",
				...locales.map((locale) => withI18nPrefix(locale, "pages")),
			],
			settings: [
				...locales.map((locale) => withI18nPrefix(locale, "metadata")),
				"---",
				...locales.map((locale) => withI18nPrefix(locale, "navigation")),
			],
		},
	},
});

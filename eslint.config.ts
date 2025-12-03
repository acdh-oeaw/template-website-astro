import * as path from "node:path";

import baseConfig from "@acdh-oeaw/eslint-config";
import astroConfig from "@acdh-oeaw/eslint-config-astro";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import svelteConfig from "@acdh-oeaw/eslint-config-svelte";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import { defineConfig } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";
import checkFilePlugin from "eslint-plugin-check-file";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import unicornPlugin from "eslint-plugin-unicorn";

import svelteConfigFile from "./svelte.config.ts";

const KEBAB_CASE = "+([a-z])*([a-z0-9])*(-+([a-z0-9]))";
const CAMEL_CASE = "+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))";
const DYNAMIC_SEGMENTS = String.raw`\[${CAMEL_CASE}\]`;
const CATCH_ALL_SEGMENTS = String.raw`\[...${CAMEL_CASE}\]`;
const MIDDLE_EXTENSION = "*(.+([a-z0-9]))";

const astroFiles = "**/*.astro";
const reactFiles = "**/keystatic/**/*.@(ts|tsx)";
const svelteFiles = ["**/*.svelte", "**/*.svelte.ts"];

export default defineConfig(
	gitignore({ strict: false }),
	{ ignores: ["content/**", "public/**"] },
	{
		extends: [baseConfig],
		rules: {
			"arrow-body-style": ["error", "always"],
			"no-restricted-syntax": [
				"error",
				{
					message: "Please use `@/config/env.config` instead.",
					selector: 'MemberExpression[computed!=true][object.name="process"][property.name="env"]',
				},
			],
			"object-shorthand": ["error", "always", { avoidExplicitReturnArrows: true }],
			"preserve-caught-error": "error",
			"@typescript-eslint/explicit-module-boundary-types": [
				"error",
				{ allowedNames: ["getStaticPaths"] },
			],
			"@typescript-eslint/require-array-sort-compare": "error",
			// "@typescript-eslint/strict-boolean-expressions": "error",
		},
	},
	{
		extends: [unicornPlugin.configs.unopinionated],
		rules: {
			"unicorn/catch-error-name": "error",
			"unicorn/consistent-destructuring": "error",
			"unicorn/explicit-length-check": "error",
			"unicorn/import-style": [
				"error",
				{
					extendDefaultStyles: false,
					styles: {
						fs: { namespace: true },
						path: { namespace: true },
					},
				},
			],
			"unicorn/no-negated-condition": "off",
			"unicorn/no-useless-undefined": "off",
			"unicorn/prefer-global-this": "off",
			"unicorn/prefer-single-call": "off",
			"unicorn/prefer-top-level-await": "off",
			"unicorn/require-module-specifiers": "off",
			"unicorn/switch-case-braces": "error",
			"unicorn/text-encoding-identifier-case": ["error", { withDash: true }],
		},
	},
	{
		ignores: [reactFiles, ...svelteFiles],
		extends: [astroConfig],
		rules: {
			"astro/sort-attributes": "error",
		},
	},
	{
		files: [...svelteFiles],
		ignores: [astroFiles, reactFiles],
		extends: [svelteConfig],
		languageOptions: {
			parserOptions: {
				svelteConfig: svelteConfigFile,
			},
		},
	},
	{
		files: [reactFiles],
		ignores: [astroFiles, ...svelteFiles],
		extends: [reactConfig],
		rules: {
			"@eslint-react/prefer-read-only-props": "error",
			/** Avoid hardcoded, non-translated strings. */
			"react/jsx-no-literals": [
				"error",
				{
					allowedStrings: [
						"&amp;",
						"&apos;",
						"&bull;",
						"&copy;",
						"&gt;",
						"&lt;",
						"&nbsp;",
						"&quot;",
						"&rarr;",
						"&larr;",
						"&mdash;",
						"&ndash;",
						".",
						"!",
						":",
						";",
						",",
						"-",
						"(",
						")",
						"|",
						"/",
					],
				},
			],
		},
	},
	{
		name: "tailwindcss-config",
		extends: [tailwindcssConfig],
		rules: {
			"better-tailwindcss/no-unregistered-classes": ["error", { ignore: ["lead", "not-richtext"] }],
		},
		settings: {
			"better-tailwindcss": {
				entryPoint: path.resolve("./styles/index.css"),
			},
		},
	},
	playwrightConfig,
	{
		name: "file-naming-conventions",
		plugins: {
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": `@(${KEBAB_CASE}${MIDDLE_EXTENSION}|${DYNAMIC_SEGMENTS}|${CATCH_ALL_SEGMENTS}|404|500)`,
				},
			],
			"check-file/folder-naming-convention": [
				"error",
				{
					"**/": `@(${KEBAB_CASE}|${DYNAMIC_SEGMENTS}|${CATCH_ALL_SEGMENTS})`,
				},
			],
		},
	},
	{
		extends: [nodeConfig],
		files: ["scripts/**/*.ts"],
		name: "node-environment",
	},
	{
		name: "stylistic",
		plugins: {
			perfectionist: perfectionistPlugin,
		},
		rules: {
			"perfectionist/sort-jsx-props": [
				"error",
				{
					customGroups: [
						{
							groupName: "reserved",
							elementNamePattern: ["^key$", "^ref$"],
						},
					],
					groups: ["reserved", "unknown"],
					partitionByNewLine: true,
				},
			],
		},
	},
);

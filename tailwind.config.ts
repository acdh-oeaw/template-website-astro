import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import animatePlugin from "tailwindcss-animate";

const config = {
	content: ["./src/@(components|config|layouts|lib|pages|styles)/**/*.@(astro|css|ts|tsx)"],
	corePlugins: {
		container: false,
	},
	darkMode: [
		"variant",
		[
			'&:where([data-ui-color-scheme="dark"], [data-ui-color-scheme="dark"] *)',
			/** Keystatic. */
			"&:where(.kui-theme.kui-scheme--dark, .kui-theme.kui-scheme--dark *)",
		],
	],
	plugins: [animatePlugin, typographyPlugin],
	theme: {
		extend: {
			colors: {
				neutral: {
					0: "white",
					...colors.neutral,
					1000: "black",
				},
				bg: "color-mix(in sRGB, var(--color-bg) calc(<alpha-value> * 100%), transparent)",
				fg: "color-mix(in sRGB, var(--color-fg) calc(<alpha-value> * 100%), transparent)",
				"focus-ring":
					"color-mix(in sRGB, var(--color-focus-ring) calc(<alpha-value> * 100%), transparent)",
				positive:
					"color-mix(in sRGB, var(--color-positive) calc(<alpha-value> * 100%), transparent)",
				negative:
					"color-mix(in sRGB, var(--color-negative) calc(<alpha-value> * 100%), transparent)",
			},
			fontFamily: {
				body: "var(--font-body, ui-sans-serif), system-ui, sans-serif",
				heading: "var(--font-heading, var(--font-body, ui-sans-serif)), system-ui, sans-serif",
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: null,
						/** Don't add quotes around `blockquote`. */
						"blockquote p:first-of-type::before": null,
						"blockquote p:last-of-type::after": null,
						/** Don't add backticks around inline `code`. */
						"code::before": null,
						"code::after": null,
					},
				},
			},
		},
		screens: {
			xs: "30rem",
			sm: "40rem",
			md: "48rem",
			lg: "64rem",
			xl: "80rem",
			"2xl": "96rem",
			"3xl": "120rem",
		},
	},
} satisfies Config;

export default config;

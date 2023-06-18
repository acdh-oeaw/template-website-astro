/* @jsxImportSource react */

import { createUrl, createUrlSearchParams, pick } from "@acdh-oeaw/lib";
import { fields, NotEditable } from "@keystatic/core";
import { block, inline, mark, repeating, wrapper } from "@keystatic/core/content-components";
import {
	CaptionsIcon,
	ExpandIcon,
	GridIcon,
	HeadingIcon,
	ImageIcon,
	InfoIcon,
	LinkIcon,
	// ListIcon,
	SuperscriptIcon,
	VideoIcon,
} from "lucide-react";

import type { Locale } from "@/config/i18n.config";
import { createAssetPaths } from "@/lib/content/create-asset-paths";
import { withI18nPrefix } from "@/lib/content/i18n";
import { useObjectUrl } from "@/lib/content/use-object-url";
import { cn } from "@/lib/styles";

/** @see https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts */
export const calloutKinds = [
	{ label: "Caution", value: "caution" },
	{ label: "Important", value: "important" },
	{ label: "Note", value: "note" },
	{ label: "Tip", value: "tip" },
	{ label: "Warning", value: "warning" },
] as const;

export const figureAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

export const gridVariants = [
	{ label: "Two columns", value: "two-columns" },
	{ label: "Three columns", value: "three-columns" },
	{ label: "Four columns", value: "four-columns" },
	{ label: "Two columns, right is 2x as wide", value: "one-two-columns" },
	{ label: "Two columns, right is 3x as wide", value: "one-three-columns" },
	{ label: "Two columns, right is 4x as wide", value: "one-four-columns" },
] as const;

export const linkCollections = [
	{ label: "Download", value: "download" },
	{ label: "External URL", value: "external" },
	{ label: "Pages", value: "pages" },
] as const;

export const videoProviders = [{ label: "YouTube", value: "youtube" }] as const;

function create(assetPath: `/${string}/`, locale: Locale) {
	return {
		Callout: wrapper({
			label: "Callout",
			description: "A panel with additional information.",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					options: calloutKinds,
					defaultValue: "note",
				}),
				title: fields.text({
					label: "Title",
					// validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<aside>
						{value.title ? (
							<NotEditable>
								<strong>{value.title}</strong>
							</NotEditable>
						) : null}
						{children}
					</aside>
				);
			},
		}),
		Disclosure: wrapper({
			label: "Disclosure",
			description: "An expandable panel.",
			icon: <ExpandIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<details>
						<NotEditable>
							<summary>{value.title}</summary>
						</NotEditable>
						{children}
					</details>
				);
			},
		}),
		Embed: wrapper({
			label: "Embed",
			description: "Another website, embedded via iframe.",
			icon: <VideoIcon />,
			schema: {
				src: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<figure>
						<NotEditable>
							<iframe allowFullScreen={true} src={value.src ?? undefined} title="Iframe" />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
		Figure: wrapper({
			label: "Figure",
			description: "An image with caption.",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetPaths(assetPath),
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					// validation: { isRequired: false },
				}),
				alignment: fields.select({
					label: "Alignment",
					options: figureAlignments,
					defaultValue: "stretch",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const contentType = value.src?.extension === "svg" ? "image/svg+xml" : undefined;
				const src = useObjectUrl(value.src?.data ?? null, contentType);

				if (src == null) {
					return null;
				}

				return (
					<figure>
						<NotEditable>
							<img alt={value.alt} src={src} />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			className: "underline decoration-dotted align-super text-xs",
			schema: {},
		}),
		Grid: repeating({
			label: "Grid",
			description: "A grid layout.",
			icon: <GridIcon />,
			children: ["GridItem"],
			schema: {
				variant: fields.select({
					label: "Variant",
					options: gridVariants,
					defaultValue: "two-columns",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const variants = {
					"two-columns": "sm:grid-cols-2",
					"three-columns": "sm:grid-cols-3",
					"four-columns": "sm:grid-cols-4",
					"one-two-columns": "sm:grid-cols-[1fr_2fr]",
					"one-three-columns": "sm:grid-cols-[1fr_3fr]",
					"one-four-columns": "sm:grid-cols-[1fr_4fr]",
				};

				return (
					<div className={cn("grid content-start gap-8", variants[value.variant])}>{children}</div>
				);
			},
		}),
		GridItem: wrapper({
			label: "Grid item",
			description: "A grid cell.",
			icon: <GridIcon />,
			forSpecificLocations: true,
			schema: {},
		}),
		HeadingId: inline({
			label: "Heading ID",
			description: "A custom heading id as a link target.",
			icon: <HeadingIcon />,
			schema: {
				id: fields.text({
					label: "Identifier",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return (
					<NotEditable>
						<span className="opacity-50">#{value.id}</span>
					</NotEditable>
				);
			},
		}),
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			tag: "a",
			schema: {
				item: fields.conditional(
					fields.select({
						label: "Collection",
						options: linkCollections,
						defaultValue: "pages",
					}),
					{
						download: fields.file({
							label: "File",
							validation: { isRequired: true },
							...createAssetPaths(assetPath),
						}),
						external: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						pages: fields.relationship({
							label: "Page",
							validation: { isRequired: true },
							collection: withI18nPrefix(locale, "pages"),
						}),
					},
				),
			},
		}),
		LinkButton: block({
			label: "Link button",
			description: "A link which looks like a button.",
			icon: <LinkIcon />,
			schema: {
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				item: fields.conditional(
					fields.select({
						label: "Collection",
						options: linkCollections,
						defaultValue: "pages",
					}),
					{
						download: fields.file({
							label: "File",
							validation: { isRequired: true },
							...createAssetPaths(assetPath),
						}),
						external: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
						pages: fields.relationship({
							label: "Page",
							validation: { isRequired: true },
							collection: withI18nPrefix(locale, "pages"),
						}),
					},
				),
			},
			ContentView(props) {
				const { value } = props;

				return <NotEditable>{value.label}</NotEditable>;
			},
		}),
		Tab: wrapper({
			label: "Tab",
			description: "A tab.",
			icon: <CaptionsIcon />,
			forSpecificLocations: true,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
		}),
		/** Needs to be enabled in `@/lib/content/with-table-of-contents.js`. */
		// TableOfContents: block({
		// 	label: "Table of contents",
		// 	description: "Insert a table of contents",
		// 	icon: <ListIcon />,
		// 	schema: {
		// 		title: fields.text({
		// 			label: "Title",
		// 			// validation: { isRequired: false },
		// 		}),
		// 	},
		// }),
		Tabs: repeating({
			label: "Tabs",
			description: "Multiple tabs.",
			icon: <CaptionsIcon />,
			children: ["Tab"],
			schema: {},
		}),
		Video: wrapper({
			label: "Video",
			description: "A YouTube video.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video identifier",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					// validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const href = String(
					createUrl({
						baseUrl: "https://www.youtube-nocookie.com",
						pathname: `/embed/${value.id}`,
						searchParams: value.startTime
							? createUrlSearchParams({ t: value.startTime })
							: undefined,
					}),
				);

				return (
					<figure>
						<NotEditable>
							<iframe allowFullScreen={true} src={href} title="Video" />
						</NotEditable>
						{children ? <figcaption>{children}</figcaption> : null}
					</figure>
				);
			},
		}),
	};
}

type Components = ReturnType<typeof create>;

export function createComponents(
	assetPath: `/${string}/`,
	locale: Locale,
	include?: Array<keyof Components>,
) {
	const components = create(assetPath, locale);
	return include ? pick(components, include) : components;
}

export const headingLevels = [2, 3, 4, 5] as const;

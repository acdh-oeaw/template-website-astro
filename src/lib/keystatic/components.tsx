/* @jsxImportSource react */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { fields } from "@keystatic/core";
import { block, inline, mark, repeating, wrapper } from "@keystatic/core/content-components";
import {
	AppWindowIcon,
	CaptionsIcon,
	ChevronDownSquareIcon,
	GridIcon,
	HashIcon,
	ImageIcon,
	InfoIcon,
	LinkIcon,
	ListIcon,
	SquareIcon,
	SuperscriptIcon,
	TwitterIcon,
	VideoIcon,
} from "lucide-react";

import { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import { FigurePreview, TweetPreview, VideoPreview } from "@/lib/keystatic/previews";
import {
	calloutKinds,
	figureAlignments,
	gridLayouts,
	videoProviders,
} from "@/lib/keystatic/component-options";

export const createCallout = createComponent((_assetPath, _locale) => {
	return {
		Callout: wrapper({
			label: "Callout",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					options: calloutKinds,
					defaultValue: "note",
				}),
				title: fields.text({
					label: "Title",
					validation: { isRequired: false },
				}),
			},
			// ContentView(props) {},
		}),
	};
});

export const createDisclosure = createComponent((_assetPath, _locale) => {
	return {
		Disclosure: wrapper({
			label: "Disclosure",
			icon: <ChevronDownSquareIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			// ContentView(props) {},
		}),
	};
});

export const createEmbed = createComponent((_assetPath, _locale) => {
	return {
		Embed: wrapper({
			label: "Embed",
			icon: <AppWindowIcon />,
			schema: {
				src: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			// ContentView(props) {},
		}),
	};
});

export const createFigure = createComponent((assetPath, _locale) => {
	return {
		Figure: wrapper({
			label: "Figure",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(assetPath),
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					validation: { isRequired: false },
				}),
				alignment: fields.select({
					label: "Alignment",
					options: figureAlignments,
					defaultValue: "stretch",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				const src = useObjectUrl(value.src);

				if (src == null) return null;

				return (
					<FigurePreview alignment={value.alignment} alt={value.alt} src={src}>
						{children}
					</FigurePreview>
				);
			},
		}),
	};
});

export const createFootnote = createComponent((_assetPath, _locale) => {
	return {
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			schema: {},
			className: "underline decoration-dotted align-super text-sm",
			// ContentView(props) {},
		}),
	};
});

export const createGrid = createComponent((_assetPath, _locale) => {
	return {
		Grid: repeating({
			label: "Grid",
			icon: <GridIcon />,
			schema: {
				layout: fields.select({
					label: "Layout",
					options: gridLayouts,
					defaultValue: "two-columns",
				}),
			},
			children: ["GridItem"],
			// ContentView(props) {},
		}),
		GridItem: wrapper({
			label: "Grid item",
			icon: <SquareIcon />,
			schema: {},
			forSpecificLocations: true,
			// ContentView(props) {},
		}),
	};
});

export const createHeadingId = createComponent((_assetPath, _locale) => {
	return {
		HeadingId: inline({
			label: "HeadingId",
			icon: <HashIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <span className="opacity-50">#{value.id}</span>;
			},
		}),
	};
});

export const createLink = createComponent((assetPath, locale) => {
	return {
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(assetPath, locale),
			},
			tag: "a",
			// ContentView(props) {},
		}),
	};
});

export const createLinkButton = createComponent((assetPath, locale) => {
	return {
		Link: block({
			label: "LinkButton",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(assetPath, locale),
			},
			// ContentView(props) {},
		}),
	};
});

export const createTableOfContents = createComponent(() => {
	return {
		TableOfContents: block({
			label: "Table of contents",
			icon: <ListIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: false },
				}),
			},
			// ContentView(props) {},
		}),
	};
});

export const createTabs = createComponent((_assetPath, _locale) => {
	return {
		Tabs: repeating({
			label: "Tabs",
			icon: <CaptionsIcon />,
			schema: {},
			children: ["Tab"],
			// ContentView(props) {},
		}),
		Tab: wrapper({
			label: "Tab",
			icon: <CaptionsIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			forSpecificLocations: true,
			// ContentView(props) {},
		}),
	};
});

export const createTweet = createComponent((_assetPath, _locale) => {
	return {
		Tweet: wrapper({
			label: "Tweet",
			icon: <TwitterIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <TweetPreview id={value.id}>{children}</TweetPreview>;
			},
		}),
	};
});

export const createVideo = createComponent((_assetPath, _locale) => {
	return {
		Video: wrapper({
			label: "Video",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<VideoPreview id={value.id} provider={value.provider} startTime={value.startTime}>
						{children}
					</VideoPreview>
				);
			},
		}),
	};
});

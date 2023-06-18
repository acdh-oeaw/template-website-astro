import { type ImageMetadata } from "astro";

import { type Locale } from "~/config/i18n.config";

interface Metadata<L extends Locale> {
	locale: L;
	title: string;
	description: string;
	image: ImageMetadata & { alt?: string };
	twitter?: string;
}

export const metadata: { [L in Locale]: Metadata<L> } = {
	de: {
		locale: "de",
		title: "ACDH-CH Website",
		description: "",
		image: {
			src: "/assets/images/opengraph-image.png",
			width: 1200,
			height: 630,
			format: "png",
		},
		twitter: "acdh_oeaw",
	},
	en: {
		locale: "en",
		title: "ACDH-CH Website",
		description: "",
		image: {
			src: "/assets/images/opengraph-image.png",
			width: 1200,
			height: 630,
			format: "png",
		},
		twitter: "acdh_oeaw",
	},
};

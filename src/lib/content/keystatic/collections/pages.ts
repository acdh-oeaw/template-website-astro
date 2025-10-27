import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	createLabel,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import { createEmbed } from "@/lib/content/keystatic/components/embed";
import { createFigure } from "@/lib/content/keystatic/components/figure";
import { createFootnote } from "@/lib/content/keystatic/components/footnote";
import { createLink } from "@/lib/content/keystatic/components/link";

// import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";

export const createPages = createCollection("/pages/", (paths, locale) => {
	return collection({
		label: createLabel("Pages", locale),
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "form",
		// previewUrl: createPreviewUrl(`/${locale}/{slug}/`),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			lead: fields.text({
				label: "Lead",
				validation: { isRequired: true },
				multiline: true,
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: false },
				...createAssetOptions(paths.assetPath),
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					...createContentFieldOptions(paths),
				},
				components: {
					...createEmbed(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createLink(paths, locale),
				},
			}),
		},
	});
});

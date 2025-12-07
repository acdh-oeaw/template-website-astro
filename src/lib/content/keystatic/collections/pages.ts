import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	createLabel,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

export const createPages = createCollection("/pages/", (paths, locale) => {
	return collection({
		label: createLabel("Pages", locale),
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "form",
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
				components: {},
			}),
		},
	});
});

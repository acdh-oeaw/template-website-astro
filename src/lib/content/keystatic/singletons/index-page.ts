import {
	createAssetOptions,
	createContentFieldOptions,
	createLabel,
	createSingleton,
} from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

import { createLinkSchema } from "@/lib/content/keystatic/utils/create-link-schema";

export const createIndexPage = createSingleton("/index-page/", (paths, locale) => {
	const link = createLinkSchema(paths.downloadPath, locale);

	return singleton({
		label: createLabel("Home page", locale),
		path: paths.contentPath,
		format: { contentField: "content" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			subtitle: fields.text({
				label: "Subtitle",
				validation: { isRequired: true },
				multiline: true,
			}),
			image: fields.image({
				label: "Image",
				validation: { isRequired: true },
				...createAssetOptions(paths.assetPath),
			}),
			lead: fields.text({
				label: "Lead",
				validation: { isRequired: true },
				multiline: true,
			}),
			links: fields.array(
				fields.object({
					label: fields.text({
						label: "Label",
						validation: { isRequired: true },
					}),
					link,
				}),
				{
					label: "Links",
					validation: { length: { min: 0 } },
					itemLabel(props) {
						return props.fields.label.value;
					},
				},
			),
			content: fields.mdx({
				label: "Content",
				options: {
					...createContentFieldOptions(paths),
					codeBlock: false,
					image: false,
					table: false,
				},
				components: {},
			}),
		},
	});
});

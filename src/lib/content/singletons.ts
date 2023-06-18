import { fields, singleton } from "@keystatic/core";

import { createAssetPaths } from "@/lib/content/create-asset-paths";
import { createSingletonPaths } from "@/lib/content/create-paths";
// import { createPreviewUrl } from "@/lib/content/create-preview-url";
import { createSingleton } from "@/lib/content/create-singleton";
import { withI18nPrefix } from "@/lib/content/i18n";
import * as validation from "@/lib/content/validation";

const indexPage = createSingleton((locale) => {
	const { assetPath, contentPath } = createSingletonPaths("/index-page/", locale);

	return singleton({
		label: `Home page (${locale})`,
		path: contentPath,
		format: { data: "json" },
		// previewUrl: createPreviewUrl("/"),
		entryLayout: "form",
		schema: {
			hero: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					image: fields.image({
						label: "Image",
						validation: { isRequired: true },
						...createAssetPaths(assetPath),
					}),
				},
				{
					label: "Hero section",
				},
			),
			main: fields.object(
				{
					sections: fields.blocks(
						{
							data: {
								label: "Data section",
								itemLabel(props) {
									return props.fields.title.value;
								},
								schema: fields.object({
									title: fields.text({
										label: "Title",
										validation: { isRequired: true },
									}),
									collections: fields.multiselect({
										label: "Collection",
										options: [
											{ label: "Activities", value: withI18nPrefix(locale, "activities") },
											{ label: "Newsletters", value: withI18nPrefix(locale, "newsletters") },
										],
										defaultValue: [
											withI18nPrefix(locale, "activities"),
											withI18nPrefix(locale, "newsletters"),
										],
									}),
									count: fields.number({
										label: "Count",
										validation: { isRequired: true },
									}),
								}),
							},
							links: {
								label: "Links section",
								itemLabel(props) {
									return props.fields.title.value;
								},
								schema: fields.object({
									title: fields.text({
										label: "Title",
										validation: { isRequired: true },
									}),
									links: fields.blocks(
										{
											page: {
												label: "Page",
												itemLabel(props) {
													return props.fields.title.value;
												},
												schema: fields.object(
													{
														title: fields.text({
															label: "Title",
															validation: { isRequired: true },
														}),
														id: fields.relationship({
															label: "Page",
															validation: { isRequired: true },
															collection: withI18nPrefix(locale, "pages"),
														}),
													},
													{
														label: "Page",
													},
												),
											},
										},
										{
											label: "Links",
										},
									),
								}),
							},
						},
						{
							label: "Sections",
						},
					),
				},
				{
					label: "Main content",
				},
			),
		},
	});
});

const metadata = createSingleton((locale) => {
	const { contentPath } = createSingletonPaths("/metadata/", locale);

	return singleton({
		label: `Metadata (${locale})`,
		path: contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			description: fields.text({
				label: "Description",
				validation: { isRequired: true },
			}),
			twitter: fields.object(
				{
					creator: fields.text({
						label: "Creator",
						validation: { isRequired: true, pattern: validation.twitterHandle },
					}),
					site: fields.text({
						label: "Site",
						validation: { isRequired: true, pattern: validation.twitterHandle },
					}),
				},
				{
					label: "Twitter",
				},
			),
			manifest: fields.object(
				{
					name: fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					"short-name": fields.text({
						label: "Short name",
						validation: { isRequired: true },
					}),
					description: fields.text({
						label: "Description",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Webmanifest",
				},
			),
		},
	});
});

const navigation = createSingleton((locale) => {
	const { contentPath } = createSingletonPaths("/navigation/", locale);

	const links = {
		link: fields.object(
			{
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				href: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			{
				label: "Link",
			},
		),
		page: fields.object(
			{
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
				id: fields.relationship({
					label: "Page",
					validation: { isRequired: true },
					collection: withI18nPrefix(locale, "pages"),
				}),
			},
			{
				label: "Page",
			},
		),
		separator: fields.empty(),
	};

	return singleton({
		label: `Navigation (${locale})`,
		path: contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			links: fields.blocks(
				{
					link: {
						label: "Link",
						itemLabel(props) {
							return `${props.fields.label.value} (Link)`;
						},
						schema: links.link,
					},
					page: {
						label: "Page",
						itemLabel(props) {
							return `${props.fields.label.value} (Page)`;
						},
						schema: links.page,
					},
					separator: {
						label: "Separator",
						schema: links.separator,
					},
					menu: {
						label: "Menu",
						itemLabel(props) {
							return `${props.fields.label.value} (Menu)`;
						},
						schema: fields.object(
							{
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
								links: fields.blocks(
									{
										link: {
											label: "Link",
											itemLabel(props) {
												return props.fields.label.value;
											},
											schema: links.link,
										},
										page: {
											label: "Page",
											itemLabel(props) {
												return `${props.fields.label.value} (Page)`;
											},
											schema: links.page,
										},
										separator: {
											label: "Separator",
											schema: links.separator,
										},
									},
									{
										label: "Links",
										validation: { length: { min: 1 } },
									},
								),
							},
							{
								label: "Menu",
							},
						),
					},
				},
				{
					label: "Links",
					validation: { length: { min: 1 } },
				},
			),
		},
	});
});

export const singletons = {
	indexPage,
	metadata,
	navigation,
} as const;

export type Singletons = keyof typeof singletons;

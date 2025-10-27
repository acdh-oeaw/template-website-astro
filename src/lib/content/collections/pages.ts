import path from "node:path";

import { createCollection } from "@acdh-oeaw/content-lib";
import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import type { ImageMetadata } from "astro";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, type CompileOptions } from "@/lib/content/mdx/compile";
import {
	createCustomHeadingIdsPlugin,
	createHeadingIdsPlugin,
	createIframeTitlesPlugin,
	createImageImportsPlugin,
	createSyntaxHighlighterPlugin,
	createTableOfContentsPlugin,
} from "@/lib/content/mdx/rehype-plugins";
import {
	createFootnotesPlugin,
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";

const publicPath = "../../../public/";

function createPagesCollection<TLocale extends IntlLocale>(locale: TLocale) {
	const language = getIntlLanguage(locale);
	const collection = withI18nPrefix("pages", language);

	const compileOptions: CompileOptions = {
		remarkPlugins: [
			createGitHubMarkdownPlugin(),
			createFootnotesPlugin(),
			createTypographicQuotesPlugin(language),
		],
		remarkRehypeOptions: createRemarkRehypeOptions(locale),
		rehypePlugins: [
			createCustomHeadingIdsPlugin(),
			createHeadingIdsPlugin(),
			createTableOfContentsPlugin(),
			createIframeTitlesPlugin(["Embed"]),
			createSyntaxHighlighterPlugin(),
			createImageImportsPlugin(["Figure"], publicPath),
		],
	};

	return createCollection({
		name: collection,
		directory: `./content/${language}/pages/`,
		include: ["*/index.mdx"],
		read(item) {
			return reader.collections[collection].readOrThrow(item.id, { resolveLinkedFiles: true });
		},
		async transform(data, item, context) {
			const { content, image: _image, ...metadata } = data;

			const input = new VFile({ path: item.absoluteFilePath, value: content });
			const output = await compile(input, compileOptions);
			const module = context.createJavaScriptImport<MDXContent>(String(output));
			const tableOfContents = output.data.tableOfContents ?? [];
			const image =
				_image != null
					? context.createImportDeclaration<ImageMetadata>(path.join(publicPath, _image))
					: null;

			return {
				id: item.id,
				content: module,
				metadata: {
					...metadata,
					image,
				},
				tableOfContents,
			};
		},
	});
}

export const pages = {
	de: createPagesCollection("de-AT"),
	en: createPagesCollection("en-GB"),
};

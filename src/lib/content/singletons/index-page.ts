import path from "node:path";

import { createCollection } from "@acdh-oeaw/content-lib";
import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import type { ImageMetadata } from "astro";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, type CompileOptions } from "@/lib/content/mdx/compile";
import {
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";

const publicPath = "../../../public/";

function createIndexPageCollection<TLocale extends IntlLocale>(locale: TLocale) {
	const language = getIntlLanguage(locale);
	const collection = withI18nPrefix("index-page", language);

	const compileOptions: CompileOptions = {
		remarkPlugins: [createGitHubMarkdownPlugin(), createTypographicQuotesPlugin(language)],
		remarkRehypeOptions: createRemarkRehypeOptions(locale),
		rehypePlugins: [],
	};

	return createCollection({
		name: collection,
		directory: `./content/${language}/index-page/`,
		include: ["index.mdx"],
		read() {
			return reader.singletons[collection].readOrThrow({ resolveLinkedFiles: true });
		},
		async transform(data, item, context) {
			const { content, image: _image, ...metadata } = data;

			const input = new VFile({ path: item.absoluteFilePath, value: content });
			const output = await compile(input, compileOptions);
			const module = context.createJavaScriptImport<MDXContent>(String(output));
			const image = context.createImportDeclaration<ImageMetadata>(path.join(publicPath, _image));

			return {
				id: item.id,
				content: module,
				metadata: {
					...metadata,
					image,
				},
			};
		},
	});
}

export const indexPage = {
	de: createIndexPageCollection("de-AT"),
	en: createIndexPageCollection("en-GB"),
};

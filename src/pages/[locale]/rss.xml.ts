import { assert } from "@acdh-oeaw/lib";
import rss from "@astrojs/rss";
import { type APIContext, type GetStaticPathsItem } from "astro";
import { getCollection } from "astro:content";
import { compareDesc } from "date-fns";

import { getContentEntryId } from "@/lib/get-content-entry-id";
import { useLocale } from "@/lib/use-locale";
import { useLocaleLink } from "@/lib/use-locale-link";
import { type Locale, locales } from "@/config/i18n.config";
import { metadata } from "@/config/metadata.config";

type Params = {
	locale: Locale;
};

interface Path extends GetStaticPathsItem {
	params: Params;
}

export async function getStaticPaths(): Promise<Array<Path>> {
	return locales.map((locale) => {
		return {
			params: { locale },
		};
	});
}

export async function get(context: APIContext) {
	const locale = useLocale(context);
	const l = useLocaleLink(locale);
	const meta = metadata[locale];
	const unsortedPosts = await getCollection("posts", (entry) => {
		return entry.id.startsWith(locale + "/");
	});
	const posts = unsortedPosts.sort((a, z) => {
		return compareDesc(a.data.date, z.data.date);
	});

	assert(context.site != null);

	return rss({
		title: meta.title,
		description: meta.description,
		site: String(context.site),
		/** @see https://github.com/withastro/astro/issues/7461 */
		customData: `<language>${locale}</language>`,
		items: posts.map((post) => {
			const id = getContentEntryId(post);

			return {
				title: post.data.title,
				pubDate: post.data.date,
				description: post.data.description,
				// TODO: author,
				link: String(l(`/posts/${id}`)),
			};
		}),
	});
}

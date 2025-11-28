import rss from "@astrojs/rss";
import type { APIContext, GetStaticPathsResult } from "astro";

import { getMetadata } from "@/lib/i18n/get-metadata";
import { getIntlLanguage, locales } from "@/lib/i18n/locales";
import { localeToPrefix } from "@/lib/i18n/routing";

export function getStaticPaths() {
	const paths = locales.map((locale) => {
		return { params: { locale: localeToPrefix[locale] } };
	});

	return paths satisfies GetStaticPathsResult;
}

export async function GET(context: APIContext): Promise<Response> {
	const { locale } = context.locals;
	const meta = await getMetadata(locale);

	return rss({
		title: meta.title,
		description: meta.description,
		site: context.site!,
		/** @see https://docs.astro.build/en/guides/rss/#generating-items */
		items: [],
		customData: `<language>${getIntlLanguage(locale)}</language>`,
	});
}

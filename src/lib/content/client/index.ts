import { createClient as createIndexPageClient } from "@/lib/content/client/index-page";
import { createClient as createNavigationClient } from "@/lib/content/client/navigation";
import { createClient as createPagesClient } from "@/lib/content/client/pages";
import type { Client } from "@/lib/content/types";
import type { IntlLanguage } from "@/lib/i18n/locales";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createClient(locale: IntlLanguage) {
	const [pages, indexPage, navigation] = await Promise.all([
		createPagesClient(locale),
		createIndexPageClient(locale),
		createNavigationClient(locale),
	]);

	const client = {
		collections: {
			pages,
		},
		singletons: {
			indexPage,
			navigation,
		},
	} satisfies Client;

	return client;
}

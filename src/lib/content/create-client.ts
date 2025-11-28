import { createClient as createLocalClient } from "@/lib/content/client";
import type { IntlLanguage } from "@/lib/i18n/locales";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createClient(locale: IntlLanguage) {
	const client = await createLocalClient(locale);

	return client;
}

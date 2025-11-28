import type { IntlLocale } from "@/lib/i18n/locales";
import { getIntlMessages } from "@/lib/i18n/messages";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getMetadata(locale: IntlLocale) {
	const { metadata } = await getIntlMessages(locale);

	return metadata;
}

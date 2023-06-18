import type { IntlMessages, Locale } from "@/config/i18n.config";

export function getIntlMessages(locale: Locale): Promise<IntlMessages> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return import(`../messages/${locale}.json`);
}

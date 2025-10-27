import { createTranslator, type NamespaceKeys, type NestedKeyOf } from "use-intl";

import type { IntlLocale } from "@/lib/i18n/locales";
import { getIntlMessages, type IntlMessages } from "@/lib/i18n/messages";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getTranslations(
	locale: IntlLocale,
	namespace?: NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>,
) {
	const messages = await getIntlMessages(locale);

	return createTranslator({ locale, messages, namespace });
}

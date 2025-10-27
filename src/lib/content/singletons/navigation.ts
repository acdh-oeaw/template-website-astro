import { createCollection } from "@acdh-oeaw/content-lib";
import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";

import { reader } from "@/lib/content/keystatic/reader";
import { getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";

function createNavigationCollection<TLocale extends IntlLocale>(locale: TLocale) {
	const language = getIntlLanguage(locale);
	const collection = withI18nPrefix("navigation", language);

	return createCollection({
		name: collection,
		directory: `./content/${language}/navigation/`,
		include: ["index.json"],
		read() {
			return reader.singletons[collection].readOrThrow({ resolveLinkedFiles: true });
		},
		transform(data) {
			return data;
		},
	});
}

export const navigation = {
	de: createNavigationCollection("de-AT"),
	en: createNavigationCollection("en-GB"),
};

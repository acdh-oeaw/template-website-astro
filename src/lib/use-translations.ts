import get from "dlv";
import replace from "templite";

import { type IntlMessages, type Locale, locales } from "~/config/i18n.config";

// TODO: import.meta.glob('@/messages/*.json', { eager: true })
const translations: Record<Locale, IntlMessages> = Object.fromEntries(
	await Promise.all(
		locales.map(async (locale) => {
			return [locale, (await import(`../messages/${locale}.json`)).default];
		}),
	),
);

export function useTranslations<T extends keyof IntlMessages>(locale: Locale, namespace: T) {
	const dictionary = translations[locale][namespace];

	// TODO: improve typing
	return function translate(path: string, params?: Record<string, unknown>) {
		const value = get(dictionary, path, "");
		if (params == null) return value;
		return replace(value, params);
	};
}

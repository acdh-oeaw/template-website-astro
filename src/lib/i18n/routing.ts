import type { IntlLanguage, IntlLocale } from "@/lib/i18n/locales";

export const localeToPrefix = {
	"de-AT": "de",
	"en-GB": "en",
} as const satisfies Record<IntlLocale, IntlLanguage>;

export const prefixToLocale = {
	de: "de-AT",
	en: "en-GB",
} as const satisfies Record<IntlLanguage, IntlLocale>;

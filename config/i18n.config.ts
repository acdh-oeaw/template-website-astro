import type de from "@/messages/de.json";
import type en from "@/messages/en.json";

export const locales = ["de", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type IntlMessages = typeof en;

export interface Translations extends Record<Locale, IntlMessages> {
	de: typeof de;
	en: typeof en;
}

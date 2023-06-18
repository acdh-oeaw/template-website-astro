import { assert } from "@acdh-oeaw/lib";

import { type Locale, locales } from "@/config/i18n.config";

export function assertLocale(value: string | undefined): asserts value is Locale {
	assert(locales.includes(value as Locale), `Invalid locale: ${value}.`);
}

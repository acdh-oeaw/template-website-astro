import { type APIContext, type AstroGlobal } from "astro";

import { assertLocale } from "@/lib/assert-locale";
import { type Locale } from "@/config/i18n.config";

export function useLocale(context: APIContext | Readonly<AstroGlobal>): Locale {
	const locale = context.params.locale;

	assertLocale(locale);

	return locale;
}

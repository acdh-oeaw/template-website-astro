import { prefixPathname } from "@/lib/prefix-pathname";
import { type Locale } from "@/config/i18n.config";

export function useLocaleLink(locale: Locale) {
	return function l(href: URL | string) {
		if (typeof href === "string") {
			return prefixPathname(locale, href);
		}

		const url = new URL(href);
		url.pathname = prefixPathname(locale, url.pathname);
		return url;
	};
}

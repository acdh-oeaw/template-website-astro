import { type Locale } from "~/config/i18n.config";

export function prefixPathname(locale: Locale, pathname: string): string {
	return ["/", locale, pathname.startsWith("/") ? "" : "/", pathname].join("");
}

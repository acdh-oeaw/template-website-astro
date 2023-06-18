import { locales } from "@/config/i18n.config";

export function unprefixPathname(pathname: string): string {
	if (
		locales.some((locale) => {
			return pathname.startsWith("/" + locale);
		})
	) {
		return pathname.split("/").slice(2).join("/");
	}

	return pathname;
}

import { env } from "@/config/env.config";

export function getUnprefixedPathname(pathname: string): string {
	const _pathname =
		env.PUBLIC_APP_BASE_PATH != null ? pathname.slice(env.PUBLIC_APP_BASE_PATH.length) : pathname;

	const [leadingSlash, _locale, ...segments] = _pathname.split("/");

	if (segments.length === 0) {
		return "/";
	}

	return [leadingSlash, ...segments].join("/");
}

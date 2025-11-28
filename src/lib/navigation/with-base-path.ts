import { addTrailingSlash } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";

export function withBasePath(pathname: string): string {
	if (!pathname.startsWith("/")) {
		return pathname;
	}

	if (env.PUBLIC_APP_BASE_PATH != null) {
		const basePath = addTrailingSlash(env.PUBLIC_APP_BASE_PATH);

		return `${basePath}${pathname.slice(1)}`;
	}

	return pathname;
}

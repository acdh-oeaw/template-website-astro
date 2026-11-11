import { makeHandler } from "@keystatic/astro/api";
import type { APIRoute } from "astro";

import { config } from "@/lib/content/keystatic/config";
import { isKeystaticEnabled } from "@/lib/content/keystatic/is-keystatic-enabled";

export const prerender = false;

const handler = makeHandler({ config });

export const ALL: APIRoute = (context) => {
	if (!isKeystaticEnabled) {
		return new Response(null, { status: 404 });
	}

	return handler(context);
};

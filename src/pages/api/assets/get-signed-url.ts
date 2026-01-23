import { log } from "@acdh-oeaw/lib";
import type { APIRoute } from "astro";
import * as v from "valibot";

// import { isAuthorized } from "@/lib/auth/is-authorized";
import { client } from "@/lib/image-service/client";

export const prerender = false;

const FormDataSchema = v.object({
	key: v.pipe(v.string(), v.nonEmpty()),
	width: v.optional(
		v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(100), v.maxValue(1600)),
		"400",
	),
});

export const POST: APIRoute = async function handler({ cookies: _cookies, request }) {
	try {
		const origin = request.headers.get("origin");
		const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

		if (!origin || !host || URL.parse(origin)?.host !== host.toLowerCase()) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		// TODO: rate limit

		// TODO: do we need to check auth here?
		// if (!(await isAuthorized(request, cookies))) {
		// 	return Response.json({ error: "Forbidden" }, { status: 403 });
		// }

		const result = await v.safeParseAsync(FormDataSchema, await request.json());

		if (!result.success) {
			return Response.json({ error: "Invalid input" }, { status: 400 });
		}

		const { key, width } = result.output;

		const { url } = client.urls.generateSignedImageUrl({ key, options: { width } });

		return Response.json({ url });
	} catch (error) {
		log.error(error);

		const message = error instanceof Error ? error.message : "Internal server error";

		return Response.json({ error: message }, { status: 500 });
	}
};

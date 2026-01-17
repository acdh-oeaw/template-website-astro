import { log } from "@acdh-oeaw/lib";
import type { APIRoute } from "astro";
import * as v from "valibot";

import { isAuthorized } from "@/lib/auth/is-authorized";
import { client } from "@/lib/object-store/client";

export const prerender = false;

const FormDataSchema = v.object({
	file: v.pipe(
		v.file(),
		v.check((input) => {
			return input.type.startsWith("image/");
		}),
	),
});

export const POST: APIRoute = async function handler({ cookies, request }) {
	try {
		const origin = request.headers.get("origin");
		const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

		if (!origin || !host || URL.parse(origin)?.host !== host.toLowerCase()) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		// TODO: rate limit

		if (!(await isAuthorized(request, cookies))) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		const formData = await request.formData();

		const result = await v.safeParseAsync(FormDataSchema, { file: formData.get("file") });

		if (!result.success) {
			return Response.json({ error: "Invalid input" }, { status: 400 });
		}

		const { file } = result.output;

		const { key, width, height } = await client.assets.upload({ file });

		return Response.json({ key, width, height });
	} catch (error) {
		log.error(error);

		const message = error instanceof Error ? error.message : "Internal server error";

		return Response.json({ error: message }, { status: 500 });
	}
};

import { log } from "@acdh-oeaw/lib";
import type { APIRoute } from "astro";

import { isAuthorized } from "@/lib/auth/is-authorized";
import { client as imgproxy } from "@/lib/image-service/client";
import { client } from "@/lib/object-store/client";

export const prerender = false;

export const GET: APIRoute = async function handler({ cookies, request }) {
	try {
		// TODO: rate limit

		if (!(await isAuthorized(request, cookies))) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		const { objects } = await client.assets.list({ prefix: "images" });

		const images = objects.map(({ key, width, height }) => {
			const { url } = imgproxy.urls.generateSignedImageUrl({ key, options: { width: 400 } });

			return { key, width, height, url };
		});

		return Response.json({ images });
	} catch (error) {
		log.error(error);

		const message = error instanceof Error ? error.message : "Internal server error";

		return Response.json({ error: message }, { status: 500 });
	}
};

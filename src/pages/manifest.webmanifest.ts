import type { APIContext } from "astro";

import { getMetadata } from "@/lib/i18n/get-metadata";

export async function GET(context: APIContext): Promise<Response> {
	const { locale } = context.locals;
	const meta = await getMetadata(locale);

	const manifest = {
		name: meta.manifest.name,
		short_name: meta.manifest["short-name"],
		description: meta.manifest.description,
		icons: [
			{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
			{ src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
			{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
			{ src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
		],
		theme_color: "#28d8d8",
		background_color: "#28d8d8",
		display: "standalone",
		start_url: "/",
	};

	return Response.json(manifest);
}

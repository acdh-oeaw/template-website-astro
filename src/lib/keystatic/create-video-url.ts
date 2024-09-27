import type { VideoProvider } from "@/lib/keystatic/component-options";
import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

export function createVideoUrl(
	provider: VideoProvider,
	id: string,
	startTime?: number | null,
): URL {
	switch (provider) {
		case "youtube": {
			return createUrl({
				baseUrl: "https://www.youtube-nocookie.com",
				pathname: `/embed/${id}`,
				searchParams: startTime ? createUrlSearchParams({ start: startTime }) : undefined,
			});
		}
	}
}

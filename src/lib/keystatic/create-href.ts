import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import type { ValueForReading } from "@keystatic/core";

export type CreateHrefParams = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function createHref(params: CreateHrefParams) {
	switch (params.discriminant) {
		case "download": {
			return { download: true, href: params.value };
		}

		case "external": {
			return { href: params.value };
		}

		case "pages": {
			return { href: `/${params.value}/` };
		}
	}
}

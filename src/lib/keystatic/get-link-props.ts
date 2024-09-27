import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import type { ValueForReading } from "@keystatic/core";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "download": {
			return { download: true, href: params.value };
		}

		case "external": {
			return { href: params.value };
		}

		case "index-page": {
			return { href: "/" };
		}

		case "pages": {
			return { href: `/${params.value}/` };
		}
	}
}

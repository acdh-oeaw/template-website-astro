import { createAssetOptions, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import type { Locale } from "@/config/i18n.config";
import { linkKinds } from "@/lib/keystatic/component-options";

export function createLinkSchema(assetPath: `/${string}/`, locale: Locale) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(assetPath),
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			"index-page": fields.empty(),
			pages: fields.relationship({
				label: "Pages",
				validation: { isRequired: true },
				collection: withI18nPrefix("pages", locale),
			}),
		},
	);
}

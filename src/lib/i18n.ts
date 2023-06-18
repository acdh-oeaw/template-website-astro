import { assert } from "@acdh-oeaw/lib";
import dlv from "dlv";
import tmpl from "templite";
import type { Get, Paths } from "type-fest";

import type { IntlMessages, Locale } from "@/config/i18n.config";
import { getIntlMessages } from "@/lib/get-intl-messages";

export async function createI18n(locale: Locale) {
	const messages = await getIntlMessages(locale);

	return {
		/** @see https://github.com/lukeed/rosetta/blob/master/src/index.js */
		t<T extends Paths<IntlMessages>>(
			// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
			this: void,
			key: T,
			params: object = {},
		): Get<IntlMessages, T> {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const value = dlv(messages, key);

			assert(value != null, `Missing translation for ${key}.`);

			if (typeof value === "string") {
				return tmpl(value, params) as Get<IntlMessages, T>;
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return value;
		},
	};
}

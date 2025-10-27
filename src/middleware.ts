import { defineMiddleware } from "astro:middleware";

import { defaultLocale, type IntlLocale } from "@/lib/i18n/locales";
import { prefixToLocale } from "@/lib/i18n/routing";

declare global {
	namespace App {
		interface Locals {
			locale: IntlLocale;
		}
	}
}

function isValidPrefix(prefix: string): prefix is keyof typeof prefixToLocale {
	return Object.hasOwn(prefixToLocale, prefix);
}

export const onRequest = defineMiddleware(async (context, next) => {
	const prefix = context.params.locale;

	if (prefix != null && isValidPrefix(prefix)) {
		context.locals.locale = prefixToLocale[prefix];
	} else if (context.routePattern === "/404") {
		const _prefix = context.url.pathname.split("/", 2).at(1);

		// eslint-disable-next-line unicorn/prefer-ternary
		if (_prefix != null && isValidPrefix(_prefix)) {
			context.locals.locale = prefixToLocale[_prefix];
		} else {
			context.locals.locale = defaultLocale;
		}
	} else {
		context.locals.locale = defaultLocale;
	}

	return next();
});

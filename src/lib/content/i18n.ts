import { type Locale, locales } from "@/config/i18n.config";

export function i18n<TInput extends Record<string, (locale: Locale) => unknown>>(input: TInput) {
	return Object.fromEntries(
		locales.flatMap((locale) => {
			return Object.entries(input).map(([name, collection]) => {
				return [withI18nPrefix(locale, name), collection(locale)];
			});
		}),
	) as {
		[K in keyof TInput as K extends string ? `${Locale}:${K}` : never]: ReturnType<TInput[K]>;
	};
}

export function withI18nPrefix<T extends string>(locale: Locale, name: T) {
	return `${locale}:${name}` as const;
}

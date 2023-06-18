import { type Locale, locales } from "~/config/i18n.config";

const formatters = new Map(
	locales.map((locale) => {
		return [
			locale,
			{
				date: new Intl.DateTimeFormat(locale),
				list: new Intl.ListFormat(locale),
			},
		];
	}),
);

export function date(locale: Locale, value: Date | number) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const formatter = formatters.get(locale)!.date;
	return formatter.format(value);
}

export function list(locale: Locale, value: Iterable<string>) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const formatter = formatters.get(locale)!.list;
	return formatter.format(value);
}

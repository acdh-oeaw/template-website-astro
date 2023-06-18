import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { assert } from "@acdh-oeaw/lib";

import type { Locale } from "@/config/i18n.config";
import type { Collections } from "@/lib/content/collections";
import { createReader } from "@/lib/content/create-reader";
import { getMdxContent } from "@/lib/content/get-mdx-content";
import { withI18nPrefix } from "@/lib/content/i18n";
import type { Singletons } from "@/lib/content/singletons";

export function createCollectionResource<T extends Collections>(name: T, locale: Locale) {
	const reader = createReader();
	const i18nName = withI18nPrefix(locale, name);

	const collectionReader = reader.collections[i18nName];
	const collectionConfig = reader.config.collections[i18nName];

	assert(collectionConfig.path);

	function baseUrl(id: string) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return pathToFileURL(join(process.cwd(), collectionConfig.path!.replace(/\*+/, id)));
	}

	async function compile(id: string, code: string | (() => Promise<string>)) {
		return getMdxContent(typeof code === "string" ? code : await code(), locale, baseUrl(id));
	}

	function list() {
		return collectionReader.list();
	}

	async function read(id: string) {
		const data = await collectionReader.readOrThrow(id, { resolveLinkedFiles: true });

		return {
			id,
			data,
			compile(code: string | (() => Promise<string>)) {
				return compile(id, code);
			},
		};
	}

	async function all() {
		const ids = await list();

		return Promise.all(ids.map(read));
	}

	return {
		all,
		baseUrl,
		compile,
		list,
		read,
	};
}

export function createSingletonResource<T extends Singletons>(name: T, locale: Locale) {
	const reader = createReader();
	const i18nName = withI18nPrefix(locale, name);

	const singletonReader = reader.singletons[i18nName];
	const singletonConfig = reader.config.singletons[i18nName];

	assert(singletonConfig.path);

	function baseUrl() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return pathToFileURL(join(process.cwd(), singletonConfig.path!));
	}

	async function compile(code: string | (() => Promise<string>)) {
		return getMdxContent(typeof code === "string" ? code : await code(), locale, baseUrl());
	}

	async function read() {
		const data = await singletonReader.readOrThrow({ resolveLinkedFiles: true });

		return {
			data,
			compile,
		};
	}

	return {
		baseUrl,
		compile,
		read,
	};
}

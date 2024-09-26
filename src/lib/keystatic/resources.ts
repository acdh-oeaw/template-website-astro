import { createReaders } from "@acdh-oeaw/keystatic-lib/reader";

import config from "~/keystatic.config";
import { compileMdx } from "@/lib/keystatic/compile-mdx";

export const { createCollectionResource, createSingletonResource } = createReaders(
	config,
	compileMdx,
);

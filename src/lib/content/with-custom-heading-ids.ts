import "mdast-util-mdx-jsx";

import { assert } from "@acdh-oeaw/lib";
import type { Root } from "hast";
import { heading as isHeadingElement } from "hast-util-heading";
import { SKIP, visit } from "unist-util-visit";

export function withCustomHeadingIds() {
	return function transformer(tree: Root) {
		visit(tree, "mdxJsxTextElement", (node, index, parent) => {
			if (parent == null) return undefined;
			if (index == null) return undefined;

			if (node.name !== "HeadingId") return undefined;

			assert(
				isHeadingElement(parent),
				"`<HeadingId>` must be a direct child of a heading element.",
			);

			const id = node.attributes.find((attribute) => {
				return attribute.type === "mdxJsxAttribute" && attribute.name === "id";
			})?.value;

			assert(id, "`<HeadingId>` has no `id` prop.");

			if (parent.properties.id == null) {
				parent.properties.id = String(id);
			}

			parent.children.splice(index, 1);

			return SKIP;
		});
	};
}

import "mdast-util-mdx-jsx";

import type { Root } from "hast";
import { toString } from "hast-util-to-string";
import { SKIP, visit } from "unist-util-visit";

export function withIframeTitles() {
	return function transformer(tree: Root) {
		visit(tree, "mdxJsxFlowElement", (node) => {
			if (node.name == null) return undefined;

			if (!["Embed", "Video"].includes(node.name)) return undefined;

			const title = node.attributes.find(
				(attribute) => attribute.type === "mdxJsxAttribute" && attribute.name === "title",
			);

			if (title != null) return undefined;

			node.attributes.push({
				type: "mdxJsxAttribute",
				name: "title",
				value: toString(node),
			});

			return SKIP;
		});
	};
}

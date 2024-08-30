import "mdast-util-mdx-jsx";

import type { FootnoteDefinition, FootnoteReference, Root } from "mdast";
import { SKIP, visit } from "unist-util-visit";

export function withFootnotes() {
	return function transformer(tree: Root) {
		let count = 1;

		visit(tree, "mdxJsxTextElement", (node, index, parent) => {
			if (parent == null) return undefined;
			if (index == null) return undefined;

			if (node.name !== "Footnote") return undefined;

			/** Add prefix to avoid collisions with gfm footnotes in source mdx. */
			const id = `fn-${String(count)}`;

			const reference: FootnoteReference = {
				type: "footnoteReference",
				identifier: id,
				label: id,
			};

			const definition: FootnoteDefinition = {
				type: "footnoteDefinition",
				identifier: id,
				label: id,
				/** `<Footnote>` has phrasing/inline content as children, so we wrap them in a paragraph. */
				children: [
					{
						type: "paragraph",
						children: node.children,
					},
				],
			};

			parent.children.splice(index, 1, reference);

			tree.children.push(definition);

			count++;

			return SKIP;
		});
	};
}

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { valueToEstree } from "estree-util-value-to-estree";
import type { Root } from "hast";
import { headingRank as rank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

interface Heading {
	value: string;
	depth: number;
	id?: string;
}

interface TocEntry extends Heading {
	children?: Array<TocEntry>;
}

export type Toc = Array<TocEntry>;

declare module "vfile" {
	interface DataMap {
		toc: Toc;
	}
}
export function withTableOfContents() {
	return function transformer(tree: Root, vfile: VFile) {
		const headings: Array<Heading> = [];

		visit(tree, "element", (element) => {
			const level = rank(element);

			if (level != null) {
				const heading: Heading = {
					depth: level,
					value: toString(element),
				};

				if (isNonEmptyString(element.properties.id)) {
					heading.id = element.properties.id;
				}

				headings.push(heading);
			}
		});

		vfile.data.toc = createTree(headings);

		function createTree(headings: Array<Heading>) {
			const root: TocEntry = { depth: 0, children: [], value: "" };
			const parents: Array<TocEntry> = [];
			let previous: TocEntry = root;

			headings.forEach((heading) => {
				if (heading.depth > previous.depth) {
					previous.children ??= [];
					parents.push(previous);
				} else if (heading.depth < previous.depth) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					while (parents.at(-1)!.depth >= heading.depth) {
						parents.pop();
					}
				}

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const parent = parents.at(-1)!;
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				parent.children!.push(heading);
				previous = heading;
			});

			return root.children;
		}
	};
}

export function withMdxTableOfContents() {
	const name = "tableOfContents";

	return function transformer(tree: Root, vfile: VFile) {
		if (vfile.data.toc == null) return;

		tree.children.unshift({
			type: "mdxjsEsm",
			value: `export const ${name} = ${JSON.stringify(vfile.data.toc)};`,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExportNamedDeclaration",
							source: null,
							specifiers: [],
							declaration: {
								type: "VariableDeclaration",
								kind: "const",
								declarations: [
									{
										type: "VariableDeclarator",
										id: { type: "Identifier", name },
										init: valueToEstree(vfile.data.toc),
									},
								],
							},
						},
					],
				},
			},
		});

		// visit(tree, "mdxJsxFlowElement", (node) => {
		// 	if (node.name !== "TableOfContents") return;

		// 	node.attributes.push({
		// 		type: "mdxJsxAttribute",
		// 		name: "tableOfContents",
		// 		value: {
		// 			type: "mdxJsxAttributeValueExpression",
		// 			value: "tableOfContents",
		// 			data: {
		// 				estree: {
		// 					type: "Program",
		// 					sourceType: "module",
		// 					body: [
		// 						{
		// 							type: "ExpressionStatement",
		// 							expression: {
		// 								type: "Identifier",
		// 								name,
		// 							},
		// 						},
		// 					],
		// 				},
		// 			},
		// 		},
		// 	});
		// });
	};
}

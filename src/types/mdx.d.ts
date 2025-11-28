import type * as runtime from "astro/jsx-runtime";

declare module "mdx/types" {
	namespace JSX {
		// type Element = runtime.JSX.Element;
		type Element = HTMLElement;
		interface IntrinsicElements extends runtime.JSX.IntrinsicElements {}
	}
}

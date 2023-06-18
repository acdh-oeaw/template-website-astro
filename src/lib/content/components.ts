/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Callout from "@/components/content/callout.astro";
import Disclosure from "@/components/content/disclosure.astro";
import Embed from "@/components/content/embed.astro";
import Figure from "@/components/content/figure.astro";
import Grid from "@/components/content/grid.astro";
import GridItem from "@/components/content/grid-item.astro";
import Img from "@/components/content/img.astro";
import Link from "@/components/content/link.astro";
import LinkButton from "@/components/content/link-button.astro";
import Tab from "@/components/content/tab.astro";
import TableOfContents from "@/components/content/table-of-contents.astro";
import Tabs from "@/components/content/tabs.astro";
import Video from "@/components/content/video.astro";
import Anchor from "@/components/link.astro";

const components = {
	a: Anchor,
	Callout,
	Disclosure,
	Embed,
	Figure,
	Grid,
	GridItem,
	img: Img,
	Link,
	LinkButton,
	Tab,
	TableOfContents,
	Tabs,
	Video,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}

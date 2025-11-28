/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Embed from "@/components/content/embed.astro";
import Figure from "@/components/content/figure.astro";
import Image from "@/components/content/img.astro";
import ContentLink from "@/components/content/link.astro";
import Link from "@/components/link.astro";

export const components = {
	a: Link,
	Embed,
	Figure,
	img: Image,
	Link: ContentLink,
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}

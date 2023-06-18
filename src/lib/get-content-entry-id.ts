import { type CollectionEntry } from "astro:content";

export function getContentEntryId(
	entry: CollectionEntry<"pages"> | CollectionEntry<"posts">,
): string {
	return entry.slug.split("/").slice(1).join("/");
}

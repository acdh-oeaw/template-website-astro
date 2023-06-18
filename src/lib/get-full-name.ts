import { isNonEmptyString } from "@acdh-oeaw/lib";
import { type CollectionEntry } from "astro:content";

export function getFullName(person: CollectionEntry<"persons">): string {
	return [person.data.firstName, person.data.lastName].filter(isNonEmptyString).join(" ");
}

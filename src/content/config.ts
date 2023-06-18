import { defineCollection, reference, z } from "astro:content";

const pages = defineCollection({
	type: "content",
	schema() {
		return z.object({
			title: z.string(),
			description: z.string(),
		});
	},
});

const persons = defineCollection({
	type: "data",
	schema({ image }) {
		return z.object({
			firstName: z.string().optional(),
			lastName: z.string(),
			image: image(),
			description: z.string(),
			email: z.string(),
		});
	},
});

const posts = defineCollection({
	type: "content",
	schema({ image }) {
		return z.object({
			title: z.string(),
			description: z.string(),
			date: z.date({ coerce: true }),
			featuredImage: image().optional(),
			// TODO: Either require prefixed ids, line `en/firstname-lastname`,
			// or figure out how to use `z.preprocess` to add the locale prefix before
			// validating with `reference`.
			authors: z.array(reference("persons")).min(1),
		});
	},
});

export const collections = { pages, persons, posts };

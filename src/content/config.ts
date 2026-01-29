import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            slug: z.string(), // URL slug, e.g. "where-have-all-the-monkeys-gone"
            year: z.string(),
            role: z.string(),
            visitUrl: z.string().optional(),
            visitHeading: z.string().optional(),
            heroDescription: z.string(),
            featuredPosition: z
                .union([z.literal(1), z.literal(2), z.literal(3)])
                .optional(), // Pin to position 1, 2, or 3 on homepage
            publishDate: z.coerce.date().optional(), // Used for sorting projects
            coverImages: z.array(image().or(z.string())).optional(),
            results: z
                .object({
                    heading: z.string().optional(),
                    items: z.array(
                        z.object({
                            title: z.string(),
                            description: z.string(),
                        })
                    ),
                })
                .optional(),
        }),
});

export const collections = {
    projects,
} as const;

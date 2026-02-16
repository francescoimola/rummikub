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
            skills: z.array(z.string()).optional(),
            visitUrl: z.string().optional(),
            visitHeading: z.string().optional(),
            heroDescription: z.string(),
            caseStudyStatus: z
                .enum(["coming-soon", "on-request"])
                .optional(), // If set, project is a draft: appears on homepage with badge, but no individual page is generated
            featuredPosition: z
                .union([z.literal(1), z.literal(2), z.literal(3)])
                .optional(), // Pin to position 1, 2, or 3 on homepage
            publishDate: z.coerce.date().optional(), // Used for sorting projects
            coverImages: z.array(image().or(z.string())).min(1),
            coverLayout: z.enum(["default", "plain"]).default("default").optional(),
            showCover: z.boolean().default(true),
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

const blog = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            slug: z.string().default(""),
            publishedDate: z.coerce.date(),
            excerpt: z.string(),
            coverImage: image(),
            tags: z.array(z.string()),
        }),
});

export const collections = {
    projects,
    blog,
} as const;

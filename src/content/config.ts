import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const MAX_META_DESCRIPTION_LENGTH = 160;

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
            metaDescription: z.string().max(MAX_META_DESCRIPTION_LENGTH).optional(),
            caseStudyStatus: z
                .enum(["coming-soon", "on-request"])
                .optional(), // If set, project is a draft: appears on homepage with badge, but no individual page is generated
            featuredPosition: z
                .union([z.literal(1), z.literal(2), z.literal(3)])
                .optional(), // Pin to position 1, 2, or 3 on homepage
            publishDate: z.coerce.date().optional(), // Used for sorting projects
            coverImage: image(),
            coverAlt: z.string(),
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
        }).superRefine((data, ctx) => {
            if (data.heroDescription.length > MAX_META_DESCRIPTION_LENGTH && !data.metaDescription) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `"${data.slug}": heroDescription is ${data.heroDescription.length} chars (max ${MAX_META_DESCRIPTION_LENGTH}) and no metaDescription is set. Add a metaDescription to avoid an overly long meta tag.`,
                    path: ["metaDescription"],
                });
            }
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

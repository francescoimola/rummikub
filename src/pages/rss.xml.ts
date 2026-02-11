import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SEO, SITE_DATA } from "../constants";

export async function GET(context: APIContext) {
    const posts = await getCollection("blog");

    // Sort by date descending
    const sortedPosts = posts.sort(
        (a, b) =>
            new Date(b.data.publishedDate).valueOf() -
            new Date(a.data.publishedDate).valueOf()
    );

    return rss({
        title: `${SITE_DATA.name}'s Blog`,
        description: SEO.pages.blog.description,
        site: context.site ?? "https://francescoimola.com",
        items: sortedPosts.map((post) => {
            const slug = post.data.slug || post.id.replace(/\.mdx$/, "");
            return {
                title: post.data.title,
                pubDate: post.data.publishedDate,
                description: post.data.excerpt,
                link: `/blog/${slug}/`,
                categories: post.data.tags,
            };
        }),
        customData: `<language>en-gb</language>`,
    });
}

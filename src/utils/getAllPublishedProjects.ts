import { getCollection, type CollectionEntry } from "astro:content";

export async function getAllPublishedProjects(): Promise<CollectionEntry<"projects">[]> {
    const projects = await getCollection("projects");

    // Sort by publishDate descending (newest first)
    return projects.sort((a, b) =>
        (b.data.publishDate?.valueOf() ?? 0) - (a.data.publishDate?.valueOf() ?? 0)
    );
}

import { getCollection, type CollectionEntry } from "astro:content";

type Project = CollectionEntry<"projects">;

export async function getAllPublishedProjects(): Promise<Project[]> {
    const allProjects = await getCollection("projects");

    // Sort by publishDate descending (newest first)
    allProjects.sort((a, b) => {
        const dateA = a.data.publishDate?.getTime() ?? 0;
        const dateB = b.data.publishDate?.getTime() ?? 0;
        return dateB - dateA;
    });

    // Validate coverImages exist
    for (const project of allProjects) {
        if (!project.data.coverImages || project.data.coverImages.length === 0) {
            throw new Error(
                `Project "${project.data.title}" is missing coverImages.`
            );
        }
    }

    return allProjects;
}

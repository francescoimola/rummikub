import { getCollection, type CollectionEntry } from "astro:content";

type Project = CollectionEntry<"projects">;

export async function getFeaturedProjects(): Promise<Project[]> {
    const allProjects = await getCollection("projects");

    // Separate featured and unfeatured projects
    const featuredProjects = allProjects.filter(
        (p) => p.data.featuredPosition !== undefined
    );
    const unfeaturedProjects = allProjects.filter(
        (p) => p.data.featuredPosition === undefined
    );

    // Check for position conflicts
    const positionMap = new Map<number, Project[]>();
    for (const project of featuredProjects) {
        const pos = project.data.featuredPosition!;
        const existing = positionMap.get(pos) || [];
        existing.push(project);
        positionMap.set(pos, existing);
    }

    for (const [position, projects] of positionMap) {
        if (projects.length > 1) {
            const titles = projects.map((p) => `"${p.data.title}"`).join(" and ");
            throw new Error(
                `Featured position conflict: ${titles} both claim position ${position}. ` +
                    `Each project must have a unique featuredPosition (1, 2, or 3).`
            );
        }
    }

    // Sort unfeatured by publishDate descending (newest first)
    unfeaturedProjects.sort((a, b) => {
        const dateA = a.data.publishDate?.getTime() ?? 0;
        const dateB = b.data.publishDate?.getTime() ?? 0;
        return dateB - dateA;
    });

    // Build 3 slots
    const slots: (Project | null)[] = [null, null, null];

    // Place featured projects in their requested slots
    for (const project of featuredProjects) {
        const index = project.data.featuredPosition! - 1; // Convert 1-based to 0-based
        slots[index] = project;
    }

    // Fill remaining slots with unfeatured projects
    let unfeaturedIndex = 0;
    for (let i = 0; i < 3; i++) {
        if (slots[i] === null && unfeaturedIndex < unfeaturedProjects.length) {
            slots[i] = unfeaturedProjects[unfeaturedIndex];
            unfeaturedIndex++;
        }
    }

    // Filter to non-null projects
    const result = slots.filter((p): p is Project => p !== null);

    // Validate that all selected projects have coverImages
    for (const project of result) {
        if (!project.data.coverImages || project.data.coverImages.length === 0) {
            throw new Error(
                `Project "${project.data.title}" is missing coverImages. ` +
                    `All projects displayed on the homepage must have coverImages defined in frontmatter.`
            );
        }
    }

    return result;
}

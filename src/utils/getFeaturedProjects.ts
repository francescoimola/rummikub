import { getCollection, type CollectionEntry } from "astro:content";

export async function getFeaturedProjects(): Promise<CollectionEntry<"projects">[]> {
    const projects = await getCollection("projects");

    // Split into featured map and unfeatured list
    const featured = new Map<number, CollectionEntry<"projects">>();
    const unfeatured: CollectionEntry<"projects">[] = [];

    for (const p of projects) {
        const pos = p.data.featuredPosition;
        if (pos) {
            if (featured.has(pos)) {
                throw new Error(
                    `Featured position conflict: "${featured.get(pos)?.data.title}" and "${p.data.title}" both claim position ${pos}.`
                );
            }
            featured.set(pos, p);
        } else {
            unfeatured.push(p);
        }
    }

    // Sort unfeatured by date descending
    unfeatured.sort((a, b) =>
        (b.data.publishDate?.valueOf() ?? 0) - (a.data.publishDate?.valueOf() ?? 0)
    );

    // Build the 3 slots: prefer featured for pos 1-3, fill gaps with unfeatured
    const result: CollectionEntry<"projects">[] = [];
    let unfeaturedIdx = 0;

    for (let pos = 1; pos <= 3; pos++) {
        const project = featured.get(pos) ?? unfeatured[unfeaturedIdx++];
        if (project) result.push(project);
    }

    return result;
}

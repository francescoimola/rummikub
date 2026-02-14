import { Tabs, Text } from "@radix-ui/themes";

interface BlogFiltersProps {
    tags: string[];
}

export default function BlogFilters({ tags }: BlogFiltersProps) {
    return (
        <Tabs.Root
            defaultValue="all"
            className="blog-filters"
            onValueChange={(value) => {
                document.dispatchEvent(
                    new CustomEvent("blog-filter", { detail: value })
                );
            }}
        >
            <Tabs.List size="2">
                <Tabs.Trigger value="all">
                    <Text size="3">All posts</Text>
                </Tabs.Trigger>
                {tags.map((tag) => (
                    <Tabs.Trigger key={tag} value={tag.toLowerCase()}>
                        <Text size="3">{tag}</Text>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
}

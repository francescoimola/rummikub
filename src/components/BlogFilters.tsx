import { Tabs, Text } from "@radix-ui/themes";

interface BlogFiltersProps {
    tags: string[];
}

export default function BlogFilters({ tags }: BlogFiltersProps) {
    const filters = [
        { value: "all", label: "All posts" },
        ...tags.map((tag) => ({ value: tag.toLowerCase(), label: tag })),
    ];

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
                {filters.map((filter) => (
                    <Tabs.Trigger key={filter.value} value={filter.value}>
                        <Text size="3">{filter.label}</Text>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
}

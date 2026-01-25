import { Tabs, Text } from "@radix-ui/themes";

const filters = [
    { value: "all", label: "All posts" },
    { value: "seo", label: "SEO" },
    { value: "sustainability", label: "Sustainability" },
    { value: "webdesign", label: "Web Design" },
];

export default function BlogFilters() {
    return (
        <Tabs.Root defaultValue="all" className="blog-filters">
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

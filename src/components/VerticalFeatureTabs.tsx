import * as Tabs from "@radix-ui/react-tabs";
import { Box, Heading, Text, Flex } from "@radix-ui/themes";

export interface TabItem {
    id: string;
    title: string;
    content: string;
}

interface VerticalFeatureTabsProps {
    items: TabItem[];
    defaultValue?: string;
}

export const VerticalFeatureTabs = ({
    items,
    defaultValue,
}: VerticalFeatureTabsProps) => {
    const initialValue = defaultValue || items[0]?.id;

    if (!items.length) return null;

    return (
        <Tabs.Root
            defaultValue={initialValue}
            orientation="vertical"
        >
            <Flex
                direction={{ initial: "column", md: "row" }}
                gapX={{ initial: "4", sm: "6" }}
                gapY="6"
            >
                {/* Tab List / Triggers */}
                <Tabs.List className="tabs-list">
                    {items.map((item) => (
                        <Tabs.Trigger
                            key={item.id}
                            value={item.id}
                            className="tabs-trigger"

                        >
                            <Heading as="h3" size="3" weight="medium" className="trigger-text">
                                <span dangerouslySetInnerHTML={{ __html: item.title }} />
                            </Heading>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {/* Tab Content */}
                <Box flexGrow="1" pt="2">
                    {items.map((item) => (
                        <Tabs.Content key={item.id} value={item.id} className="tabs-content">
                            <Text asChild size="3">
                                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                            </Text>
                        </Tabs.Content>
                    ))}
                </Box>
            </Flex>
        </Tabs.Root>
    );
};

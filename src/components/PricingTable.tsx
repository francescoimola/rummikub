import { Flex, Grid, Text, Separator, Box } from "@radix-ui/themes";

interface PricingItem {
    title: string;
    asterisks?: number;
    price: string;
    description: string;
}

interface PricingTableProps {
    items: PricingItem[];
    footnotes?: string[];
    introText?: string[];
    closingText?: string;
}

function PricingItemRow({ item }: { item: PricingItem }) {
    const asteriskStr = item.asterisks ? "*".repeat(item.asterisks) : "";

    return (
        <Grid gap="4" columns={{ initial: "1", md: "2" }}>
            <Flex direction="column">
                <Text size="3" weight="medium" highContrast>
                    {item.title}{" "}
                    {asteriskStr && (
                        <Text color="gray" weight="regular">
                            {asteriskStr}
                        </Text>
                    )}
                </Text>
                <Text size="3" color="gray">
                    {item.price}
                </Text>
            </Flex>
            <Text size="2" color="gray" wrap="pretty">
                {item.description}
            </Text>
        </Grid>
    );
}

export function PricingTable({ items, footnotes, introText, closingText }: PricingTableProps) {
    return (
        <Flex direction="column" gap="9">
            {introText && introText.length > 0 && (
                <Flex direction="column" gap="3">
                    {introText.map((text, index) => (
                        <Text key={index} size="3" highContrast as="p">
                            {text}
                        </Text>
                    ))}
                </Flex>
            )}
            <Flex direction="column" gap="6">
                {items.map((item, index) => (
                    <Box key={index}>
                        {index > 0 && <Separator size="4" mb="6" />}
                        <PricingItemRow item={item} />
                    </Box>
                ))}
            </Flex>
            {(closingText || (footnotes && footnotes.length > 0)) && (
                <Flex direction="column" gap="4">
                    {closingText && (
                        <Text size="3" as="p">
                            {closingText}
                        </Text>
                    )}
                    {footnotes && footnotes.length > 0 && (
                        <Flex direction="column" gap="1">
                            {footnotes.map((note, index) => (
                                <Text key={index} size="2" color="gray" wrap="pretty">
                                    {note}
                                </Text>
                            ))}
                        </Flex>
                    )}
                </Flex>
            )}
        </Flex>
    );
}

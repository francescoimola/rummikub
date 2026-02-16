import { Flex, Grid, Text, Separator } from "@radix-ui/themes";
import { Fragment } from "react";

interface PricingItem {
    readonly title: string;
    readonly asterisks?: number;
    readonly price: string;
    readonly description: string;
}

interface PricingTableProps {
    readonly items: readonly PricingItem[];
    readonly footnotes?: readonly string[];
    readonly introText?: readonly string[];
    readonly closingText?: string;
}

const PricingItemRow = ({ title, asterisks, price, description }: PricingItem) => (
    <Grid gap="4" columns={{ initial: "1", md: "2" }}>
        <Flex direction="column">
            <Text size="3" weight="medium" highContrast>
                {title}{" "}
                {!!asterisks && (
                    <Text color="gray" weight="regular">
                        {"*".repeat(asterisks)}
                    </Text>
                )}
            </Text>
            <Text size="3" color="gray">
                {price}
            </Text>
        </Flex>
        <Text size="2" color="gray" wrap="pretty">
            {description}
        </Text>
    </Grid>
);

export function PricingTable({ items, footnotes, introText, closingText }: PricingTableProps) {
    return (
        <Flex direction="column" gap="9">
            {!!introText?.length && (
                <Flex direction="column" gap="3">
                    {introText.map((text, i) => (
                        <Text key={i} size="3" highContrast as="p">
                            {text}
                        </Text>
                    ))}
                </Flex>
            )}

            <Flex direction="column" gap="6">
                {items.map((item, i) => (
                    <Fragment key={i}>
                        {i > 0 && <Separator size="4" />}
                        <PricingItemRow {...item} />
                    </Fragment>
                ))}
            </Flex>

            {(closingText || !!footnotes?.length) && (
                <Flex direction="column" gap="4">
                    {closingText && (
                        <Text size="3" as="p">
                            {closingText}
                        </Text>
                    )}
                    {!!footnotes?.length && (
                        <Flex direction="column" gap="1">
                            {footnotes.map((note, i) => (
                                <Text key={i} size="2" color="gray" wrap="pretty">
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

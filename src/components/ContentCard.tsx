import { Flex, Heading, Text } from "@radix-ui/themes";
import React from "react";

interface ContentCardProps {
    backgroundColor?: string;
    heading?: React.ReactNode;
    children: React.ReactNode;
    width?: string | number;
}

export const ContentCard = ({
    backgroundColor = "var(--orange-3)",
    heading,
    children,
    width,
}: ContentCardProps) => {
    return (
        <Flex
            p="5"
            direction="column"
            justify="between"
            gap="9"
            style={{
                backgroundColor,
                width,
            }}
        >
            <Heading size="3" as="h3" weight="medium">
                {heading}
            </Heading>
            <Text as="p" size="3" wrap="pretty">
                {children}
            </Text>
        </Flex>
    );
};

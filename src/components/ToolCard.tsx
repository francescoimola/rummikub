import React from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";

interface ToolCardProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export const ToolCard: React.FC<ToolCardProps> = ({ title, description, children }) => {
    return (
        <Flex
            direction="column"
            align="end"
            justify="between"
            gap="var(--space-10)"
            p="5"
            style={{ backgroundColor: "var(--gray-3)" }}
        >
            {children}
            <Flex direction="column" gap="1">
                <Heading size="3" as="h4" weight="medium">
                    {title}
                </Heading>
                <Text size="3" as="span">
                    {description}
                </Text>
            </Flex>
        </Flex>
    );
};

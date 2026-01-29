import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface BottomCTAProps {
    heading: string;
    text: string;
    backgroundColor?: string;
    children: ReactNode;
}

export const BottomCTA = ({
    heading,
    text,
    backgroundColor = "var(--yellow-5)",
    children,
}: BottomCTAProps) => {
    return (
        <Box
            style={{
                backgroundColor: backgroundColor,
            }}
            py="var(--space-10)"
        >
            <Flex align="center" justify="center" direction="column" gap="6">
                <Heading size="8" weight="medium" highContrast trim="both">
                    {heading}
                </Heading>
                <Text
                    size="3"
                    as="p"
                    highContrast
                    align="center"
                    style={{ maxWidth: "40ch" }}
                >
                    {text}
                </Text>
                {children}
            </Flex>
        </Box>
    );
};

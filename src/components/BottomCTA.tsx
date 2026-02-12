import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface BottomCTAProps {
    heading: string;
    text?: string;
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
        <Container
            className="side-margin"
            style={{
                backgroundColor: backgroundColor,
            }}
            py="var(--space-10)"
        >
            <Flex align="center" justify="center" direction="column" gap="6">
                <Heading size="8" weight="medium" align="center" as="h2" highContrast trim="both" style={{ maxWidth: "var(--max-cw-sm)" }}>
                    {heading}
                </Heading>
                {text && (
                    <Text
                        size="3"
                        as="p"
                        highContrast
                        align="center"
                        style={{ maxWidth: "40ch" }}
                        trim="start"
                    >
                        {text}
                    </Text>
                )}
                {children}
            </Flex>
        </Container>
    );
};

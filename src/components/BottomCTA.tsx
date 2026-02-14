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
}: BottomCTAProps) => (
    <Container
        style={{
            backgroundColor,
            paddingBlock: "var(--space-10)",
        }}
        px={{ initial: "5", sm: "9" }}
    >
        <Flex align="center" direction="column" gap="6">
            <Heading
                as="h2"
                size="8"
                weight="medium"
                align="center"
                highContrast
                trim="both"
                style={{ maxWidth: "var(--max-cw-sm)" }}
            >
                {heading}
            </Heading>

            {text && (
                <Text
                    as="p"
                    size="3"
                    align="center"
                    highContrast
                    trim="start"
                    style={{ maxWidth: "40ch" }}
                >
                    {text}
                </Text>
            )}

            {children}
        </Flex>
    </Container>
);

import { Grid, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface KSPProps {
    heading: ReactNode;
    children: ReactNode;
    grayWordCount?: number;
    multiParagraph?: boolean;
}

export const KSP = ({ heading, children, grayWordCount = 1, multiParagraph }: KSPProps) => {
    const headingContent = typeof heading === "string" ? (
        <>
            <Text color="gray" as="span">
                {heading.split(" ").slice(0, grayWordCount).join(" ")}
            </Text>{" "}
            <Text as="span" highContrast>
                {heading.split(" ").slice(grayWordCount).join(" ")}
            </Text>
        </>
    ) : (
        heading
    );

    return (
        <Grid columns={{ initial: "1", md: "2" }} gapX="6" gapY="2" className="key-service-point">
            <Heading size="3" weight="medium">
                {headingContent}
            </Heading>
            <Text as={multiParagraph ? "div" : "p"} size="3">
                {children}
            </Text>
        </Grid>
    );
};

export const KeyServicePoints = ({ children }: { children: ReactNode }) => (
    <div className="key-service-points">{children}</div>
);

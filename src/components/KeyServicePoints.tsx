import { Grid, Heading, Text } from "@radix-ui/themes";
import React from "react";

interface KeyServicePointProps {
    heading: React.ReactNode;
    children: React.ReactNode;
    /** Number of words (starting from the first) to display in gray. Defaults to 1. */
    grayWordCount?: number;
    /** If true, renders children wrapper as div to allow multiple paragraphs. Defaults to false (renders as p). */
    multiParagraph?: boolean;
}

export const KSP = ({ heading, children, grayWordCount = 1, multiParagraph = false }: KeyServicePointProps) => {
    let headingContent: React.ReactNode = heading;

    if (typeof heading === "string") {
        const words = heading.split(" ");

        // Warn in development if grayWordCount covers all/more words than available
        if (process.env.NODE_ENV !== "production" && grayWordCount >= words.length) {
            console.warn(
                `[KeyServicePoints -> KSP] grayWordCount (${grayWordCount}) is >= total words (${words.length}) in heading "${heading}". ` +
                `This means no words will appear in high contrast. Consider reducing grayWordCount.`
            );
        }

        const grayWords = words.slice(0, grayWordCount).join(" ");
        const restOfHeading = words.slice(grayWordCount).join(" ");
        headingContent = (
            <>
                <Text color="gray" as="span">
                    {grayWords}
                </Text>{" "}
                <Text as="span" highContrast>
                    {restOfHeading}
                </Text>
            </>
        );
    }

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

interface KeyServicePointsProps {
    children: React.ReactNode;
}

export const KeyServicePoints = ({ children }: KeyServicePointsProps) => {
    return (
        <div className="key-service-points">
            {children}
        </div>
    );
};

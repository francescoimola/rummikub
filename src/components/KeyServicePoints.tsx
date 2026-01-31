import { Grid, Heading, Text } from "@radix-ui/themes";
import React from "react";

interface KeyServicePointProps {
    heading: React.ReactNode;
    children: React.ReactNode;
}

export const KeyServicePoint = ({ heading, children }: KeyServicePointProps) => {
    let headingContent: React.ReactNode = heading;

    if (typeof heading === "string") {
        const words = heading.split(" ");
        const firstWord = words[0];
        const restOfHeading = words.slice(1).join(" ");
        headingContent = (
            <>
                <Text color="gray" as="span">
                    {firstWord}
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
            <Text as="p" size="3" wrap="pretty">
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

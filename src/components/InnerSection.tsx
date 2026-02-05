import { Grid, Box, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface InnerSectionProps {
    title?: string;
    header?: ReactNode;
    showCounter?: boolean;
    sectionId?: string;
    children?: ReactNode;
}

export function InnerSection({
    title,
    header,
    showCounter = true,
    sectionId,
    children
}: InnerSectionProps) {
    return (
        <Grid
            asChild
            gapY="8"
            style={{ gridColumn: "1 / -1", gridTemplateColumns: "subgrid" }}
        >
            <section id={sectionId}>
                {/* Section Header */}
                <Box className="section-header">
                    {header ? (
                        header
                    ) : (
                        <Heading
                            size={{ initial: "6", sm: "3" }}
                            weight="medium"
                            as="h2"
                            highContrast
                        >
                            {showCounter && (
                                <Text
                                    as="span"
                                    className="section-counter-number"
                                />
                            )}
                            {title}
                        </Heading>
                    )}
                </Box>

                {/* Section Content */}
                {children}
            </section>
        </Grid>
    );
}

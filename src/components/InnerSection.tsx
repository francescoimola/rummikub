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
    children,
}: InnerSectionProps) {
    return (
        <Grid
            asChild
            gapY="8"
            style={{ gridColumn: "1 / -1", gridTemplateColumns: "subgrid" }}
        >
            <section id={sectionId}>
                <Box className="section-header" my={{ initial: "8", sm: "4", md: "0" }}>
                    {header ?? (
                        <Heading
                            size={{ initial: "8", sm: "6", md: "3" }}
                            align={{ initial: "center", sm: "left" }}
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
                {children}
            </section>
        </Grid>
    );
}

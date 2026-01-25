import { Grid, Box, Heading, Text, Section } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface InnerSectionProps {
    title: string;
    showCounter?: boolean;
    children?: ReactNode;
}

export function InnerSection({
    title,
    showCounter = true,
    children
}: InnerSectionProps) {
    return (
        <Section py="0" asChild>
            <Grid
                gapY="8"
                style={{ gridColumn: "1 / -1", gridTemplateColumns: "subgrid" }}
            >
                {/* Section Header */}
                <Box className="section-header">
                    <Heading
                        size={{ initial: "6", sm: "3" }}
                        weight="medium"
                        as="h2"
                        highContrast
                    >
                        {showCounter && (
                            <Text as="span" className="section-counter-number" />
                        )}
                        {title}
                    </Heading>
                </Box>

                {/* Section Content */}
                {children}
            </Grid>
        </Section>
    );
}
